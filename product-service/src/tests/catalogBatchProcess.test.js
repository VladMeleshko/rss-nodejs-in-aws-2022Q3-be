import AWSMock from 'aws-sdk-mock';
import { catalogBatchProcess } from '../catalogBatchProcess';
import { tryDBConnect } from '../database/db-connection';

const productRepositoryPromise = tryDBConnect().then(connection => connection.getRepository("Products"));
const testProduct = JSON.stringify({
  title: 'Test title',
  description: 'Test description',
  price: '100',
  count: '100'
});

describe('catalogBatchProcess tests', () => {  
  it("Get error with 400 status code when lambda can't get products from request body", async () => {
    const catalogBatchProcessResponse = await catalogBatchProcess({Records:[]});

    expect(catalogBatchProcessResponse.statusCode).toBe(400);
    expect(catalogBatchProcessResponse.body).toBe("Сouldn't get a list of imported products");
  });

  it("Get error with 500 status code while sending a message to an Amazon SNS topic", async () => {
    AWSMock.mock('SNS', 'publish', (params, callback) => {
      throw new Error();
    });

    const catalogBatchProcessResponse = await catalogBatchProcess({Records: [{body: testProduct}]});

    AWSMock.restore('SNS', 'publish');

    expect(catalogBatchProcessResponse.statusCode).toBe(500);
  });

  it("Get undefined if everything work successfully (this lambda is not require any response)", async () => {
    AWSMock.mock('SNS', 'publish', (params, callback) => {
      callback(undefined, 'success');
    });

    const catalogBatchProcessResponse = await catalogBatchProcess({Records: [{body: testProduct}]});

    AWSMock.restore('SNS', 'publish');

    expect(catalogBatchProcessResponse).toBeUndefined();
  });
})

afterAll(async() => {
  const productRepository = await productRepositoryPromise;
  const testProductIds = (await productRepository.find({
    where: {
      title: 'Test title'
    }
  })).map(product => product.id);

  await productRepository.delete(testProductIds);
})