import AWS from 'aws-sdk';
import csv from 'csv-parser';

export const importFileParser = async (event) => {
  const s3 = new AWS.S3({region: 'eu-west-1'});
  const bucketName = process.env.BUCKET_NAME;

  for (const record of event.Records) {
    const key = record.s3.object.key;

    const params = {
      Bucket: bucketName,
      Key: key
    };

    await new Promise((resolve, reject) => {
      s3.getObject(params)
      .createReadStream()
      .pipe(csv())
      .on('data', (data) => console.log(data))
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
  }
}