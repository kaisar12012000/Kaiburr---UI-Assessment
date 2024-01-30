export const API_URLS = {
    getAllProducts: (limit) => `https://dummyjson.com/products?limit=${limit}`,
    searchProduct: (q) => `https://dummyjson.com/products/search?q=${q}&limit=0`
}