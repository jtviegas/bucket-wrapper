[![Build Status](https://travis-ci.org/jtviegas/bucket-wrapper.svg?branch=master)](https://travis-ci.org/jtviegas/bucket-wrapper)
[![Coverage Status](https://coveralls.io/repos/github/jtviegas/bucket-wrapper/badge.svg?branch=master)](https://coveralls.io/github/jtviegas/bucket-wrapper?branch=master)

BUCKET WRAPPER
=========

wrapper library for a bucket-like store, current implementation using aws s3

## Installation

  `npm install @jtviegas/bucket-wrapper`

## Usage
    
### required environment variables or configuration properties
  - BUCKETWRAPPER_AWS_REGION
  - BUCKETWRAPPER_AWS_ACCESS_KEY_ID
  - BUCKETWRAPPER_AWS_ACCESS_KEY
  - for testing purposes: BUCKETWRAPPER_TEST: { bucket_endpoint: 'http://localhost:5000' }

### code snippet example
    
    let config = {
            BUCKETWRAPPER_AWS_REGION: 'eu-west-1'
            , BUCKETWRAPPER_AWS_ACCESS_KEY_ID: .....
            , BUCKETWRAPPER_AWS_ACCESS_KEY: .....
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

    npm test

## Contributing

just help yourself and submit a pull request