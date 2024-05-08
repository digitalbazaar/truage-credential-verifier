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
    // FIXME:
    //const expectedResult =
    //result.should.equal(expectedResult);
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
    // FIXME:
    //expect(result?.error).to.exist();
    //result.error.message.should.equal('FIXME');
  });
});
