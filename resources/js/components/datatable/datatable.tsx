import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel, SortingState, useReactTable } from '@tanstack/react-table';

import { DataTablePagination } from '@/components/datatable/pagination';
import { useEffect, useState } from 'react';
import { PaginatedData } from '@/types';

interface DatatableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: PaginatedData<TData>;
    onPageChange: (page: number) => void;
    onSortingChange?: (sorting: SortingState) => void;
}

export default function Datatable<TData, TValue>({ columns, data, onPageChange, onSortingChange }: DatatableProps<TData, TValue>) {
    const [rowSelection, setRowSelection] = useState({});
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const table = useReactTable({
        data: data.data || [],
        columns,
        state: {
            sorting,
            rowSelection,
            columnFilters,
        },
        enableRowSelection: true,
        manualPagination: true,
        manualSorting: true,
        manualFiltering: true,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        pageCount: data.last_page,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
    });

    useEffect(() => {
        if (onSortingChange) {
            onSortingChange(sorting);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sorting]);

    return (
        <div className="space-y-4">
            <div className="flex-1 text-sm">
                {Object.keys(rowSelection).length > 0 && (
                    <div className="my-4 flex items-center justify-between">
                        <div className="text-sm font-medium">
                            {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
                        </div>
                    </div>
                )}
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} colSpan={header.colSpan}>
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination
                table={table}
                currentPage={data.current_page}
                lastPage={data.last_page}
                from={data.from}
                to={data.to}
                total={data.total}
                onPageChange={onPageChange}
            />
        </div>
    );
}
