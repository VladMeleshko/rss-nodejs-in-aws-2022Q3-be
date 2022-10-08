export const prepareResponse = (product, stock) => {
    return {...product, count: stock.count};
}