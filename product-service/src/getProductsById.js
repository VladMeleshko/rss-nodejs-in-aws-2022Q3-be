import AWS from 'aws-sdk';
import { prepareResponse } from './utils/prepareResponse';

const dynamo = new AWS.DynamoDB.DocumentClient({
  region: 'eu-west-1'
});

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

    const productDBInfo = await dynamo.query({
      TableName: process.env.DYNAMODB_PRODUCTS_DB,
      KeyConditionExpression: 'id = :id',
      ExpressionAttributeValues: {':id': productId}
    }).promise();

    if (!productDBInfo || !productDBInfo.Items) {
      throw new Error('Incorrect response received from "Products" database');
    }

    if (!productDBInfo.Items.length) {
      return {
        statusCode: 404,
        message: 'Product not found',
      };
    }

    const productStockDBInfo = await dynamo.query({
      TableName: process.env.DYNAMODB_STOCKS_DB,
      KeyConditionExpression: 'product_id = :productId',
      ExpressionAttributeValues: {':productId': productId}
    }).promise();

    if (!productStockDBInfo || !productStockDBInfo.Items) {
      throw new Error('Incorrect response received from "Stocks" database');
    }

    if (!productStockDBInfo.Items.length) {
      return {
        statusCode: 404,
        message: 'Stock not found',
      };
    }

    const product = productDBInfo.Items[0];
    const stock = productStockDBInfo.Items[0];

    const responseProduct = prepareResponse(product, stock);

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
