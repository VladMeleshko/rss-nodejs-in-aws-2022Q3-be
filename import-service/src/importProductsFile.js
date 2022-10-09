import AWS from 'aws-sdk';

export const importProductsFile = async (event) => {
  const {name} = event.queryStringParameters;

  if (!name) {
    return {
      statusCode: 403,
      message: 'CSV file name is not defined',
    }
  }

  const s3 = new AWS.S3({region: 'eu-west-1'});
  const bucketName = 'import-service-rss-nodejs-in-aws-course';
  const key = `uploaded/${name}`

  const params = {
    Bucket: bucketName,
    Key: key,
    Expires: 60,
    ContentType: 'text/csv'
  };

  try {
    const signedUrl = await s3.getSignedUrl('putObject', params);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(signedUrl)
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: 'Something went wrong during creating signed url',
      error: JSON.stringify(error)
    }
  } 
};
