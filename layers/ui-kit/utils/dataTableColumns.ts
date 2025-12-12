import { type ColumnDef } from '@tanstack/vue-table';
import { h } from 'vue';

// Helper to create a checkbox column for row selection
export function createSelectionColumn<TData>(): ColumnDef<TData> {
  return {
    id: 'select',
    header: ({ table }) =>
      h('input', {
        type: 'checkbox',
        checked: table.getIsAllRowsSelected(),
        indeterminate: table.getIsSomeRowsSelected(),
        onChange: table.getToggleAllRowsSelectedHandler(),
        class: 'w-4 h-4 text-primary bg-background border-gray-300 rounded focus:ring-primary focus:ring-2 cursor-pointer',
      }),
    cell: ({ row }) =>
      h('input', {
        type: 'checkbox',
        checked: row.getIsSelected(),
        disabled: !row.getCanSelect(),
        onChange: row.getToggleSelectedHandler(),
        class: 'w-4 h-4 text-primary bg-background border-gray-300 rounded focus:ring-primary focus:ring-2 cursor-pointer',
      }),
    enableSorting: false,
    enableHiding: false,
  };
}

// Helper to create an actions column
export function createActionsColumn<TData>(
  actions: (row: TData) => any
): ColumnDef<TData> {
  return {
    id: 'actions',
    header: () => h('div', { class: 'text-right' }, 'Actions'),
    cell: ({ row }) => {
      const component = actions(row.original);
      return h('div', { class: 'flex items-center justify-end gap-2' }, [component]);
    },
    enableSorting: false,
  };
}

// Helper to create a badge column (for status, etc.)
export function createBadgeColumn<TData>(
  accessor: keyof TData & string,
  label: string,
  colorMap: Record<string, string>
): ColumnDef<TData> {
  return {
    accessorKey: accessor,
    header: label,
    cell: ({ getValue }) => {
      const value = getValue() as string;
      const color = colorMap[value] || 'gray';
      return h(
        'span',
        {
          class: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${color}-100 text-${color}-800 dark:bg-${color}-900/30 dark:text-${color}-300`,
        },
        value
      );
    },
  };
}

// Helper to create a currency column
export function createCurrencyColumn<TData>(
  accessor: keyof TData & string,
  label: string,
  currency: string = 'USD'
): ColumnDef<TData> {
  return {
    accessorKey: accessor,
    header: label,
    cell: ({ getValue }) => {
      const value = getValue() as number;
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
      }).format(value);
    },
  };
}

// Helper to create a date column
export function createDateColumn<TData>(
  accessor: keyof TData & string,
  label: string,
  format: 'short' | 'long' | 'relative' = 'short'
): ColumnDef<TData> {
  return {
    accessorKey: accessor,
    header: label,
    cell: ({ getValue }) => {
      const value = getValue() as string;
      const date = new Date(value);

      if (format === 'relative') {
        const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
        const diff = date.getTime() - Date.now();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (Math.abs(days) < 1) {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          return rtf.format(hours, 'hour');
        }
        if (Math.abs(days) < 30) {
          return rtf.format(days, 'day');
        }
        const months = Math.floor(days / 30);
        return rtf.format(months, 'month');
      }

      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: format === 'long' ? 'long' : 'short',
        day: 'numeric',
      });
    },
  };
}

// Helper to create an image column
export function createImageColumn<TData>(
  accessor: keyof TData & string,
  label: string,
  fallback?: string
): ColumnDef<TData> {
  return {
    accessorKey: accessor,
    header: label,
    cell: ({ getValue }) => {
      const value = getValue() as string | null;
      return h('img', {
        src: value || fallback || 'https://via.placeholder.com/40',
        alt: label,
        class: 'w-10 h-10 rounded object-cover',
      });
    },
    enableSorting: false,
  };
}
