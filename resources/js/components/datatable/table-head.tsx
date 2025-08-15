import { PageSize } from '@/components/datatable/page-size';
import { SearchInput } from '@/components/datatable/search-input';

interface TableHeadProps {
    pageSize: number;
    setPageSize: (pageSize: number) => void;
    search: string | null | undefined;
    setSearch: (search: string | null | undefined) => void;
    searchPlaceholder?: string;
    onPageSizeChange?: (pageSize: number) => void;
}

export function TableHead({ pageSize, setPageSize, search, setSearch, searchPlaceholder, onPageSizeChange }: TableHeadProps) {
    return (
        <div className="flex items-center justify-between gap-4">
            <PageSize
                perPage={pageSize}
                onPagSizeChange={(perPage: number) => {
                    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                    onPageSizeChange && onPageSizeChange(perPage);
                    setPageSize(perPage);
                }}
            />
            <SearchInput
                value={search ?? ''}
                onChange={(value: string | null | undefined = '') => {
                    setSearch(value);
                }}
                onClear={() => {
                    setSearch('');
                }}
                placeholder={searchPlaceholder ?? 'Search...'}
            />
        </div>
    );
}
