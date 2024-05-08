/*!
 * Copyright (c) 2024 Digital Bazaar, Inc. All rights reserved.
 */
import {fromQrCodeText, toQrCodeText} from '../lib/qrcode.js';
import {documentLoader} from '../lib/documentLoader.js';
import {expect} from 'chai';
import {qrCodeExample} from './mock-data.js';
import {verifyQrCodeText} from '../lib/index.js';

describe('verifyQrCodeText', () => {
  it('should pass', async () => {
    let result;
    let error;
    try {
      result = await verifyQrCodeText({qrCodeText: qrCodeExample});
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
    // parse from QR code text, change signature, and reproduce QR code text
    const {jsonldDocument} = await fromQrCodeText({
      expectedHeader: 'VP1-',
      text: qrCodeExample,
      documentLoader,
      diagnose: null
    });

    // set invalid signature value
    jsonldDocument.verifiableCredential.proof.proofValue =
      // eslint-disable-next-line max-len
      'zz7XFMUdismD6nsYRfKHjBRsgxqmzXovNFnRVQ4NvsZq98AMWvxieLBbGsBNVafek9GyfyrS1gRDRvkQCv4uT5j6';

    const qrCodeText = await toQrCodeText({
      header: 'VP1-',
      jsonldDocument,
      documentLoader,
      diagnose: null
    });

    const result = await verifyQrCodeText({qrCodeText});

    expect(result?.verified).to.equal(false);
    expect(result?.error?.message).to.include('Verification error');
    expect(result?.error?.errors).to.exist;
    expect(result?.error?.errors[0].message).to.equal('Invalid signature.');
  });
});
