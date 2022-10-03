import AWS from 'aws-sdk';
import { prepareResponse } from './utils/prepareResponse';
import * as Joi from 'joi';
import {v4} from 'uuid';

const dynamo = new AWS.DynamoDB.DocumentClient({
  region: 'eu-west-1'
});
const validationSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string(),
  price: Joi.number(),
  count: Joi.number()
});

export const createProduct = async (event) => {
  console.log('Handler for creating new product called');
    
  try {
    let {body} = event;

    console.log('When calling, the following arguments of the request body are received: ', body);

    if (!body) {
      return {
        statusCode: 400,
        message: 'Data for creating new product is not defined'
      }
    }

    if (typeof body === 'string') {
      body = JSON.parse(body)
    }

    const {value, error} = validationSchema.validate(body);

    if (error) {
      return {
        statusCode: 400,
        message: 'Data for creating new product is not valid',
        error: JSON.stringify(error),
      }
    }

    console.log('New product will be created with data: ', value);

    const productId = v4();
    const product = {
      id: productId,
      title: value.title,
      description: value.description,
      price: value.price
    }
    const stock = {
      product_id: productId,
      count: value.count
    }

    await dynamo.put({
      TableName: process.env.DYNAMODB_PRODUCTS_DB,
      Item: product
    }).promise()

    await dynamo.put({
      TableName: process.env.DYNAMODB_STOCKS_DB,
      Item: stock
    }).promise()

    return {
      statusCode: 201,
      body: JSON.stringify(prepareResponse(product, stock))
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: 'Something went wrong during the creation of new product',
      error: JSON.stringify(error)
    }
  }
};
