import { z } from 'zod';
import { mockProducts } from '../../utils/mockData';

const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().min(0),
  stock: z.number().int().min(0),
  category: z.string().min(1),
  status: z.enum(['active', 'inactive', 'discontinued']),
});

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Product ID is required',
    });
  }

  try {
    const body = await readBody(event);
    const data = productSchema.parse(body);

    // Find product index
    const index = mockProducts.findIndex((p) => p.id === id);

    if (index === -1) {
      throw createError({
        statusCode: 404,
        message: 'Product not found',
      });
    }

    // Update product
    mockProducts[index] = {
      ...mockProducts[index],
      ...data,
      updated_at: new Date().toISOString(),
    };

    return {
      success: true,
      data: mockProducts[index],
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        message: 'Validation error',
        data: { errors: error.errors },
      });
    }
    throw error;
  }
});
