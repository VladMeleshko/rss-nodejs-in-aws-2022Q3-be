import { DataSource } from 'typeorm';
import { productSchema } from './schemas/products.schema';
import { stockSchema } from './schemas/stocks.schema';

export const tryDBConnect = async () => {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    synchronize: false,
    entities: [productSchema, stockSchema]
  });

  await dataSource.initialize();
  
  return dataSource;
};
  