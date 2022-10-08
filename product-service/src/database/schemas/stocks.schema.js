import {EntitySchema} from 'typeorm';

export const stockSchema = new EntitySchema({
  name: "Stocks",
  tableName: "Stocks",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      nullable: false
    },
    count: {
      type: "integer",
      nullable: false
    },
  },
  relations: {
    product: {
      target: "Products",
      type: "one-to-one",
      inverseSide: 'stock',
      joinColumn: {
        name: 'product_id',
        referencedColumnName: 'id',
        foreignKeyConstraintName: 'STOCKS_PRODUCTS_FOREIGN_KEY'
      }
    },
  },
})