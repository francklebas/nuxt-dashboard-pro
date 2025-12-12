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
  try {
    const body = await readBody(event);
    const data = productSchema.parse(body);

    // Generate new product
    const newProduct = {
      id: crypto.randomUUID(),
      ...data,
      image_url: 'https://via.placeholder.com/150',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Add to mockProducts array
    mockProducts.unshift(newProduct);

    return {
      success: true,
      data: newProduct,
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
