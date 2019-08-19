[![Build Status](https://travis-ci.org/jtviegas/bucket-wrapper.svg?branch=master)](https://travis-ci.org/jtviegas/bucket-wrapper)
[![Coverage Status](https://coveralls.io/repos/github/jtviegas/bucket-wrapper/badge.svg?branch=master)](https://coveralls.io/github/jtviegas/bucket-wrapper?branch=master)

BUCKET WRAPPER
=========

...it's exactly that, a wrapper library for a bucket-like store

## Installation

  `npm install @jtviegas/bucket-wrapper`

## Usage
    
    
    let config = {
            WINSTON_CONFIG: { ... }
            , AWS_REGION: 'eu-west-1'
            , AWS_API_VERSION: '2006-03-01'
    }
    
    var bw = require('@jtviegas/bucket-wrapper')(config);
    
    bw.listObjects = (bucket, bucket_key, (e,r) => {
        if(e){
            //...do your error handling
        }
        else {
        // ... do whatever you want
        }
    });
    
  Check the test folder in source tree.
## Tests

  `npm test`

## Contributing

In lieu of a formal style guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.
