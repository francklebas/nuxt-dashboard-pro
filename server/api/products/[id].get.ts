import { mockProducts } from '../../utils/mockData';
import type { Product } from '~/layers/core/types/database';

export default defineEventHandler(async (event): Promise<Product> => {
  const id = getRouterParam(event, 'id');

  const product = mockProducts.find((p) => p.id === id);

  if (!product) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Product not found',
    });
  }

  return product;
});
