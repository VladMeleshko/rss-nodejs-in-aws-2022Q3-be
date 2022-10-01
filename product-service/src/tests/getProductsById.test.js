import { products } from "../constants/data";
import { getProductsById } from "../getProductsById";

describe('getProductsById', () => {
  it('Get one product', async () => {
    const testId = '08030371-fcda-4c85-8adb-88ef6e80349b'
    const getProductsByIdResponse = await getProductsById(
      {
        pathParameters: {
          productId: testId 
        }
      });
    const testProduct = products.find(product => product.id === testId);

    expect(getProductsByIdResponse.statusCode).toBe(200);
    expect(getProductsByIdResponse.body).toBe(JSON.stringify(testProduct));
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
    expect(getProductsByIdResponse.body).toBe('Product not found');
  })
})