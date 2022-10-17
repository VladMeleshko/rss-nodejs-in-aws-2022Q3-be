import { tryDBConnect } from './database/db-connection';
import * as Joi from 'joi';
import {v4} from 'uuid';
import { serverErrorResponse } from './utils/serverErrorResponse';
import AWS from 'aws-sdk';

const databaseConnectionPromise = tryDBConnect();

const validationSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string(),
  price: Joi.number().required(),
  count: Joi.number().required()
});

export const catalogBatchProcess = async (event) => {
  const productsList = event.Records.map(({body}) => body);

  if (!productsList || !productsList.length) {
    return {
      statusCode: 400,
      message: "Сouldn't get a list of imported products"
    }
  }

  const sns = new AWS.SNS({region: 'eu-west-1'});
  const snsArn = process.env.SNS_ARN;

  try{
    const databaseConnection = await databaseConnectionPromise;

    await databaseConnection.transaction(async (manager) => {
      for await (const productItem of productsList) {
        const product = JSON.parse(productItem);

        const {value, error} = validationSchema.validate(product);

        if (error) {
          throw new Error(JSON.stringify(error));
        }

        const productId = v4();
        const stockId = v4();

        const savedProduct = await manager.getRepository("Products").save({
          id: productId,
          title: value.title,
          description: value.description,
          price: value.price
        });

        await manager.getRepository("Stocks").save({
          id: stockId,
          product: savedProduct,
          count: value.count
        })

        // used catch instead of callback because, if you will use callback in piblish method with promise, than SNS will send duplicates of messages
        await sns.publish({
          Subject: 'Your product has been uploaded',
          Message: `The following product has been uploaded: ${JSON.stringify(product)}`,
          TopicArn: snsArn,
          MessageAttributes: {
            count: {
              DataType: "Number", 
              StringValue: `${value.count}`
           }
          }
        }).promise().catch(err => {
          throw new Error(JSON.stringify(err));
        });
      }
    });
  } catch (error) {
    return serverErrorResponse(500, 'Something went wrong during the creation of new product(s)', error);
  }
};
