import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { pageSizeOptions } from '@/lib/constants';
import { Table } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface DataTablePaginationProps<TData> {
    table: Table<TData>;
    currentPage: number;
    lastPage: number;
    from: number;
    to: number;
    total: number;
    onPageChange: (page: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
}

export function DataTablePagination<TData>({
    currentPage,
    lastPage,
    from,
    to,
    total,
    onPageChange,
    onPageSizeChange,
}: DataTablePaginationProps<TData>) {
    return (
        <div className="flex flex-col items-center justify-between gap-4 px-2 md:flex-row">
            <div className="flex-1 text-sm font-medium">
                Showing {from ?? 0} to {to ?? 0} of {total} results
            </div>
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium">Rows per page:</span>
                    <Select
                        onValueChange={(value) => {
                            const pageSize = parseInt(value, 10);
                            if (onPageSizeChange) {
                                onPageSizeChange(pageSize);
                            }
                            onPageChange(1);
                        }}
                    >
                        <SelectTrigger className="h-8 w-20">
                            <SelectValue placeholder="10" />
                        </SelectTrigger>
                        <SelectContent>
                            {pageSizeOptions?.map((option) => (
                                <SelectItem key={option} value={option.toString()}>
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center justify-center text-sm font-medium">
                    Page {currentPage} of {lastPage}
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" className="flex h-8 w-8 p-0" onClick={() => onPageChange(1)} disabled={currentPage === 1}>
                        <span className="sr-only">Go to first page</span>
                        <ChevronsLeft />
                    </Button>
                    <Button variant="outline" className="h-8 w-8 p-0" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
                        <span className="sr-only">Go to previous page</span>
                        <ChevronLeft />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === lastPage}
                    >
                        <span className="sr-only">Go to next page</span>
                        <ChevronRight />
                    </Button>
                    <Button variant="outline" className="flex h-8 w-8 p-0" onClick={() => onPageChange(lastPage)} disabled={currentPage === lastPage}>
                        <span className="sr-only">Go to last page</span>
                        <ChevronsRight />
                    </Button>
                </div>
            </div>
        </div>
    );
}
