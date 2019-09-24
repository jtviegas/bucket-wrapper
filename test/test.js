'use strict';

const commons = require('@jtviegas/jscommons').commons;
const winston = require('winston');
const config = {
    BUCKETWRAPPER_AWS_REGION: 'eu-west-1'
    , BUCKETWRAPPER_AWS_ACCESS_KEY_ID: process.env.ACCESS_KEY_ID
    , BUCKETWRAPPER_AWS_ACCESS_KEY: process.env.ACCESS_KEY
    , BUCKETWRAPPER_TEST: {
        bucket_endpoint: 'http://localhost:5000'
        , bucket: 'bucket-wrapper-test'
        , bucket_folder: 'test'
        , filename: 'a.txt'
        , file_binary: 'dljkfhlkjfhvjlqebdsajkvCBDSKLJavbakjsdbvjkadsbvkjabsdvjklabsdjklvbkajdsbvkjlabsjkvbaksdjlbvlkj'
    }
};
const logger = winston.createLogger(commons.getDefaultWinstonConfig());
const index = require('../index')(config);
const chai = require('chai');
const expect = chai.expect;

describe('bucket-wrapper tests', function() {

    describe('...manage objects in the bucket...', function(done) {

        it('should have no objects at the start', function(done) {
            try{
                index.listObjects(config.BUCKETWRAPPER_TEST.bucket, config.BUCKETWRAPPER_TEST.bucket_folder, (e,r)=>{
                    logger.info("e: %o | r: %o", e, r);
                    if(e)
                        done(e);
                    else {
                        try{
                            expect(r.length).to.equal(0);
                            done(null);
                        }
                        catch(e){
                            done(e);
                        }
                    }
                });
            }
            catch(e){
                done(e);
            }
        });

        it('should have one object after creation of a single one', function(done) {
            try{
                let _file = 'a.txt';
                index.createObject(config.BUCKETWRAPPER_TEST.bucket, config.BUCKETWRAPPER_TEST.bucket_folder + '/' + config.BUCKETWRAPPER_TEST.filename
                    , config.BUCKETWRAPPER_TEST.file_binary , (e,d)=>{
                    try{
                        index.listObjects(config.BUCKETWRAPPER_TEST.bucket, config.BUCKETWRAPPER_TEST.bucket_folder, (e,r)=>{
                            logger.info("e: %o | r: %o", e, r);
                            if(e)
                                done(e);
                            else {
                                try{
                                    expect(r.length).to.equal(1);
                                    done(null);
                                }
                                catch(e){
                                    done(e);
                                }
                            }
                        });
                    } catch(e){
                        done(e);
                    }
                });
            }
            catch(e){
                done(e);
            }
        });

        it('should get one object now', function(done) {
            try{
                index.getObject(config.BUCKETWRAPPER_TEST.bucket, config.BUCKETWRAPPER_TEST.bucket_folder + '/' + config.BUCKETWRAPPER_TEST.filename, (e,r)=>{
                        try{
                            logger.info("e: %o | r: %o", e, r);
                            expect(r.ContentLength).to.equal(config.BUCKETWRAPPER_TEST.file_binary.length);
                            done(null);
                        } catch(e){
                            done(e);
                        }
                    });
            }
            catch(e){
                done(e);
            }
        });

        it('should get 0 after deleting one object', function(done) {
            try{
                index.deleteObjects(config.BUCKETWRAPPER_TEST.bucket, [config.BUCKETWRAPPER_TEST.bucket_folder + '/' + config.BUCKETWRAPPER_TEST.filename], (e,r)=>{
                    try {
                        index.listObjects(config.BUCKETWRAPPER_TEST.bucket, config.BUCKETWRAPPER_TEST.bucket_folder, (e,r)=>{
                            logger.info("e: %o | r: %o", e, r);
                            if(e)
                                done(e);
                            else {
                                try{
                                    expect(r.length).to.equal(0);
                                    done(null);
                                }
                                catch(e){
                                    done(e);
                                }
                            }
                        });
                    }
                    catch(e){
                        done(e);
                    }
                });
            }
            catch(e){
                done(e);
            }
        });
    });
});