import { tryDBConnect } from './database/db-connection';
import { prepareResponse } from './utils/prepareResponse';

const productRepositoryPromise = tryDBConnect().then(connection => connection.getRepository("Products"));

export const getProductsList = async () => {
  console.log('Handler for getting product list called');
  console.log('Arguments were not passed, because the full list of products will be received');

  try {
    const productRepository = await productRepositoryPromise;
    const products = await productRepository.find({
      relations: {
        stock: true
      }
    });

    const responseProductList = products.map(product => {
      if (!product.stock) {
        throw new Error(`Stock belonging to a product with id ${product.id} was not found`);
      }

      return prepareResponse(product);
    })

    return {
      statusCode: 200,
      body: JSON.stringify(responseProductList),
    };
  } catch(error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Something went wrong during getting product list',
        error
      })
    }
  }
};
