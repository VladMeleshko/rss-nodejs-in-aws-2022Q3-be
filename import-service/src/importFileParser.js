import AWS from 'aws-sdk';
import csv from 'csv-parser';
import { serverErrorResponse } from './utils/serverErrorResponse';

export const importFileParser = async (event) => {
  const s3 = new AWS.S3({region: 'eu-west-1'});
  const sqs = new AWS.SQS({region: 'eu-west-1'})
  const bucketName = process.env.BUCKET_NAME;
  const queueUrl = process.env.SQS_URL;

  for (const record of event.Records) {
    const key = record.s3.object.key;

    const params = {
      Bucket: bucketName,
      Key: key
    };

    try {
      await new Promise(async (resolve, reject) => {
        s3.getObject(params)
        .createReadStream()
        .pipe(csv())
        .on('data', (data) => {
          sqs.sendMessage({
            QueueUrl: queueUrl,
            MessageBody: JSON.stringify(data)
          }).send((err, data) => {
            if (err) {
              reject(err);
            }
            console.log('SQS answer:', data)
          })
        })
        .on('error', (error) => {
          reject(JSON.stringify(error));
        })
        .on('end', async () => {
          await s3.copyObject({
            Bucket: bucketName,
            CopySource: `${bucketName}/${key}`,
            Key: key.replace('uploaded/', 'parsed/') 
          }).promise();
  
          await s3.deleteObject(params).promise();
          resolve();
        })
      })   
    } catch (error) {
      return serverErrorResponse(500, 'Something went wrong during parsing or replacing file', error);
    }
  }
}
