import type { PaginatedResponse, QueryParams } from '~/layers/core/types/database';

export function useDataTable<T>(endpoint: string) {
  const loading = ref(false);
  const data = ref<T[]>([]);
  const total = ref(0);
  const error = ref<Error | null>(null);

  const queryParams = ref<QueryParams>({
    page: 1,
    limit: 10,
    search: '',
    sortBy: 'created_at',
    sortOrder: 'desc',
    filters: {},
  });

  const fetchData = async () => {
    loading.value = true;
    error.value = null;

    try {
      const params = new URLSearchParams();

      if (queryParams.value.page) params.append('page', queryParams.value.page.toString());
      if (queryParams.value.limit) params.append('limit', queryParams.value.limit.toString());
      if (queryParams.value.search) params.append('search', queryParams.value.search);
      if (queryParams.value.sortBy) params.append('sortBy', queryParams.value.sortBy);
      if (queryParams.value.sortOrder) params.append('sortOrder', queryParams.value.sortOrder);

      // Add filters
      if (queryParams.value.filters) {
        Object.entries(queryParams.value.filters).forEach(([key, value]) => {
          if (value !== '' && value !== null && value !== undefined) {
            params.append(`filters[${key}]`, value.toString());
          }
        });
      }

      const response = await $fetch<PaginatedResponse<T>>(`${endpoint}?${params.toString()}`);

      data.value = response.data;
      total.value = response.total;
    } catch (e) {
      error.value = e as Error;
      console.error('Error fetching data:', e);
    } finally {
      loading.value = false;
    }
  };

  const setPage = (page: number) => {
    queryParams.value.page = page;
    fetchData();
  };

  const setLimit = (limit: number) => {
    queryParams.value.limit = limit;
    queryParams.value.page = 1; // Reset to first page
    fetchData();
  };

  const setSearch = (search: string) => {
    queryParams.value.search = search;
    queryParams.value.page = 1; // Reset to first page
    fetchData();
  };

  const setSort = (sortBy: string, sortOrder: 'asc' | 'desc') => {
    queryParams.value.sortBy = sortBy;
    queryParams.value.sortOrder = sortOrder;
    fetchData();
  };

  const setFilters = (filters: Record<string, any>) => {
    queryParams.value.filters = filters;
    queryParams.value.page = 1; // Reset to first page
    fetchData();
  };

  const clearFilters = () => {
    queryParams.value.filters = {};
    queryParams.value.search = '';
    queryParams.value.page = 1;
    fetchData();
  };

  const refresh = () => {
    fetchData();
  };

  // Computed properties
  const pageCount = computed(() => {
    return Math.ceil(total.value / (queryParams.value.limit || 10)) || 1;
  });

  // Auto-fetch on mount
  onMounted(() => {
    fetchData();
  });

  return {
    // State
    data: readonly(data),
    loading: readonly(loading),
    error: readonly(error),
    total: readonly(total),
    queryParams: readonly(queryParams),
    pageCount: readonly(pageCount),

    // Methods
    fetchData,
    setPage,
    setLimit,
    setSearch,
    setSort,
    setFilters,
    clearFilters,
    refresh,
  };
}
