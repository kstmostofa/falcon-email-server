import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { ColumnDef, flexRender, getCoreRowModel, SortingState, useReactTable } from '@tanstack/react-table';

import { DataTablePagination } from '@/components/datatable/pagination';
import { TableSkeleton } from '@/components/datatable/table-skeleton';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/search-input';
import axios from 'axios';
import { FolderSearch2, RefreshCcw } from 'lucide-react';
import { JSX, useEffect, useState } from 'react';
import { PaginatedData } from '@/types';

interface DatatableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    apiUrl: string;
    dataTableFilters?: JSX.Element;
    skeletonHeight?: string;
    refresh?: boolean;
    filters?: Record<string, unknown>;
    onClearFilters?: () => void;
}

export default function Datatable<TData, TValue>({
    columns,
    apiUrl,
    dataTableFilters,
    skeletonHeight = '26px',
    refresh = false,
    filters,
    onClearFilters,
}: DatatableProps<TData, TValue>) {
    const [loading, setLoading] = useState<boolean>(true);
    const [pageIndex, setPageIndex] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(10);
    const [search, setSearch] = useState<string>('');
    const [data, setData] = useState<PaginatedData<TData>>({
        data: [],
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
        from: 1,
        to: 0,
    });

    //Sorting and filtering states can be added here if needed
    const [rowSelection, setRowSelection] = useState({});
    const [sorting, setSorting] = useState<SortingState>([]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(apiUrl, {
                params: {
                    page: pageIndex + 1,
                    per_page: pageSize || 10,
                    search: search || '',
                    sort: sorting.length > 0 ? sorting[0].id : undefined,
                    order: sorting.length > 0 ? (sorting[0].desc ? 'desc' : 'asc') : undefined,
                    ...filters,
                },
            });
            setData(response?.data);
        } catch (error) {
            console.error('Error fetching table data', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageIndex, pageSize, search, sorting, refresh, JSON.stringify(filters)]);

    const table = useReactTable({
        data: data.data || [],
        columns,
        pageCount: data.last_page,
        state: {
            sorting,
            rowSelection,
        },
        manualPagination: true,
        enableRowSelection: true,
        manualFiltering: true,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        onRowSelectionChange: setRowSelection,
    });

    const handleClearFilters = () => {
        setSearch('');
        setPageIndex(0);
        setPageSize(10);
        setSorting([]);
        if (onClearFilters) {
            onClearFilters();
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
                <SearchInput value={search} onChange={(value) => setSearch(value)} placeholder="Search..." />
                {(search || sorting.length > 0 || Object.keys(filters || {}).some((key) => filters?.[key])) && (
                    <Button variant="destructive" onClick={handleClearFilters}>
                        <RefreshCcw className="mr-2 h-4 w-4" />
                        Reset Filters
                    </Button>
                )}
            </div>

            {dataTableFilters && <div className="my-4">{dataTableFilters}</div>}

            {/* Row selection info */}

            <div className="flex-1 text-sm">
                {Object.keys(rowSelection).length > 0 && (
                    <div className="my-4 flex items-center justify-between">
                        <div className="text-sm font-medium">
                            {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
                        </div>
                    </div>
                )}
            </div>
            <div className="overflow-x-auto rounded-md border">
                {loading && data.total > 0 ? (
                    <TableSkeleton rows={table.getRowModel().rows.length || data.per_page} skeletonHeight={skeletonHeight} />
                ) : (
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id} colSpan={header.colSpan} className="bg-accent">
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
                                    <TableCell colSpan={columns.length} className="text-muted-foreground h-24 text-center font-medium">
                                        <FolderSearch2 className="text-muted-foreground mx-auto mb-2 h-16 w-16" absoluteStrokeWidth={true} />
                                        No data
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
            </div>

            {/* Pagination */}
            <DataTablePagination
                table={table}
                currentPage={data.current_page}
                lastPage={data.last_page}
                from={data.from}
                to={data.to}
                total={data.total}
                onPageChange={(page) => setPageIndex(page - 1)}
                onPageSizeChange={(pageSize) => {
                    setPageSize(pageSize);
                    setPageIndex(0);
                }}
            />
        </div>
    );
}
