import AWS from 'aws-sdk';
import { prepareResponse } from './utils/prepareResponse';

const dynamo = new AWS.DynamoDB.DocumentClient({
  region: 'eu-west-1'
});

export const getProductsList = async () => {
  console.log('Handler for getting product list called');
  console.log('Arguments were not passed, because the full list of products will be received');

  try {
    const productsDBInfo  = await dynamo.scan({
      TableName: process.env.DYNAMODB_PRODUCTS_DB
    }).promise();

    if (!productsDBInfo || !productsDBInfo.Items) {
      throw new Error('Incorrect response received from "Products" database');
    }

    const productStocksDBInfo = await dynamo.scan({
      TableName: process.env.DYNAMODB_STOCKS_DB
    }).promise();

    if (!productStocksDBInfo || !productStocksDBInfo.Items) {
      throw new Error('Incorrect response received from "Stocks" database');
    }

    const products = productsDBInfo.Items;
    const productStocks = productStocksDBInfo.Items;

    const responseProductList = products.map(product => {
      const stock = productStocks.find(productStock => productStock.product_id === product.id);

      if (!stock) {
        throw new Error(`Stock belonging to a product with id ${product.id} was not found`);
      }

      return prepareResponse(product, stock);
    })

    return {
      statusCode: 200,
      body: JSON.stringify(responseProductList),
    };
  } catch(error) {
    return {
      statusCode: 500,
      message: 'Something went wrong during getting product list',
      error: JSON.stringify(error)
    }
  }
};
