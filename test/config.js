'use strict';

const winston = require('winston');

const config_module = function(){

    let config = {
        WINSTON_CONFIG: {
            level: 'debug',
            format: winston.format.combine(
                winston.format.splat(),
                winston.format.timestamp(),
                winston.format.printf(info => {
                    return `${info.timestamp} ${info.level}: ${info.message}`;
                })
            ),
            transports: [new winston.transports.Console()]
        }
        , AWS_REGION: 'eu-west-1'
        , AWS_API_VERSION: '2006-03-01'
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
