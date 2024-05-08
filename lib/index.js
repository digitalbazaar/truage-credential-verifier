/*!
 * Copyright (c) 2024 Digital Bazaar, Inc. All rights reserved.
*/
export {verifyQrCodeText, verifyCredential} from './verify.js';

// FIXME: implement overage extraction
// import * as base58 from 'base58-universal';
// import ageContext from '@digitalbazaar/age-verification-context';
// import {decode as cborldDecode} from '@digitalbazaar/cborld';

/*
export async function extractOverAge({concealedIdToken}) {
  if(!concealedIdToken.startsWith('z')) {
    throw new Error('Token must be multibase-base58 encoded.');
  }
  // remove base58 multibase prefix `z` from token
  concealedIdToken = concealedIdToken.slice(1);
  const tokenBytes = base58.decode(concealedIdToken);
  const tokenDocument = await cborldDecode({
    cborldBytes: tokenBytes,
    documentLoader
  });
  if(!tokenDocument.meta.startsWith('z')) {
    throw new Error('"tokenDocument.meta" must be multibase-base58 encoded.');
  }
  // Remove prefix z from meta
  const meta = tokenDocument.meta.slice(1);
  const metaBytes = base58.decode(meta);
  const metaDocument = await cborldDecode({
    cborldBytes: metaBytes,
    documentLoader
  });

  const {overAge} = metaDocument;

  return overAge;
}
*/
