// components/GenericList.tsx
import { useState, useEffect } from "react";
import * as X from "@/components/xcomponents";
import SimpleSkeleton from "../loading/simple_skeleton";

interface GenericListProps<T> {
    fetchData: (filters?: Record<string, any>, sort?: { field: string; direction: 'asc' | 'desc' }) => Promise<T[]>;
    columns: ColumnConfig<T>[];
    emptyMessage?: string;
    onRowClick?: (item: T) => void;
    rowClassName?: (item: T) => string;
    selection?: {
        selectedIds: (string | number)[];
        onSelectionChange: (selectedItems: T[]) => void;
    };
    filters?: FilterConfig[];
    sortOptions?: SortConfig[];
}

interface ColumnConfig<T> {
    header: string;
    accessor: keyof T | ((item: T) => React.ReactNode);
    className?: string;
    render?: (value: any, item: T) => React.ReactNode;
    actions?: ActionConfig<T>[];
}

interface ActionConfig<T> {
    label: string;
    icon?: React.ReactNode;
    onClick: (item: T) => void;
    className?: string;
    condition?: (item: T) => boolean;
}

interface FilterConfig {
    label: string;
    field: string;
    options: { value: any; label: string }[];
}

interface SortConfig {
    label: string;
    field: string;
}

export function GenericList<T extends { id: string | number }>({
    fetchData,
    columns,
    emptyMessage = "No data available",
    onRowClick,
    rowClassName,
    selection,
    filters,
    sortOptions,
}: GenericListProps<T>) {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [localFilters, setLocalFilters] = useState<Record<string, any>>({});
    const [localSort, setLocalSort] = useState<{ field: string; direction: 'asc' | 'desc' } | null>(null);

    const loadData = async () => {
        try {
            setLoading(true);
            const result = await fetchData(localFilters, localSort || undefined);
            setData(result);
            setError(null);
        } catch (err) {
            setError("Failed to fetch data");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [localFilters, localSort]);

    const handleSelection = (item: T) => {
        if (!selection) return;

        const newSelection = selection.selectedIds.includes(item.id)
            ? selection.selectedIds.filter(id => id !== item.id)
            : [...selection.selectedIds, item.id];

        selection.onSelectionChange(data.filter(d => newSelection.includes(d.id)));
    };

    const handleFilterChange = (field: string, value: any) => {
        setLocalFilters(prev => ({ ...prev, [field]: value }));
    };

    const handleSortChange = (field: string, direction: 'asc' | 'desc') => {
        setLocalSort({ field, direction });
    };

    return (
        <div className="w-full">
            <X.Container className="w-full">
                {/* Error message */}
                {error && (
                    <X.ErrorBox visible className="mb-4">
                        {error}
                    </X.ErrorBox>
                )}

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left border-b-2 border-[var(--secondary-color)]">
                                {selection && <th className="p-4">Select</th>}
                                {columns.map((column, idx) => (
                                    <th key={idx} className={`p-4 ${column.className || ''}`}>
                                        {column.header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={columns.length + (selection ? 1 : 0)} className="p-4 text-center">
                                        <SimpleSkeleton />
                                    </td>
                                </tr>
                            ) : data.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length + (selection ? 1 : 0)} className="p-4 text-center">
                                        {emptyMessage}
                                    </td>
                                </tr>
                            ) : (
                                data.map((item) => (
                                    <tr
                                        key={item.id}
                                        className={`border-b border-[var(--secondary-color)] 
        ${onRowClick ? 'cursor-pointer hover:bg-[var(--secondary-color)]/5' : ''} 
        ${selection?.selectedIds.includes(item.id) ? 'bg-[var(--background-color)]/10' : ''} 
        ${rowClassName?.(item) || ''}  ${selection ? 'hover:bg-white/5 cursor-pointer' : ''}`}
                                        onClick={() => {
                                            onRowClick?.(item);
                                            if (selection) handleSelection(item);
                                        }}
                                    >
                                        {selection && (
                                            <td className="p-4" onClick={(e) => e.stopPropagation()}>
                                                <X.ToggleBox
                                                    checked={selection.selectedIds.includes(item.id)}
                                                    onChange={() => handleSelection(item)}
                                                />
                                            </td>
                                        )}

                                        {columns.map((column, colIdx) => {
                                            let cellContent: React.ReactNode;

                                            if (column.accessor instanceof Function) {
                                                cellContent = column.accessor(item);
                                            } else {
                                                const value = item[column.accessor];
                                                cellContent = column.render ? column.render(value, item) : value;
                                            }

                                            return (
                                                <td key={colIdx} className={`p-4 ${column.className || ''}`}>
                                                    {cellContent}
                                                </td>
                                            );
                                        })}
                                    </tr>

                                ))
                            )}
                        </tbody>

                    </table>
                </div>
            </X.Container>
        </div>
    );
}