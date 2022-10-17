import { getProductsList } from "../getProductsList";

describe('getProductsList', () => {
  it('Get a list of products', async () => {
    const getProductsListResponse = await getProductsList();
    expect(getProductsListResponse.statusCode).toBe(200);
  })
})