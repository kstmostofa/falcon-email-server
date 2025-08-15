import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import SendernameTableAction from '@/pages/sender_name/action';
import { ColumnDef } from '@tanstack/react-table';
import { ChevronsUpDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface SenderName {
    id: number;
    name: string;
    count: number;
}

export const getColumns = (setRefresh: React.Dispatch<React.SetStateAction<boolean>>): ColumnDef<SenderName>[] => {
    return [
        {
            id: 'select',
            enableResizing: true,
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                    className="translate-y-[2px]"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                    className="translate-y-[2px]"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: 'name',
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Name
                    <ChevronsUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
        },
        {
            accessorKey: 'count',
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Total
                    <ChevronsUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => <Badge variant="outline" className="font-medium">{row.getValue('count')}</Badge>,
        },
        {
            id: 'actions',
            enableHiding: false,
            cell: ({ row }) => <SendernameTableAction sender_name={row.original} setRefresh={setRefresh} />,
        },
    ];
};
