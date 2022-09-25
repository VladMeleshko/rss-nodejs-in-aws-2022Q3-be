import {products} from './constants/data';

export const getProductsById = async (event) => {
  const {productId} = event.pathParameters;

  const product = await Promise.resolve(products.find(product => product.id === productId));

  if (!product) {
    return {
      statusCode: 404,
      body: JSON.stringify('Product not found'),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(product),
  };
};
