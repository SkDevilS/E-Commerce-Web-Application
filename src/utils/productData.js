import productsData from '../mocks/products.json';

export const getProductsByCategory = (category) => {
  if (!category) {
    return productsData;
  }
  return productsData.filter((p) => p.category === category);
};

export const getProductBySlug = (slug) => {
  return productsData.find((p) => p.slug === slug);
};

export const getProductById = (id) => {
  return productsData.find((p) => p.id === id);
};

export const getAllProducts = () => {
  return productsData;
};

