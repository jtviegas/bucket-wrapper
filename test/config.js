'use strict';

const winston = require('winston');

const config_module = function(){

    let config = {

        BUCKETWRAPPER_AWS_REGION: 'eu-west-1'
        , BUCKETWRAPPER_AWS_ACCESS_KEY_ID: null
        , BUCKETWRAPPER_AWS_ACCESS_KEY: null
        , test: {
            aws_s3_endpoint: 'http://localhost:5000'
            , bucket: 'bucket-wrapper-test'
            , bucket_folder: 'test'
            , aws_container_name: 's3'
            , filename: 'a.txt'
            , file_binary: 'dljkfhlkjfhvjlqebdsajkvCBDSKLJavbakjsdbvjkadsbvkjabsdvjklabsdjklvbkajdsbvkjlabsjkvbaksdjlbvlkj'
        }
    };

    return config;
    
}();

module.exports = config_module;
