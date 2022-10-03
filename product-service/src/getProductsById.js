import { tryDBConnect } from './database/db-connection';
import { prepareResponse } from './utils/prepareResponse';

const productRepositoryPromise = tryDBConnect().then(connection => connection.getRepository("Products"));

export const getProductsById = async (event) => {
  console.log('Get product by id handler called');

  try {
    const {productId} = event.pathParameters;

    console.log('When calling, the following arguments of the path parameters are received: productId =', productId);

    if (!productId) {
      return {
        statusCode: 400,
        message: 'Product id is not defined'
      }
    }

    const productRepository = await productRepositoryPromise;
    const product = await productRepository.findOne({
      where: {
        id: productId
      },
      relations: {
        stock: true
      }
    });

    if (!product) {
      return {
        statusCode: 404,
        message: 'Product not found',
      };
    }

    if (!product.stock) {
      return {
        statusCode: 404,
        message: 'Stock not found',
      };
    }

    const responseProduct = prepareResponse(product);

    return {
      statusCode: 200,
      body: JSON.stringify(responseProduct)
    };
  } catch(error) {
    return {
      statusCode: 500,
      message: 'Something went wrong during getting product by id',
      error: JSON.stringify(error)
    }
  }
};
