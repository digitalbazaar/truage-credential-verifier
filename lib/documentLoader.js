/*!
 * Copyright (c) 2024 Digital Bazaar, Inc. All rights reserved.
*/
import ageContext from '@digitalbazaar/age-verification-context';
import {CachedResolver} from '@digitalbazaar/did-io';
import citContext from 'cit-context';
import credentialsContext from 'credentials-context';
import {driver} from '@digitalbazaar/did-method-key';
import ed255192020Context from 'ed25519-signature-2020-context';
import {Ed25519VerificationKey2020} from
  '@digitalbazaar/ed25519-verification-key-2020';
import {JsonLdDocumentLoader} from 'jsonld-document-loader';
import x25519Context from 'x25519-key-agreement-2020-context';

const jdl = new JsonLdDocumentLoader();

// add acceptable contexts
const contextModules = [
  ageContext,
  citContext,
  credentialsContext,
  ed255192020Context,
  x25519Context
];
for(const {contexts} of contextModules) {
  for(const [contextUrl, context] of contexts) {
    jdl.addStatic(contextUrl, context);
  }
}

// setup DID resolver
const resolver = new CachedResolver();
const didKeyDriver = driver();
didKeyDriver.use({
  multibaseMultikeyHeader: 'z6Mk',
  fromMultibase: Ed25519VerificationKey2020.from
});
resolver.use(didKeyDriver);
jdl.setDidResolver(resolver);

export const documentLoader = jdl.build();

export const contexts = {
  AGE_V1_URL: ageContext.constants.CONTEXT_URL_V1,
  CIT_V1_URL: citContext.constants.CONTEXT_URL,
  CREDENTIALS_V1_URL: credentialsContext.constants.CREDENTIALS_CONTEXT_V1_URL,
  ED25519_V1_URL: ed255192020Context.constants.CONTEXT_URL
};
