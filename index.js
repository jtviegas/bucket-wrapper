const { 
    S3Client, ListObjectsV2Command, PutObjectCommand, DeleteObjectCommand
} = require("@aws-sdk/client-s3");

class BucketWrapperError extends Error {
    constructor(message, statusCode=undefined) {
        super(message);
        this.statusCode = statusCode;
    }
}

class BucketWrapper {

    constructor(config) {
        this.client = new S3Client(config);
        this.listLimit = config.listLimit || 512 
    }

    async putObject(bucket, key, body) {
        console.info("[BucketWrapper|putObject|in] (%s, %s, ---obj---)", bucket, key);
        const input = { 
            "Bucket": bucket, 
            "Body": body, 
            "Key": key,
            "ContentType": 'application/octet-stream'
        };
        try {
            const command = new PutObjectCommand(input);
            const response = await this.client.send(command);
            if(200 != response['$metadata'].httpStatusCode){
                console.error("[BucketWrapper|putObject] %O", response);
                throw new BucketWrapperError(response, response['$metadata'].httpStatusCode)
            }
        }
        catch(x){
            console.error("[BucketWrapper|putObject] %O", x);
            throw new BucketWrapperError(x, x['$metadata'].httpStatusCode)
        }
        console.info("[BucketWrapper|putObject|out]");
    };

    async listObjects(bucket, prefix=undefined, maxkeys=undefined) {
        console.info("[BucketWrapper|listObjects|in] (%s, %s, %s)", bucket, prefix, maxkeys);
        const input = { Bucket: bucket, Prefix: prefix, MaxKeys: maxkeys? maxkeys : this.listLimit};
        const result = [];
        try {
            const command = new ListObjectsV2Command(input);
            const response = await this.client.send(command);
            if(Object.hasOwn(response, "Contents")){
                for(const key of response.Contents){
                    result.push(key.Key)
                }
            }
        }
        catch(x){
            console.error("[BucketWrapper|listObjects] %O", x);
            throw new BucketWrapperError(x, x['$metadata'].httpStatusCode)
        }
        console.info("[BucketWrapper|listObjects|out] => %o", result);
        return result
    };

    async deleteObject(bucket, key) {
        console.info("[BucketWrapper|deleteObject|in] (%s, %s)", bucket, key);
        const input = { Bucket: bucket, Key: key };
        try {
            const command = new DeleteObjectCommand(input);
            await this.client.send(command);
        }
        catch(x){
            console.error("[BucketWrapper|deleteObject] %O", x);
            throw new BucketWrapperError(x, x['$metadata'].httpStatusCode)
        }
        console.info("[BucketWrapper|deleteObject|out]");
    };

}

module.exports = {};
module.exports.BucketWrapper = BucketWrapper;
module.exports.BucketWrapperError = BucketWrapperError;
