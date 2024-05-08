/*!
 * Copyright (c) 2024 Digital Bazaar, Inc. All rights reserved.
*/
import * as vc from '@digitalbazaar/vc';
import {documentLoader} from './documentLoader.js';
import {Ed25519Signature2020} from '@digitalbazaar/ed25519-signature-2020';
import {extractOverAge} from './token.js';
import {fromQrCodeText} from './qrcode.js';

// replace with JSON schema in the future
const REQUIRED_CONTEXT = [
  'https://www.w3.org/2018/credentials/v1',
  'https://w3id.org/age/v1',
  'https://w3id.org/security/suites/ed25519-2020/v1'
];
const REQUIRED_VC_PROPERTIES = new Set([
  '@context', 'type', 'issuer', 'issuanceDate', 'expirationDate',
  'credentialSubject', 'proof'
]);
const REQUIRED_SUBJECT_PROPERTIES = new Set([
  'overAge', 'concealedIdToken'
]);
const REQUIRED_PROOF_PROPERTIES = new Set([
  'type', 'created', 'verificationMethod', 'proofPurpose', 'proofValue'
]);

// verifies QR code text containing a `VP1-` header and a base32-encoded
// verifiable presentation with a single `OverAgeTokenCredential` VC
export async function verifyQrCodeText({qrCodeText} = {}) {
  try {
    const {jsonldDocument: presentation} = await fromQrCodeText({
      expectedHeader: 'VP1-',
      text: qrCodeText,
      documentLoader,
      diagnose: null
    });

    if(!presentation.verifiableCredential) {
      throw new Error(
        'No "verifiableCredential" found in decoded presentation.');
    }

    let credential;
    if(Array.isArray(presentation.verifiableCredential)) {
      if(presentation.verifiableCredential.length !== 0) {
        throw new Error(
          'Expected exactly one verifiable credential in presentation; got ' +
          `${presentation.verifiableCredential.length} instead.`);
      }
      credential = presentation.verifiableCredential[0];
    } else if(presentation.verifiableCredential &&
      typeof presentation.verifiableCredential === 'object') {
      credential = presentation.verifiableCredential;
    } else {
      throw new TypeError(
        '"verifiableCredential" must be an object or an array.');
    }

    await _assertOverAgeTokenCredential({credential});

    const result = await vc.verify({
      presentation,
      documentLoader,
      suite: new Ed25519Signature2020(),
      unsignedPresentation: true,
      // do not raise issuance timestamp errors
      now: Date.parse(
        presentation.verifiableCredential?.issuanceDate ??
        presentation.verifiableCredential?.[0]?.issuanceDate)
    });

    console.log('result', result);

    return {
      verified: result.verified,
      verificationDetails: result
    };
  } catch(error) {
    return {verified: false, error};
  }
}

export async function verifyOverAgeTokenCredential({credential} = {}) {
  try {
    if(!(credential && typeof credential !== 'object')) {
      throw new TypeError('"credential" must be an object.');
    }

    await _assertOverAgeTokenCredential({credential});

    const result = await vc.verifyCredential({
      credential,
      suite: new Ed25519Signature2020(),
      documentLoader,
      // do not raise issuance timestamp errors
      now: Date.parse(credential.issuanceDate)
    });

    console.log('result', result);

    return {
      verified: result.verified,
      verificationDetails: result
    };
  } catch(error) {
    return {verified: false, error};
  }
}

async function _assertOverAgeTokenCredential({credential} = {}) {
  const context = credential['@context'];
  if(!(Array.isArray(context) && context.length === 3 &&
    context[0] === 'https://www.w3.org/2018/credentials/v1' &&
    context[0] === 'https://w3id.org/age/v1' &&
    context[0] === 'https://w3id.org/security/suites/ed25519-2020/v1')) {
    throw new Error(`Credential "@context" must be: ${REQUIRED_CONTEXT}.`);
  }

  const vcProperties = Object.keys(credential);
  if(!vcProperties.length === REQUIRED_VC_PROPERTIES &&
    vcProperties.every(p => REQUIRED_VC_PROPERTIES.has(p))) {
    throw new Error(
      'Credential must have exactly the following properties: ' +
      REQUIRED_VC_PROPERTIES);
  }

  const subjectProperties = Object.keys(credential.credentialSubject ?? {});
  if(!subjectProperties.length === REQUIRED_SUBJECT_PROPERTIES &&
    subjectProperties.every(p => REQUIRED_SUBJECT_PROPERTIES.has(p))) {
    throw new Error(
      'Credential must have exactly the following properties: ' +
      REQUIRED_SUBJECT_PROPERTIES);
  }

  const proofProperties = Object.keys(credential.proof ?? {});
  if(!proofProperties.length === REQUIRED_PROOF_PROPERTIES &&
    proofProperties.every(p => REQUIRED_PROOF_PROPERTIES.has(p))) {
    throw new Error(
      'Credential must have exactly the following properties: ' +
      REQUIRED_PROOF_PROPERTIES);
  }

  if(!(Array.isArray(credential.type) &&
    credential.type.length === 2 &&
    credential.type.includes('VerifiableCredential') &&
    credential.type.includes('OverAgeTokenCredential'))) {
    throw new Error(
      'Credential "type" must have exactly these types: ' +
      '"VerifiableCredential", "OverAgeTokenCredential".');
  }

  // ensure extracted age matches
  const {overAge, concealedIdToken} = credential.credentialSubject;
  const {overAge: fromToken} = await extractOverAge({concealedIdToken});
  if(overAge !== fromToken) {
    throw new Error(
      'Credential subject "overAge" does not match the "overAge" value from ' +
      'the internal TruAge token.');
  }
}
