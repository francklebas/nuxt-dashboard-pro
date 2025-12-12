import { mockOrders } from '../../utils/mockData';
import type { Order, PaginatedResponse, QueryParams } from '~/layers/core/types/database';

export default defineEventHandler(async (event): Promise<PaginatedResponse<Order>> => {
  const query = getQuery(event) as QueryParams;

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const search = query.search?.toString().toLowerCase() || '';
  const sortBy = query.sortBy?.toString() || 'created_at';
  const sortOrder = (query.sortOrder?.toString() as 'asc' | 'desc') || 'desc';
  const filters = query.filters as Record<string, string> | undefined;

  let filteredOrders = [...mockOrders];

  // Apply search
  if (search) {
    filteredOrders = filteredOrders.filter(
      (order) =>
        order.id.toLowerCase().includes(search) ||
        order.user_email.toLowerCase().includes(search) ||
        order.user_name?.toLowerCase().includes(search)
    );
  }

  // Apply filters
  if (filters) {
    if (filters.status) {
      filteredOrders = filteredOrders.filter((o) => o.status === filters.status);
    }
    if (filters.payment_method) {
      filteredOrders = filteredOrders.filter((o) => o.payment_method === filters.payment_method);
    }
    if (filters.minAmount) {
      filteredOrders = filteredOrders.filter((o) => o.total_amount >= Number(filters.minAmount));
    }
    if (filters.maxAmount) {
      filteredOrders = filteredOrders.filter((o) => o.total_amount <= Number(filters.maxAmount));
    }
  }

  // Apply sorting
  filteredOrders.sort((a, b) => {
    let aVal: string | number | null = a[sortBy as keyof Order] as string | number | null;
    let bVal: string | number | null = b[sortBy as keyof Order] as string | number | null;

    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();

    if (aVal === null) return 1;
    if (bVal === null) return -1;
    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const total = filteredOrders.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const data = filteredOrders.slice(startIndex, endIndex);

  return {
    data,
    total,
    page,
    limit,
    totalPages,
  };
});
