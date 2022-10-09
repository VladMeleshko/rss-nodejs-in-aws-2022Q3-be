import AWS from 'aws-sdk';
import csv from 'csv-parser';

export const importFileParser = async (event) => {
  const s3 = new AWS.S3({region: 'eu-west-1'});
  const bucketName = 'import-service-rss-nodejs-in-aws-course';

  try {
    for (const record of event.Records) {
      const key = record.s3.object.key;

      const params = {
        Bucket: bucketName,
        Key: key
      };

      s3.getObject(params)
        .createReadStream()
        .pipe(csv())
        .on('data', (data) => console.log(data))
        .on('error', (error) => {
          throw new Error(JSON.stringify(error));
        })
        .on('end', async () => {
          await s3.copyObject({
            Bucket: bucketName,
            CopySource: bucketName + '/' + key,
            Key: key.replace('uploaded/', 'parsed/') 
          }).promise();

          await s3.deleteObject(params).promise();
        })
      }
  } catch(error) {
    if (typeof error !== 'string') {
      error = JSON.stringify(error);
    }

    return {
      statusCode: 500,
      message: 'Something went wrong during reading and replacing file',
      error
    }
  }
}