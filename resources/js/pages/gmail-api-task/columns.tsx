import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import SMTPTableAction from '@/pages/smtp/action';
import { ColumnDef } from '@tanstack/react-table';
import { ChevronsUpDown } from 'lucide-react';
import TaskTableAction from '@/pages/task/action';
import GmailApiTaskTableAction from '@/pages/gmail-api-task/action';

export interface GmailApiTask {
    id: number;
    name: string;
    bot_count: number;
    region: string;
    smtp_count: number;
    status: string;
    time: number;
}

export const getColumns = (setRefresh: React.Dispatch<React.SetStateAction<boolean>>): ColumnDef<GmailApiTask>[] => {
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
            accessorKey: 'bot_type',
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Bot Type
                    <ChevronsUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <Badge variant="outline" className="font-medium">
                    GMAIL API
                </Badge>
            ),
        },
        {
            accessorKey: 'bot_count',
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    VPS Count
                    <ChevronsUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <Badge variant="outline" className="font-medium">
                    {row.getValue('bot_count')}
                </Badge>
            ),
        },
        {
            accessorKey: 'region',
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    VPS Region
                    <ChevronsUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <Badge variant="outline" className="font-medium">
                    {row.getValue('region')}
                </Badge>
            ),
        },
        {
            accessorKey: 'smtp_count',
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Total SMTP
                    <ChevronsUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <Badge variant="outline" className="font-medium">
                    {row.getValue('smtp_count')}
                </Badge>
            ),
        },
        {
            accessorKey: 'time',
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Time
                    <ChevronsUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <Badge variant="outline" className="font-medium">
                    {row.getValue('time')} Min
                </Badge>
            ),
        },
        {
            accessorKey: 'status',
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Status
                    <ChevronsUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <Badge variant="outline" className="font-medium">
                    {row.getValue('status')}
                </Badge>
            ),
        },
        {
            id: 'actions',
            enableHiding: false,
            cell: ({ row }) => <GmailApiTaskTableAction task={row.original} setRefresh={setRefresh} />,
        },
    ];
};
