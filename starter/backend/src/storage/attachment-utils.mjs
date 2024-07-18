import AWS from 'aws-sdk';
import AWSXRay from 'aws-xray-sdk';

const s3BucketName = process.env.S3_BUCKET_IMAGES;
const Exp = +process.env.SIGNED_URL_EXPIRATION;

export class commonAttachmentUtil {

    // attach image url
    createAttachmentUrl(todoId) {
        return `https://${s3BucketName}.s3.amazonaws.com/${todoId}`;
    }

    createUploadUrl(todoId) {

        const xRay = AWSXRay.captureAWS(AWS);
        const s3 = new xRay.S3({ signatureVersion: 'v4' });

        return s3.getSignedUrl('putObject', {
            Bucket: s3BucketName,
            Key: todoId,
            Expires: Exp
        });
    }
}
