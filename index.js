'use strict';

const winston = require('winston');
const aws = require('aws-sdk');
const commons = require('@jtviegas/jscommons').commons;
const logger = winston.createLogger(commons.getDefaultWinstonConfig());

const bucketWrapper = (config) => {

    const constants = {
        apiVersion: '2006-03-01'
    };

    if (!config)
        throw new Error('!!! must provide config to initialize module !!!');

    const CONFIGURATION_SPEC = {
        aws_region: 'BUCKETWRAPPER_AWS_REGION'
        , accessKeyId: 'BUCKETWRAPPER_AWS_ACCESS_KEY_ID'
        , secretAccessKey: 'BUCKETWRAPPER_AWS_ACCESS_KEY'
        // testing purposes
        , BUCKETWRAPPER_TEST: 'BUCKETWRAPPER_TEST'

    };

    let configuration = commons.mergeConfiguration(commons.getConfiguration(CONFIGURATION_SPEC, config), constants)
    let s3;
    if( configuration.BUCKETWRAPPER_TEST ) {
        logger.info("[bucketWrapper] testing using specific url: %s", configuration.BUCKETWRAPPER_TEST.bucket_endpoint);
        let testConfig = {apiVersion: configuration.apiVersion
            , endpoint: configuration.BUCKETWRAPPER_TEST.bucket_endpoint
            , region: configuration.aws_region
            , s3ForcePathStyle: true
            , accessKeyId: configuration.accessKeyId
            , secretAccessKey: configuration.secretAccessKey};
        logger.info("[bucketWrapper] test config: %o", testConfig);
        s3 = new aws.S3(testConfig);
    }
    else
        s3 = new aws.S3({apiVersion: configuration.apiVersion});

    const listObjects = (bucketName, bucketNamePrefix, callback) => {
        logger.debug("[bucketWrapper|listObjects|in] (%s, %s)", bucketName, bucketNamePrefix);
        try{
            let params = {};
            if( bucketNamePrefix && 0 < bucketNamePrefix.length )
                params = { Bucket: bucketName, Prefix: bucketNamePrefix + '/' };
            else
                params = { Bucket: bucketName };

            s3.listObjectsV2(params, function(e, d) {
                logger.debug("[bucketWrapper|s3.listObjectsV2|in] (%o,%o)", e, d);
                if (e){
                    logger.error(e);
                    callback(e);
                }
                else
                    callback(null, d.Contents);
            });
        }
        catch(e){
            logger.error(e);
            callback(e);
        }

        logger.debug("[bucketWrapper|listObjects|out]");
    };

    const createObject = (bucket, key, binaryString, callback) => {
        logger.debug("[bucketWrapper|createObject|in] (%s, %s, ---binaryString---)", bucket, key);
        try{
            let params = {
                Body: binaryString,
                Bucket: bucket,
                Key: key
            };
            s3.putObject(params, function(e, r) {
                logger.debug("[bucketWrapper|s3.putObject|in] (%o,%o)", e, r);
                if (e){
                    logger.error(e);
                    callback(e);
                }
                else
                    callback(null, r);
            });
        }
        catch(e){
            logger.error(e);
            callback(e);
        }

        logger.debug("[bucketWrapper|createObject|out]");
    };

    const deleteObjects = (bucket, keys, callback) => {
        logger.debug("[bucketWrapper|deleteObjects|in] (%s, %o)", bucket, keys);

        let _keys = [];
        if( Array.isArray(keys) ){
            for( let i=0; i < keys.length; i++ ){
                let _k = keys[i];
                _keys.push({Key: _k});
            }
        }
        else {
            _keys.push({Key: keys});
        }

        try{
            let params = {
                Bucket: bucket,
                Delete: {
                    Objects: _keys
                }
            };
            s3.deleteObjects(params, function(e, r) {
                logger.debug("[bucketWrapper|s3.deleteObjects|in] (%o,%o)", e, r);
                if (e){
                    logger.error(e);
                    callback(e);
                }
                else
                    callback(null, r);
            });
        }
        catch(e){
            logger.error(e);
            callback(e);
        }
        logger.debug("[bucketWrapper|deleteObjects|out]");
    };

    const getObject = (bucket, key, callback) => {
        logger.debug("[bucketWrapper|getObject|in] (%s, %s)", bucket, key);
        try{
            let params = {
                Bucket: bucket,
                Key: key
            };
            s3.getObject(params, function(e, r) {
                logger.debug("[bucketWrapper|s3.getObject|in] (%o,%o)", e, r);
                if (e){
                    logger.error(e);
                    callback(e);
                }
                else
                    callback(null, r);
            });
        }
        catch(e){
            logger.error(e);
            callback(e);
        }

        logger.debug("[bucketWrapper|getObject|out]");
    };


    return {listObjects: listObjects
    , createObject: createObject
    , deleteObjects: deleteObjects
    , getObject: getObject};
};

module.exports = bucketWrapper;