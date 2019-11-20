'use strict';

const commons = require('@jtviegas/jscommons').commons;
const winston = require('winston');
const logger = winston.createLogger(commons.getDefaultWinstonConfig());
const index = require('../index');
const chai = require('chai');
const expect = chai.expect;

describe('bucket-wrapper tests', function() {

    const config = {
        bucket: 'bucket-wrapper-test'
        , bucket_folder: 'test'
        , filename: 'a.txt'
        , file_binary: 'dljkfhlkjfhvjlqebdsajkvCBDSKLJavbakjsdbvjkadsbvkjabsdvjklabsdjklvbkajdsbvkjlabsjkvbaksdjlbvlkj'
    };

    before(function(done) {

        if ( ! process.env['AWS_ACCESS_KEY_ID'] )
            done( 'must provide env var AWS_ACCESS_KEY_ID' );
        if ( ! process.env['AWS_SECRET_ACCESS_KEY'] )
            done( 'must provide env var AWS_SECRET_ACCESS_KEY' );
        if ( ! process.env['BUCKETWRAPPER_TEST_ENDPOINT'] )
            done( 'must provide env var BUCKETWRAPPER_TEST_ENDPOINT for the test' );

        done(null);
    });


    describe('...manage objects in the bucket...', function(done) {

        it('should have no objects at the start', function(done) {
            try{
                index.listObjects(config.bucket, config.bucket_folder, (e,r)=>{
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
                index.createObject(config.bucket, config.bucket_folder + '/' + config.filename
                    , config.file_binary , (e,d)=>{
                    try{
                        index.listObjects(config.bucket, config.bucket_folder, (e,r)=>{
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
                index.getObject(config.bucket, config.bucket_folder + '/' + config.filename, (e,r)=>{
                        try{
                            logger.info("e: %o | r: %o", e, r);
                            expect(r.ContentLength).to.equal(config.file_binary.length);
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
                index.deleteObjects(config.bucket, [config.bucket_folder + '/' + config.filename], (e,r)=>{
                    try {
                        index.listObjects(config.bucket, config.bucket_folder, (e,r)=>{
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