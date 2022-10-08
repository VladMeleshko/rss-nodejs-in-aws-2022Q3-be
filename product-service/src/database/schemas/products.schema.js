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