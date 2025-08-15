import InputError from '@/components/input-error';
import Datatable from '@/components/table/datatable';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import CardLayout from '@/layouts/card-layout';
import { getColumns } from '@/pages/provider/columns';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { ChevronsUpDown, LoaderCircle, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { SelectFilter } from '@/components/datatable/select-filter';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Providers',
        href: route('subjects.index'),
    },
];

interface ProviderForm {
    name: string;
    region: string;
    template_id: string;
    template_version: string;
    api_key: string;
    api_secret: string;
}

export default function ProviderIndex({providers}: {  providers: { label: string; value: string }[]; }) {
    const [open, setOpen] = useState<boolean>(false);
    const [refresh, setRefresh] = useState<boolean>(false);

    const { data, setData, post, errors, processing, reset } = useForm<Required<ProviderForm>>({
        name: '',
        region: '',
        template_id: '',
        template_version: '',
        api_key: '',
        api_secret: '',
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('providers.store'), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setOpen(false);
                reset();
                setRefresh((prev) => !prev);
            },
        });
    };

    const columns = useMemo(() => getColumns(setRefresh), [setRefresh]);

    const handleResetFilters = () => {
        setRefresh((prev) => !prev);
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Providers" />
            <CardLayout
                title={'Providers'}
                cardAction={
                    <div className="flex items-center gap-2">
                        <Button onClick={() => setOpen(true)}>
                            <Plus />
                            Add New Provider
                        </Button>
                    </div>
                }
            >
                <Datatable
                    refresh={refresh}
                    columns={columns}
                    apiUrl={route('providers.datatable')}
                    skeletonHeight="26px"
                    onClearFilters={handleResetFilters}
                />
            </CardLayout>

            {/* Add Zone Modal */}
            <Dialog open={open} onOpenChange={setOpen} modal={true}>
                <DialogContent>
                    <DialogTitle>Add New Provider</DialogTitle>
                    <form className="space-y-6" onSubmit={submit}>
                        <div className="grid gap-2">
                            <Label htmlFor="name"> Name</Label>
                            <SelectFilter
                                title="Provider"
                                value={data.name}
                                onChange={(value) => setData('name', value as string)}
                                options={providers}
                                multiple={false}
                                modal={true}
                                icon={ChevronsUpDown}
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="name"> Region</Label>
                            <Input
                                id="name"
                                value={data.region}
                                onChange={(e) => setData('region', e.target.value)}
                                required
                                autoComplete="off"
                                placeholder="Name"
                            />
                            <InputError message={errors.region} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="template_id">Template ID</Label>
                            <Input
                                id="template_id"
                                value={data.template_id}
                                onChange={(e) => setData('template_id', e.target.value)}
                                required
                                autoComplete="off"
                                placeholder="Template ID"
                            />
                            <InputError message={errors.template_id} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="template_version">Template Version</Label>
                            <Input
                                id="template_version"
                                value={data.template_version}
                                onChange={(e) => setData('template_version', e.target.value)}
                                required
                                autoComplete="off"
                                placeholder="Template Version"
                            />
                            <InputError message={errors.template_version} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="api_key">API Key</Label>
                            <Input
                                id="api_key"
                                value={data.api_key}
                                onChange={(e) => setData('api_key', e.target.value)}
                                required
                                autoComplete="off"
                                placeholder="API Key"
                            />
                            <InputError message={errors.api_key} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="api_secret">API Secret</Label>
                            <Input
                                id="api_secret"
                                value={data.api_secret}
                                onChange={(e) => setData('api_secret', e.target.value)}
                                required
                                autoComplete="off"
                                placeholder="API Secret"
                            />
                            <InputError message={errors.api_secret} />
                        </div>



                        <DialogFooter className="gap-2">
                            <DialogClose asChild>
                                <Button variant="secondary" onClick={() => reset()}>
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button disabled={processing}>
                                {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
