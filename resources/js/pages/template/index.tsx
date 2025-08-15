import Datatable from '@/components/table/datatable';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import CardLayout from '@/layouts/card-layout';
import { getColumns } from '@/pages/template/columns';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Templates',
        href: route('subjects.index'),
    },
];

export default function TemplatesIndex() {
    const [refresh, setRefresh] = useState<boolean>(false);
    const columns = useMemo(() => getColumns(setRefresh), [setRefresh]);

    const handleResetFilters = () => {
        setRefresh((prev) => !prev);
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Templates" />
            <CardLayout
                title={'Templates'}
                cardAction={
                    <div className="flex items-center gap-2">
                        <Link href={route('templates.create')}>
                            <Button>
                                <Plus />
                                Add New Template
                            </Button>
                        </Link>
                    </div>
                }
            >
                <Datatable
                    refresh={refresh}
                    columns={columns}
                    apiUrl={route('templates.datatable')}
                    skeletonHeight="26px"
                    onClearFilters={handleResetFilters}
                />
            </CardLayout>
        </AppLayout>
    );
}
