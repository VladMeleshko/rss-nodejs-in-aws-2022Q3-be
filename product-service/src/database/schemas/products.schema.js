import {EntitySchema} from 'typeorm';

export const productSchema = new EntitySchema({
  name: "Products",
  tableName: "Products",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      nullable: false
    },
    title: {
      type: "varchar",
      nullable: false
    },
    description: {
      type: "text",
    },
    price: {
      type: "integer",
      nullable: false
    },
    image: {
      type: "text",
      default: "https://rss-nodejs-in-aws-product-images.s3.eu-west-1.amazonaws.com/default.jpg"
    }
  },
  relations: {
    stock: {
      target: "Stocks",
      type: "one-to-one",
      inverseSide: 'product',
      cascade: true
    },
  },
})