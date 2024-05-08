/*!
 * Copyright (c) 2024 Digital Bazaar, Inc. All rights reserved.
*/
import * as vc from '@digitalbazaar/vc';
import {documentLoader} from './documentLoader.js';
import {Ed25519Signature2020} from '@digitalbazaar/ed25519-signature-2020';
import {fromQrCodeText} from './qrcode.js';

export async function verifyQrCodeText({qrCodeText} = {}) {
  const {jsonldDocument: presentation} = await fromQrCodeText({
    expectedHeader: 'VP1-',
    text: qrCodeText,
    documentLoader,
    diagnose: null
  });

  const result = await vc.verify({
    presentation,
    documentLoader,
    suite: new Ed25519Signature2020(),
    unsignedPresentation: true,
    now: Date.parse(presentation?.verifiableCredential?.[0]?.issuanceDate)
  });

  console.log('result', result);

  return result;
}

export async function verifyCredential({credential} = {}) {
  if(!(credential && typeof credential !== 'object')) {
    throw new TypeError('"credential" must be an object.');
  }

  const result = await vc.verifyCredential({
    credential,
    suite: new Ed25519Signature2020(),
    documentLoader,
    now: Date.parse(credential.issuanceDate)
  });

  console.log('result', result);

  return result;
}
