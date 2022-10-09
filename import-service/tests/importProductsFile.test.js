import AWSMock from 'aws-sdk-mock';
import { importProductsFile } from '../src/importProductsFile';

describe('importProductsFile tests', () => {
  const fileName = 'test.csv';
  const signedURLResponse = `https://test-bucket.s3.eu-west-1.amazonaws.com/uploaded/${fileName}?AWSAccessKeyId=ACCESS_KEY&Content-Type=text%2Fcsv&Expires=1665324574&Signature=SIGNATURE`;
  
  it('Get signed url for imported file', async () => {
    AWSMock.mock('S3', 'getSignedUrl', (action, params, callback) => {
      callback(null, signedURLResponse)
    });

    const importProductsFileResponse = await importProductsFile({queryStringParameters: {name: fileName}});

    AWSMock.restore('S3', 'getSignedUrl');
    
    expect(importProductsFileResponse.statusCode).toBe(200);
    expect(importProductsFileResponse.body).toBe(JSON.stringify(signedURLResponse));
  });

  it('Get error with 403 status code when name is not defined', async () => {
    const importProductsFileResponse = await importProductsFile({queryStringParameters: {name: ''}});

    expect(importProductsFileResponse.statusCode).toBe(403);
    expect(importProductsFileResponse.message).toBe('CSV file name is not defined');
  });

  it('Get error with 500 status code when getting signed url was failed', async () => {
    AWSMock.mock('S3', 'getSignedUrl', (action, params, callback) => {
      throw new Error();
    });

    const importProductsFileResponse = await importProductsFile({queryStringParameters: {name: fileName}});
    
    AWSMock.restore('S3', 'getSignedUrl');

    expect(importProductsFileResponse.statusCode).toBe(500);
    expect(importProductsFileResponse.message).toBe('Something went wrong during creating signed url');
  });
})
