import { tryDBConnect } from './database/db-connection';
import { prepareResponse } from './utils/prepareResponse';
import * as Joi from 'joi';
import {v4} from 'uuid';

const productRepositoryPromise = tryDBConnect().then(connection => connection.getRepository("Products"));
const databaseConnectionPromise = tryDBConnect();

const validationSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string(),
  price: Joi.number().required(),
  count: Joi.number().required()
});

export const createProduct = async (event) => {
  console.log('Handler for creating new product called');
    
  try {
    let {body} = event;

    console.log('When calling, the following arguments of the request body are received: ', body);

    if (!body) {
      return {
        statusCode: 400,
        body: 'Data for creating new product is not defined'
      }
    }

    if (typeof body === 'string') {
      body = JSON.parse(body)
    }

    const {value, error} = validationSchema.validate(body);

    if (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Data for creating new product is not valid',
          error
        })
      }
    }

    console.log('New product will be created with data: ', value);

    const productId = v4();
    const stockId = v4();
    const productRepository = await productRepositoryPromise;
    const databaseConnection = await databaseConnectionPromise;

    await databaseConnection.transaction(async (manager) => {
      const savedProduct = await manager.getRepository("Products").save(
        {
          id: productId,
          title: value.title,
          description: value.description,
          price: value.price
         }
      )

      await manager.getRepository("Stocks").save({
        id: stockId,
        product: savedProduct,
        count: value.count
      })
    });

    const product = await productRepository.findOne({
      where: {
        id: productId
      },
      relations: {
        stock: true
      }
    });

    const responseProduct = prepareResponse(product);

    return {
      statusCode: 201,
      body: JSON.stringify(responseProduct)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Something went wrong during the creation of new product',
        error
      })
    }
  }
};
