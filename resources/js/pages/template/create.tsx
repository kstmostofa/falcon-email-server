import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';

import { SelectFilter } from '@/components/datatable/select-filter';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import CardLayout from '@/layouts/card-layout';
import { type BreadcrumbItem } from '@/types';
import { ChevronsUpDown, LoaderCircle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create Template',
        href: route('templates.create'),
    },
];

export type TemplateForm = {
    name: string;
    file: File | null;
    content_type: string;
    templates: string[];
};

export default function CreateTemplate({ templateTypes }: { templateTypes: { label: string; value: string }[] }) {
    const { data, setData, post, errors, processing, reset } = useForm<Required<TemplateForm>>({
        name: '',
        file: null,
        content_type: '',
        templates: [],
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('templates.store'), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => reset(),
        });
    };
    console.log('errors', errors);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Template" />
            <CardLayout title="Create Template" description="Create a new template by filling out the form below.">
                <form onSubmit={submit}>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Name Input */}
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                autoComplete="off"
                                placeholder="Name"
                                required
                            />
                            <InputError message={errors.name} />
                        </div>

                        {/* Template Type Select */}
                        <div className="grid gap-2">
                            <Label htmlFor="template_type">Template Type</Label>
                            <SelectFilter
                                title="Select Template Type"
                                options={templateTypes}
                                value={data.content_type}
                                onChange={(value) => setData('content_type', value as string)}
                                icon={ChevronsUpDown}
                                multiple={false}
                            />
                            <InputError message={errors.content_type} />
                        </div>

                        {/* File Upload – only show if NOT PLAIN_TEXT */}
                        {data.content_type === 'PLAIN_TEXT' && (
                            <div className="grid gap-2">
                                <Label htmlFor="file">File</Label>
                                <Input id="file" type="file" onChange={(e) => setData('file', e.target.files ? e.target.files[0] : null)} required />
                                <InputError message={errors.file} />
                            </div>
                        )}
                    </div>

                    {/* Textarea for templates – only show if PLAIN_TEXT */}
                    {data.content_type === 'HTML' && (
                        <div className="mt-4 grid gap-4">
                            <Label>Templates</Label>

                            {data.templates.map((template, index) => {
                                const errorKey = `templates.${index}`;
                                return (
                                    <>
                                        <div key={index} className="flex items-start gap-2">
                                            <Textarea
                                                className="flex-1"
                                                value={template}
                                                onChange={(e) => {
                                                    const updated = [...data.templates];
                                                    updated[index] = e.target.value;
                                                    setData('templates', updated);
                                                }}
                                                placeholder={`Template ${index + 1}`}
                                                required
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                onClick={() => {
                                                    const updated = [...data.templates];
                                                    updated.splice(index, 1);
                                                    setData('templates', updated);
                                                }}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                        <InputError message={errors[errorKey as keyof typeof errors]} />
                                    </>
                                );
                            })}

                            <Button type="button" variant="secondary" onClick={() => setData('templates', [...data.templates, ''])}>
                                + Add More
                            </Button>
                        </div>
                    )}

                    {/* Submit Button */}
                    <Button disabled={processing} type="submit" className="mt-6">
                        {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                        {processing ? 'Creating...' : 'Create Template'}
                    </Button>
                </form>
            </CardLayout>
        </AppLayout>
    );
}
