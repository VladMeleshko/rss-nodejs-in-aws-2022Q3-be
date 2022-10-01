import {products} from './constants/data';

export const getProductsList = async () => {
  const productList = await Promise.resolve(products);

  return {
    statusCode: 200,
    body: JSON.stringify(productList),
  };
};
