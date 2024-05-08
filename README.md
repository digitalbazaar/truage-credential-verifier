# TruAge Credential Verifier _(@digitalbazaar/truage-credential-verifier)_

[![Build status](https://img.shields.io/github/workflow/status/digitalbazaar/truage-credential-verifier/Node.js%20CI)](https://github.com/digitalbazaar/truage-credential-verifier/actions?query=workflow%3A%22Node.js+CI%22)
[![Coverage status](https://img.shields.io/codecov/c/github/digitalbazaar/truage-credential-verifier)](https://codecov.io/gh/digitalbazaar/truage-credential-verifier)
[![NPM Version](https://img.shields.io/npm/v/@digitalbazaar/truage-credential-verifier.svg)](https://npm.im/@digitalbazaar/truage-credential-verifier)

> TruAge Verifiable Credential Verifier.

## Table of Contents

- [Background](#background)
- [Security](#security)
- [Install](#install)
- [Usage](#usage)
- [Contribute](#contribute)
- [Commercial Support](#commercial-support)
- [License](#license)

## Background

TBD

## Security

TBD

## Install

- Browsers and Node.js 20+ are supported.

To install from NPM:

```
npm install @digitalbazaar/truage-credential-verifier
```

To install locally (for development):

```
git clone https://github.com/digitalbazaar/truage-credential-verifier.git
cd truage-credential-verifier
npm install
```

## Usage

To verify a TruAge token, which is a CBOR-LD-encoded Verifiable Credential of type `OverAgeTokenCredential` using the (using the `https://w3id.org/age/v1`
JSON-LD context):

```javascript
import {verifyQrCodeText} from '@digitalbazaar/truage-credential-verifier';

const qrCodeText = 'VP1-B3ECQDIYACEMHIGDODB6KQAMDCELBIGDQQIBVAADIXHBIQX2PFCEVATORHCCS2LYYOKSRQ5AYSYMLMGTEEHEVWGF6DDCBRQCYIF5DCQDI3YNUWHN53SMBYY75SQPJQUBD73YL5OH3DDLALMINCE55XRFBEUS2SCJY52BAXJE3TKYA6I6SSVHDX4CF4LWYVZFDXPMQ536WBAMMFAYZAQAVQIXNAFIOG5RWAVVT5UYU32LAGAUXMSXZUJL3GLMGCMPGWKFOWUNW44G66WBC5UAVBY3WGYCWWPWTCTPJMAYCS5SK7GRFPMZNQYJR42ZIV22RW3TQ33YYOWBBQ3AYQIMJ5IQYRJMFO6WZAUA2IAAVDBVBQZAYNRFHVWIFAGRAAFQYPQKRQ3SYHN5AAAKG3JGL6G7AC3LL7YEC7KLUV7BHOTPEOYX6P53HWMLQH42P4XYY6YY3U53CG7OG7XUBKMZU6B7DTQ2GNJKDME26GUGADCKBKGFCDJSV4LGSDCSBUZBBZFNRRKECDECACWBC5UAVBY3WGYCWWPWTCTPJMAYCS5SK7GRFPMZNQYJR42ZIV22RW3TQ33Y';

const result = await verifyQrCodeText({qrCodeText});

console.log('result', result);
```

## Contribute

See [the contribute file](https://github.com/digitalbazaar/bedrock/blob/master/CONTRIBUTING.md)!

PRs accepted.

If editing the Readme, please conform to the
[standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## Commercial Support

Commercial support for this library is available upon request from
Digital Bazaar: support@digitalbazaar.com

## License

[New BSD License (3-clause)](LICENSE) © 2024 Digital Bazaar
