import Datatable from '@/components/table/datatable';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import CardLayout from '@/layouts/card-layout';
import { getColumns } from '@/pages/vps/columns';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Binary, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Vps',
        href: route('tasks.index'),
    },
];

export default function VpsIndex() {
    const [refresh, setRefresh] = useState<boolean>(false);

    const handleResetFilters = () => {
        setRefresh((prev) => !prev);
    };
    const columns = useMemo(() => getColumns(setRefresh), [setRefresh]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Vps" />
            <CardLayout
                title={'Vps'}
                cardAction={
                    <div className="flex items-center gap-2">
                        <Link href={route('update_all_vps_ip_address')}>
                            <Button>
                                <Binary />
                               Update All Vps IP Address
                            </Button>
                        </Link>
                    </div>
                }
            >
                <Datatable
                    refresh={refresh}
                    columns={columns}
                    apiUrl={route('vps.datatable')}
                    skeletonHeight="26px"
                    onClearFilters={handleResetFilters}
                />
            </CardLayout>
        </AppLayout>
    );
}
