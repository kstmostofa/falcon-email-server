import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import VpsTableAction from '@/pages/vps/action';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import axios from 'axios';
import { ChevronsUpDown } from 'lucide-react';
import { toast } from 'sonner';

export interface Vps {
    id: number;
    provider: Provider;
    task?: Task;
    gmail_api_task?: GmailApiTask;
    instance_id: string;
    region: string;
    bot_type: string;
    ip_address: string;
    status: string;
    last_heartbeat: string;
}

interface Provider {
    id: number;
    name: string;
}

interface Task {
    id: number;
    name: string;
}

interface GmailApiTask {
    id: number;
    name: string;
}

export const getColumns = (setRefresh: React.Dispatch<React.SetStateAction<boolean>>): ColumnDef<Vps>[] => {
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
            accessorKey: 'instance_id',
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Instance ID
                    <ChevronsUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <Badge variant="outline" className="font-medium">
                    {row.getValue('instance_id')}
                </Badge>
            ),
        },
        {
            accessorKey: 'provider.name',
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Provider
                    <ChevronsUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <Badge variant="outline" className="font-medium capitalize">
                    {row.original.provider.name}
                </Badge>
            ),
        },
        {
            accessorKey: 'task.name',
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Task
                    <ChevronsUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <Badge variant="outline" className="font-medium capitalize">
                    {row.original.task ? row.original.task?.name : row.original.gmail_api_task?.name}
                </Badge>
            ),
        },
        {
            accessorKey: 'ip_address',
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    IP Address
                    <ChevronsUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => {
                return row.original.ip_address ? (
                    <Badge variant="outline" className="font-medium">
                        {row.getValue('ip_address')}
                    </Badge>
                ) : (
                    <Badge variant="outline" className="font-medium">
                        N/A
                    </Badge>
                );
            },
        },
        {
            accessorKey: 'region',
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Region
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
            accessorKey: 'bot_type',
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Total Contacts
                    <ChevronsUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <Badge variant="outline" className="font-medium">
                    {row.getValue('bot_type')}
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
            accessorKey: 'last_heartbeat',
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Last Heartbeat
                    <ChevronsUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <Badge variant="outline" className="font-medium">
                    {row.getValue('last_heartbeat') ? new Date(row.getValue('last_heartbeat')).toLocaleString() : 'N/A'}
                </Badge>
            ),
        },
        {
            id: 'actions',
            enableHiding: false,
            cell: ({ row }) => <VpsTableAction vps={row.original} setRefresh={setRefresh} />,
        },
    ];
};
