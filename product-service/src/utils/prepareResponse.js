export const prepareResponse = (product) => {
  const response = {...product, count: product.stock.count};
  delete response.stock;
  return response;
}