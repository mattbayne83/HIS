import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

export interface DataTableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (value: unknown, row: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  selectable?: boolean;
  selectedIds?: Set<string>;
  onSelectionChange?: (selectedIds: Set<string>) => void;
}

type SortDirection = 'asc' | 'desc' | null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function DataTable<T extends Record<string, any> & { id?: string }>({
  columns,
  data,
  onRowClick,
  emptyMessage = 'No data available',
  selectable = false,
  selectedIds = new Set<string>(),
  onSelectionChange,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSelectAll = () => {
    if (!onSelectionChange) return;

    if (selectedIds.size === sortedData.length && sortedData.length > 0) {
      // Deselect all
      onSelectionChange(new Set<string>());
    } else {
      // Select all visible rows
      const allIds = new Set<string>(
        sortedData.map((row) => row.id).filter((id): id is string => !!id)
      );
      onSelectionChange(allIds);
    }
  };

  const handleToggleRow = (id: string) => {
    if (!onSelectionChange) return;

    const newSelection = new Set(selectedIds);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    onSelectionChange(newSelection);
  };

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortKey(null);
        setSortDirection(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortKey || !sortDirection) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortKey] as string | number;
      const bVal = b[sortKey] as string | number;

      if (aVal === bVal) return 0;

      const comparison = aVal < bVal ? -1 : 1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [data, sortKey, sortDirection]);

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full">
        <thead className="bg-surface-alt border-b border-border">
          <tr>
            {selectable && (
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedIds.size === sortedData.length && sortedData.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/20"
                  aria-label="Select all"
                />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={`px-4 py-3 text-left text-sm font-semibold text-text-high ${
                  column.sortable ? 'cursor-pointer select-none hover:bg-surface transition-colors' : ''
                }`}
                onClick={column.sortable ? () => handleSort(String(column.key)) : undefined}
              >
                <div className="flex items-center gap-2">
                  {column.label}
                  {column.sortable && sortKey === column.key && (
                    sortDirection === 'asc' ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white">
          {sortedData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (selectable ? 1 : 0)}
                className="px-4 py-8 text-center text-text-muted"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sortedData.map((row, rowIndex) => {
              const rowId = row.id || `row-${rowIndex}`;
              return (
                <tr
                  key={rowId}
                  className={`
                    border-b border-border last:border-b-0
                    ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-surface/30'}
                    ${onRowClick ? 'cursor-pointer hover:bg-surface-alt transition-colors' : ''}
                  `}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {selectable && (
                    <td className="w-12 px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(rowId)}
                        onChange={() => handleToggleRow(rowId)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/20"
                        aria-label={`Select row ${rowId}`}
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className="px-4 py-3 text-sm text-text-high"
                  >
                    {column.render
                      ? column.render(row[String(column.key)], row)
                      : String(row[String(column.key)] ?? '')}
                  </td>
                ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
