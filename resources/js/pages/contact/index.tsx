import InputError from '@/components/input-error';
import Datatable from '@/components/table/datatable';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import CardLayout from '@/layouts/card-layout';
import { getColumns } from '@/pages/contact/columns';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { ChevronsUpDown, LoaderCircle, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { SelectFilter } from '@/components/datatable/select-filter';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Contacts',
        href: route('contacts.index')
    }
];

interface ContactForm {
    contact_name: string;
    bot_type: string;
    file: File | null;
}

interface BotType {
    label: string;
    value: string;
}

export default function ContactIndex({ botTypes }: { botTypes: BotType[] }) {
    const [open, setOpen] = useState<boolean>(false);
    const [refresh, setRefresh] = useState<boolean>(false);

    const { data, setData, post, errors, processing, reset } = useForm<Required<ContactForm>>({
        contact_name: '',
        bot_type: '',
        file: null
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('contacts.store'), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setOpen(false);
                reset();
                setRefresh((prev) => !prev);
            }
        });
    };

    const columns = useMemo(() => getColumns(setRefresh), [setRefresh]);

    const handleResetFilters = () => {
        setRefresh((prev) => !prev);
    };
    console.log(botTypes)
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Contacts" />
            <CardLayout
                title={'Contacts'}
                cardAction={
                    <div className="flex items-center gap-2">
                        <Button onClick={() => setOpen(true)}>
                            <Plus />
                            Add New Contact
                        </Button>
                    </div>
                }
            >
                <Datatable
                    refresh={refresh}
                    columns={columns}
                    apiUrl={route('contacts.datatable')}
                    skeletonHeight="26px"
                    onClearFilters={handleResetFilters}
                />
            </CardLayout>

            {/* Add Zone Modal */}
            <Dialog open={open} onOpenChange={setOpen} modal={true}>
                <DialogContent>
                    <DialogTitle>Add New Contact</DialogTitle>
                    <form className="space-y-6" onSubmit={submit}>
                        <div className="grid gap-2">
                            <Label htmlFor="name">Contact Name</Label>
                            <Input
                                id="name"
                                value={data.contact_name}
                                onChange={(e) => setData('contact_name', e.target.value)}
                                required
                                autoComplete="off"
                                placeholder="Contact name"
                            />
                            <InputError message={errors.contact_name} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="name">Contact Name</Label>
                            <SelectFilter
                                title={'Bot Type'}
                                options={botTypes}
                                value={data.bot_type}
                                onChange={(value) => setData('bot_type', value as string)}
                                multiple={false}
                                icon={ChevronsUpDown}
                                modal={true}
                            />
                            <InputError message={errors.contact_name} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="name">Select File</Label>
                            <Input
                                id="file"
                                type="file"
                                onChange={(e) => setData('file', e.target.files ? e.target.files[0] : null)}
                                accept=".csv"
                                required
                                placeholder="Upload file"
                            />

                            <InputError message={errors.file} />
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
