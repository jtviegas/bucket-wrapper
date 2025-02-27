const { BucketWrapper } = require("../index");
const { readFile } = require('node:fs/promises');


describe('bucket-wrapper tests', function() {

    const bucket = "testbucket";
    const file = "img.png";

    const wrapper = new BucketWrapper({
        region: 'eu-north-1',
        endpoint: 'http://localhost:4566',
        forcePathStyle: true
    });

    it('should put a file in a bucket', async () => {
        const body = await readFile('./test/img.png');
        await wrapper.putObject(bucket, file, body);
    }, 10000);

    it('should list the file in the bucket', async () => {
        const actual = await wrapper.listObjects(bucket);
        expect(actual).toEqual(['img.png']);
    }, 10000);

    it('should delete the file in the bucket', async () => {
        await wrapper.deleteObject(bucket, 'img.png');
    }, 10000);

    it('should list the file in the bucket', async () => {
        const actual = await wrapper.listObjects(bucket);
        expect(actual).toEqual([]);
    }, 10000);

});