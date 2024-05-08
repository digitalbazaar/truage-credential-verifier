/*!
 * Copyright (c) 2024 Digital Bazaar, Inc. All rights reserved.
 */
import {documentLoader} from '../lib/documentLoader.js';
import {expect} from 'chai';
import {fromQrCodeText} from '../lib/qrcode.js';
import {qrCodeExample} from './mock-data.js';
import {verifyOverAgeTokenCredential} from '../lib/index.js';

describe('verifyOverAgeTokenCredential', () => {
  it('should pass', async () => {
    // parse `OverAgeTokenCredential` from QR code text
    const {jsonldDocument} = await fromQrCodeText({
      expectedHeader: 'VP1-',
      text: qrCodeExample,
      documentLoader,
      diagnose: null
    });

    const credential = jsonldDocument.verifiableCredential;

    let result;
    let error;
    try {
      result = await verifyOverAgeTokenCredential({credential});
    } catch(e) {
      error = e;
    }

    expect(error).to.not.exist;
    expect(result).to.exist;
    expect(result?.verified).to.equal(true);
    result.should.have.keys([
      'verified', 'credential', 'issuer', 'overAge', 'verificationDetails'
    ]);
    result.issuer.should.equal(
      'did:key:z6Mkju1q59X5KZ3pNLF6FeXCntgmfbGeYjd6LmCYyZdHSAQE');
    result.overAge.should.equal(21);
  });

  it('should fail with changed data', async () => {
    // parse from QR code text, change signature
    const {jsonldDocument} = await fromQrCodeText({
      expectedHeader: 'VP1-',
      text: qrCodeExample,
      documentLoader,
      diagnose: null
    });

    // set invalid signature value
    const credential = jsonldDocument.verifiableCredential;
    credential.proof.proofValue =
      // eslint-disable-next-line max-len
      'zz7XFMUdismD6nsYRfKHjBRsgxqmzXovNFnRVQ4NvsZq98AMWvxieLBbGsBNVafek9GyfyrS1gRDRvkQCv4uT5j6';

    const result = await verifyOverAgeTokenCredential({credential});

    expect(result?.verified).to.equal(false);
    expect(result?.error?.message).to.include('Verification error');
    expect(result?.error?.errors).to.exist;
    expect(result?.error?.errors[0].message).to.equal('Invalid signature.');
  });
});
