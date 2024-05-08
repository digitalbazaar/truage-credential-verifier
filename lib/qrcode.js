/*!
 * Copyright (c) 2021-2024 Digital Bazaar, Inc. All rights reserved.
*/
import * as cborld from '@digitalbazaar/cborld';
import base32Decode from 'base32-decode';
import base32Encode from 'base32-encode';

const BASE_32_UPPERCASE_MULTIBASE_PREFIX = 'B';

export async function fromQrCodeText({
  expectedHeader = '', text, decodeCborld = true, documentLoader,
  appContextMap, diagnose
} = {}) {
  if(!(text && text.startsWith(expectedHeader))) {
    throw TypeError('Unsupported QR format.');
  }

  const multibasePayload = text.slice(expectedHeader.length);

  if(!multibasePayload.startsWith(BASE_32_UPPERCASE_MULTIBASE_PREFIX)) {
    throw TypeError('Payload must be multibase base32 (RFC4648) encoded.');
  }

  const cborldArrayBuffer = base32Decode(multibasePayload.slice(1), 'RFC4648');
  const cborldBytes = new Uint8Array(cborldArrayBuffer);
  if(!decodeCborld) {
    return {cborldBytes};
  }

  const jsonldDocument = await cborld.decode({
    cborldBytes,
    documentLoader,
    appContextMap,
    // to debug, set diagnose: console.log
    diagnose
  });
  return {jsonldDocument};
}

export async function toQrCodeText({
  header = '', jsonldDocument, cborldBytes, documentLoader, appContextMap,
  diagnose
} = {}) {
  if(jsonldDocument && cborldBytes) {
    throw new Error(
      'Only one of "jsonldDocument" and "cborldBytes" is allowed.');
  }

  if(!cborldBytes) {
    cborldBytes = await cborld.encode({
      jsonldDocument,
      documentLoader,
      appContextMap,
      // to debug, set diagnose: console.log
      diagnose
    });
  }

  return _bytesToQrCodeText({header, bytes: cborldBytes});
}

function _bytesToQrCodeText({header = '', bytes}) {
  const encoded = base32Encode(bytes, 'RFC4648', {padding: false});
  return `${header}${BASE_32_UPPERCASE_MULTIBASE_PREFIX}${encoded}`;
}
