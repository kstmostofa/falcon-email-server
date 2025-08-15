import InputError from '@/components/input-error';
import Datatable from '@/components/table/datatable';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import CardLayout from '@/layouts/card-layout';
import { getColumns } from '@/pages/attachment/columns';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Plus, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Attachments',
        href: route('attachments.index'),
    },
];

interface SenderNameForm {
    name: string;
    file: File[];
}

export default function AttachmentIndex() {
    const [open, setOpen] = useState<boolean>(false);
    const [refresh, setRefresh] = useState<boolean>(false);

    const { data, setData, post, errors, processing, reset } = useForm<Required<SenderNameForm>>({
        name: '',
        file: [],
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('attachments.store'), {
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
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        setData('file', files);
    };

    const handleRemoveFile = (indexToRemove: number) => {
        const updatedFiles = data.file.filter((_, index) => index !== indexToRemove);
        setData('file', updatedFiles);
    };
    const handleResetFilters = () => {
        setRefresh((prev) => !prev);
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Attachments" />
            <CardLayout
                title={'Attachments'}
                cardAction={
                    <div className="flex items-center gap-2">
                        <Button onClick={() => setOpen(true)}>
                            <Plus />
                            Add New Attachment
                        </Button>
                    </div>
                }
            >
                <Datatable
                    refresh={refresh}
                    columns={columns}
                    apiUrl={route('attachments.datatable')}
                    skeletonHeight="26px"
                    onClearFilters={handleResetFilters}
                />
            </CardLayout>

            {/* Add Zone Modal */}
            <Dialog open={open} onOpenChange={setOpen} modal={true}>
                <DialogContent>
                    <DialogTitle>Add New Attachment</DialogTitle>
                    <form className="space-y-6" onSubmit={submit}>
                        <div className="grid gap-2">
                            <Label htmlFor="name"> Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                autoComplete="off"
                                placeholder="Name"
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="name">Select File</Label>
                            <Input
                                id="file"
                                type="file"
                                multiple
                                onChange={handleFileChange}
                                accept=".image/*, .pdf, .doc, .docx, .txt"
                                required
                            />
                            <InputError message={errors.file} />
                            {errors.file && <div className="text-red-500 text-sm">{errors.file}</div>}
                            {data.file.length > 0 && (
                                <ul className="mt-2 text-sm text-gray-700">
                                    {data.file.map((file, index) => (
                                        <li key={index} className="flex items-center justify-between border rounded p-2 my-1">
                                            <span>{file.name}</span>
                                            <Badge
                                                variant="destructive"
                                                onClick={() => handleRemoveFile(index)}
                                            >
                                                <X className="w-4 h-4" />
                                            </Badge>
                                        </li>
                                    ))}
                                </ul>
                            )}
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
