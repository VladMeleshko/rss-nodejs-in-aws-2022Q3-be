const {products} = require('./constants/data');

module.exports.getProductsList = async (event) => {
  const productList = await Promise.resolve(products);

  return {
    statusCode: 200,
    body: JSON.stringify(productList),
  };
};
