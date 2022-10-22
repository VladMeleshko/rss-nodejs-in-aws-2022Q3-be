import { getProductsById } from "../getProductsById";

describe('getProductsById', () => {
  it('Get one product', async () => {
    const testId = '0361e7da-41c9-4cb6-a181-ffd9670185a5'
    const getProductsByIdResponse = await getProductsById(
      {
        pathParameters: {
          productId: testId 
        }
      });

    expect(getProductsByIdResponse.statusCode).toBe(200);
  })

  it('Get error', async () => {
    const testId = '08030371-fcda-4c85-8adb-88ef6e805555'
    const getProductsByIdResponse = await getProductsById(
      {
        pathParameters: {
          productId: testId 
        }
      });

    expect(getProductsByIdResponse.statusCode).toBe(404);
    expect(getProductsByIdResponse.message).toBe('Product not found');
  })
})