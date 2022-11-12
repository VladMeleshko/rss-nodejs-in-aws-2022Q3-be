const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
  path: path.join(__dirname, '../.env'),
});

module.exports = {
  PORT: process.env['PORT'],
  products: process.env['products'],
  cart: process.env['cart']
};
