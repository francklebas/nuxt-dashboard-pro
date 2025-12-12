import { mockUsers } from '../../utils/mockData';
import type { User, PaginatedResponse, QueryParams } from '~/layers/core/types/database';

export default defineEventHandler(async (event): Promise<PaginatedResponse<User>> => {
  const query = getQuery(event) as QueryParams;

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const search = query.search?.toString().toLowerCase() || '';
  const sortBy = query.sortBy?.toString() || 'created_at';
  const sortOrder = (query.sortOrder?.toString() as 'asc' | 'desc') || 'desc';
  const filters = query.filters as Record<string, string> | undefined;

  let filteredUsers = [...mockUsers];

  // Apply search
  if (search) {
    filteredUsers = filteredUsers.filter(
      (user) =>
        user.email.toLowerCase().includes(search) ||
        user.full_name?.toLowerCase().includes(search)
    );
  }

  // Apply filters
  if (filters) {
    if (filters.role) {
      filteredUsers = filteredUsers.filter((u) => u.role === filters.role);
    }
    if (filters.status) {
      filteredUsers = filteredUsers.filter((u) => u.status === filters.status);
    }
  }

  // Apply sorting
  filteredUsers.sort((a, b) => {
    let aVal: string | number | null = a[sortBy as keyof User] as string | number | null;
    let bVal: string | number | null = b[sortBy as keyof User] as string | number | null;

    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();

    if (aVal === null) return 1;
    if (bVal === null) return -1;
    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const total = filteredUsers.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const data = filteredUsers.slice(startIndex, endIndex);

  return {
    data,
    total,
    page,
    limit,
    totalPages,
  };
});
