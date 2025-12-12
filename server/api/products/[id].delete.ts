import { mockProducts } from '../../utils/mockData';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Product ID is required',
    });
  }

  // Find product index
  const index = mockProducts.findIndex((p) => p.id === id);

  if (index === -1) {
    throw createError({
      statusCode: 404,
      message: 'Product not found',
    });
  }

  // Remove product
  const deletedProduct = mockProducts.splice(index, 1)[0];

  return {
    success: true,
    data: deletedProduct,
  };
});
