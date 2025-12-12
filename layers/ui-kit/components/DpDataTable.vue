<script setup lang="ts" generic="TData extends Record<string, any>">
import {
  useVueTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  type ColumnDef,
  type SortingState,
  type RowSelectionState,
  type PaginationState,
  FlexRender,
} from '@tanstack/vue-table';

interface Props {
  columns: ColumnDef<TData, any>[];
  data: TData[];
  loading?: boolean;
  pageCount?: number;
  manualPagination?: boolean;
  manualSorting?: boolean;
  enableRowSelection?: boolean;
  enableMultiRowSelection?: boolean;
  onSortingChange?: (sorting: SortingState) => void;
  onPaginationChange?: (pagination: PaginationState) => void;
  onRowSelectionChange?: (selection: RowSelectionState) => void;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  pageCount: 0,
  manualPagination: false,
  manualSorting: false,
  enableRowSelection: false,
  enableMultiRowSelection: true,
});

const emit = defineEmits<{
  rowClick: [row: TData];
}>();

// State
const sorting = ref<SortingState>([]);
const rowSelection = ref<RowSelectionState>({});
const pagination = ref<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
});

// Watch for external changes
watch(sorting, (value) => {
  if (props.onSortingChange) {
    props.onSortingChange(value);
  }
});

watch(pagination, (value) => {
  if (props.onPaginationChange) {
    props.onPaginationChange(value);
  }
}, { deep: true });

watch(rowSelection, (value) => {
  if (props.onRowSelectionChange) {
    props.onRowSelectionChange(value);
  }
}, { deep: true });

// Create table instance
const table = useVueTable({
  get data() {
    return props.data;
  },
  get columns() {
    return props.columns;
  },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  state: {
    get sorting() {
      return sorting.value;
    },
    get rowSelection() {
      return rowSelection.value;
    },
    get pagination() {
      return pagination.value;
    },
  },
  onSortingChange: (updaterOrValue) => {
    sorting.value =
      typeof updaterOrValue === 'function'
        ? updaterOrValue(sorting.value)
        : updaterOrValue;
  },
  onRowSelectionChange: (updaterOrValue) => {
    rowSelection.value =
      typeof updaterOrValue === 'function'
        ? updaterOrValue(rowSelection.value)
        : updaterOrValue;
  },
  onPaginationChange: (updaterOrValue) => {
    pagination.value =
      typeof updaterOrValue === 'function'
        ? updaterOrValue(pagination.value)
        : updaterOrValue;
  },
  enableRowSelection: props.enableRowSelection,
  enableMultiRowSelection: props.enableMultiRowSelection,
  manualPagination: props.manualPagination,
  manualSorting: props.manualSorting,
  pageCount: props.pageCount,
});

const selectedRowsCount = computed(() => {
  return Object.keys(rowSelection.value).length;
});
</script>

<template>
  <div class="w-full space-y-4">
    <!-- Selected Rows Info -->
    <div
      v-if="enableRowSelection && selectedRowsCount > 0"
      class="flex items-center justify-between px-4 py-2 bg-primary/10 border border-primary/20 rounded-md"
    >
      <span class="text-sm text-foreground">
        {{ selectedRowsCount }} row(s) selected
      </span>
      <slot name="bulk-actions" :selected-rows="table.getSelectedRowModel().rows" />
    </div>

    <!-- Table Container -->
    <div class="relative overflow-x-auto border border-border rounded-lg">
      <table class="w-full text-sm text-left">
        <!-- Table Header -->
        <thead class="text-xs uppercase bg-muted/50 border-b border-border">
          <tr
            v-for="headerGroup in table.getHeaderGroups()"
            :key="headerGroup.id"
          >
            <th
              v-for="header in headerGroup.headers"
              :key="header.id"
              :colSpan="header.colSpan"
              scope="col"
              class="px-6 py-3 text-foreground"
              :class="header.column.getCanSort() ? 'cursor-pointer hover:bg-muted/80 select-none' : ''"
              @click="header.column.getToggleSortingHandler()?.($event)"
            >
              <div v-if="!header.isPlaceholder" class="flex items-center gap-2">
                <FlexRender
                  :render="header.column.columnDef.header"
                  :props="header.getContext()"
                />
                <Icon
                  v-if="header.column.getCanSort()"
                  :name="
                    header.column.getIsSorted() === 'desc'
                      ? 'lucide:arrow-down'
                      : header.column.getIsSorted() === 'asc'
                      ? 'lucide:arrow-up'
                      : 'lucide:arrow-up-down'
                  "
                  class="w-4 h-4"
                  :class="
                    header.column.getIsSorted()
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  "
                />
              </div>
            </th>
          </tr>
        </thead>

        <!-- Table Body -->
        <tbody v-if="!loading && table.getRowModel().rows.length > 0">
          <tr
            v-for="row in table.getRowModel().rows"
            :key="row.id"
            class="bg-background border-b border-border hover:bg-muted/30 transition-colors"
          >
            <td
              v-for="cell in row.getVisibleCells()"
              :key="cell.id"
              class="px-6 py-4 text-foreground"
              :class="cell.column.id !== 'actions' && cell.column.id !== 'select' ? 'cursor-pointer' : ''"
              @click.capture="(event) => {
                // Skip actions and select columns
                if (cell.column.id === 'actions' || cell.column.id === 'select') {
                  return;
                }

                const target = event.target as HTMLElement;

                // Check if click is on a button or inside a button
                if (target.closest('button')) {
                  return;
                }

                emit('rowClick', row.original);
              }"
            >
              <FlexRender
                :render="cell.column.columnDef.cell"
                :props="cell.getContext()"
              />
            </td>
          </tr>
        </tbody>

        <!-- Loading State -->
        <tbody v-else-if="loading">
          <tr>
            <td :colspan="table.getAllColumns().length" class="px-6 py-12 text-center">
              <div class="flex items-center justify-center gap-2 text-muted-foreground">
                <Icon name="lucide:loader-2" class="w-5 h-5 animate-spin" />
                <span>Loading...</span>
              </div>
            </td>
          </tr>
        </tbody>

        <!-- Empty State -->
        <tbody v-else>
          <tr>
            <td :colspan="table.getAllColumns().length" class="px-6 py-12 text-center">
              <div class="flex flex-col items-center gap-2 text-muted-foreground">
                <Icon name="lucide:inbox" class="w-12 h-12" />
                <p>No data available</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
      <div class="text-sm text-muted-foreground">
        Showing {{ table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1 }}
        to {{ Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, manualPagination ? pageCount * table.getState().pagination.pageSize : table.getFilteredRowModel().rows.length) }}
        of {{ manualPagination ? pageCount * table.getState().pagination.pageSize : table.getFilteredRowModel().rows.length }} results
      </div>

      <div class="flex items-center gap-2">
        <DpButton
          variant="outline"
          size="sm"
          :disabled="!table.getCanPreviousPage()"
          @click="table.previousPage()"
        >
          <Icon name="lucide:chevron-left" class="w-4 h-4" />
        </DpButton>

        <div class="flex items-center gap-1">
          <span class="text-sm text-foreground px-2">
            Page {{ table.getState().pagination.pageIndex + 1 }} of {{ table.getPageCount() }}
          </span>
        </div>

        <DpButton
          variant="outline"
          size="sm"
          :disabled="!table.getCanNextPage()"
          @click="table.nextPage()"
        >
          <Icon name="lucide:chevron-right" class="w-4 h-4" />
        </DpButton>
      </div>
    </div>
  </div>
</template>
