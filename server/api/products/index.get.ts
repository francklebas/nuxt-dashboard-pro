import { mockProducts } from '../../utils/mockData';
import type { Product, PaginatedResponse, QueryParams } from '~/layers/core/types/database';

export default defineEventHandler(async (event): Promise<PaginatedResponse<Product>> => {
  const query = getQuery(event) as QueryParams;

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const search = query.search?.toString().toLowerCase() || '';
  const sortBy = query.sortBy?.toString() || 'created_at';
  const sortOrder = (query.sortOrder?.toString() as 'asc' | 'desc') || 'desc';
  const filters = query.filters as Record<string, string> | undefined;

  let filteredProducts = [...mockProducts];

  // Apply search
  if (search) {
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(search) ||
        product.description?.toLowerCase().includes(search) ||
        product.category.toLowerCase().includes(search)
    );
  }

  // Apply filters
  if (filters) {
    if (filters.category) {
      filteredProducts = filteredProducts.filter((p) => p.category === filters.category);
    }
    if (filters.status) {
      filteredProducts = filteredProducts.filter((p) => p.status === filters.status);
    }
    if (filters.minPrice) {
      filteredProducts = filteredProducts.filter((p) => p.price >= Number(filters.minPrice));
    }
    if (filters.maxPrice) {
      filteredProducts = filteredProducts.filter((p) => p.price <= Number(filters.maxPrice));
    }
    if (filters.inStock === 'true') {
      filteredProducts = filteredProducts.filter((p) => p.stock > 0);
    }
  }

  // Apply sorting
  filteredProducts.sort((a, b) => {
    let aVal: string | number = a[sortBy as keyof Product] as string | number;
    let bVal: string | number = b[sortBy as keyof Product] as string | number;

    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const total = filteredProducts.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const data = filteredProducts.slice(startIndex, endIndex);

  return {
    data,
    total,
    page,
    limit,
    totalPages,
  };
});
