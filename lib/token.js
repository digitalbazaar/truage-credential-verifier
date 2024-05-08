/*!
 * Copyright (c) 2024 Digital Bazaar, Inc. All rights reserved.
*/
import * as base58 from 'base58-universal';
import {contexts, documentLoader} from './documentLoader.js';
import {decode as cborldDecode} from '@digitalbazaar/cborld';

export async function extractOverAge({concealedIdToken} = {}) {
  if(typeof concealedIdToken !== 'string') {
    throw new TypeError('"concealedIdToken" must be a string.');
  }

  // decode concealed ID token VC from multibase-encoded base58
  if(!concealedIdToken.startsWith('z')) {
    throw new Error('Token must be multibase-base58 encoded.');
  }
  concealedIdToken = concealedIdToken.slice(1);
  const tokenBytes = base58.decode(concealedIdToken);

  // decode from CBOR-LD
  const tokenDocument = await cborldDecode({
    cborldBytes: tokenBytes,
    documentLoader
  });

  const context = tokenDocument['@context'];
  if(context !== contexts.CIT_V1_URL) {
    throw new Error(`Token "@context" must be "${contexts.CIT_V1_URL}".`);
  }

  // decode meta from multibase-encoded base58
  if(!tokenDocument.meta?.startsWith('z')) {
    throw new Error('Token "meta" must be multibase-base58 encoded.');
  }
  const meta = tokenDocument.meta.slice(1);
  const metaBytes = base58.decode(meta);

  // decode meta from CBOR-LD
  const metaDocument = await cborldDecode({
    cborldBytes: metaBytes,
    documentLoader
  });

  if(!tokenDocument.payload?.startsWith('z')) {
    throw new Error('Token "payload" must be multibase-base58 encoded.');
  }
  const payload = tokenDocument.payload.slice(1);
  const payloadBytes = base58.decode(payload);
  if(payloadBytes.length < 50) {
    throw new Error('Token "payload" must be at least 50 bytes in size.');
  }

  const {overAge} = metaDocument;
  return {overAge};
}
