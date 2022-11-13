CREATE TABLE "Products" (
  "id" uuid NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "price" INTEGER NOT NULL,
  CONSTRAINT "PRODUCT_PRIMARY_KEY" PRIMARY KEY ("id")
);

CREATE TABLE "Stocks" (
  "id" uuid NOT NULL,
  "count" INTEGER NOT NULL,
  "product_id" uuid NOT NULL
);

ALTER TABLE "Stocks" ADD CONSTRAINT "STOCKS_PRODUCTS_FOREIGN_KEY" FOREIGN KEY ("product_id") REFERENCES "Products"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE "Products" ADD "image" TEXT DEFAULT 'https://rss-nodejs-in-aws-product-images.s3.eu-west-1.amazonaws.com/default.jpg';