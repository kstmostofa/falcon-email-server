import { SelectFilter } from '@/components/datatable/select-filter';
import InputError from '@/components/input-error';
import Datatable from '@/components/table/datatable';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import CardLayout from '@/layouts/card-layout';
import { getColumns } from '@/pages/task/columns';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import axios from 'axios';
import { ChevronsUpDown, LoaderCircle, Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tasks',
        href: route('tasks.index'),
    },
];

interface TaskForm {
    name: string;
    bot_type: string;
    contact_id: string;
    sender_name_id: string;
    subject_id: string;
    template_id: string;
    attachment_id: string;
    smtp_id: string;
    smtp_limit: number;
    time: number;
    bot_count: number;
    thread_count: number;
    region: string;
    contact_count: number;
    thread_capacity?: number;
    smtp_count?: number;
    smtp_per_bot?: number;
    contact_per_bot?: number;
    provider_id: string;
}

export default function SMTPIndex({
    botTypes,
    regions,
}: {
    botTypes: { label: string; value: string }[];
    regions: { label: string; value: string }[];
}) {
    const [open, setOpen] = useState<boolean>(false);
    const [refresh, setRefresh] = useState<boolean>(false);

    const { data, setData, post, errors, processing, reset } = useForm<Required<TaskForm>>({
        name: '',
        bot_type: '',
        contact_id: '',
        sender_name_id: '',
        subject_id: '',
        template_id: '',
        attachment_id: '',
        smtp_id: '',
        smtp_limit: 0,
        time: 0,
        bot_count: 0,
        thread_count: 0,
        region: '',
        contact_count: 0,
        thread_capacity: 12,
        smtp_count: 0,
        smtp_per_bot: 0,
        contact_per_bot: 0,
        provider_id: '',
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        console.log('Submitting form with data:', data);
        e.preventDefault();
        post(route('tasks.store'), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                console.log('Form submitted successfully:', data);
                setOpen(false);
                reset();
                setRefresh((prev) => !prev);
            },
            onError: (errors) => {
                console.error('Form submission error:', errors);
            },
            onFinish: () => {
                console.log('Form submission finished');
            }
        });
    };

    const columns = useMemo(() => getColumns(setRefresh), [setRefresh]);

    const handleResetFilters = () => {
        setRefresh((prev) => !prev);
    };

    useEffect(() => {
        const thread = getBotThread(data.bot_type);
        setData((prevData) => ({
            ...prevData,
            thread_count: thread,
        }));
    }, [data.bot_type]);

    useEffect(() => {
        if (data.contact_id) {
            getContactCount(data.contact_id);
        }
    }, [data.contact_id]);

    const getContactCount = async (contactId: string) => {
        try {
            const { data } = await axios.get(route('get_contact_count', { contact_id: contactId }));
            if (data.count !== undefined) {
                setData((prevData) => ({
                    ...prevData,
                    contact_count: data.count,
                }));
            }
        } catch (error) {
            console.error('Error fetching contact count:', error);
        }
    };
    const getBotThread = (botType: string) => {
        switch (botType) {
            case 'GMAIL_API':
                return 5;
            case 'GMAIL_API_OAUTH':
                return 1;
            case 'GMAIL_COMPOSE':
                return 1;
            case 'SMTP_MAILER':
                return 5;
            default:
                return 1;
        }
    };

    const calculateThreadCount = (contact_count: number, time: number, smtpLimit: number, thread_count: number, thread_capacity: number) => {
        const emailsPerMinutePerBot = thread_count * thread_capacity;
        const emailsPerBot = emailsPerMinutePerBot * time;
        const bot_count = Math.ceil(contact_count / emailsPerBot);
        const smtp_per_bot = Math.ceil(emailsPerBot / smtpLimit);
        const smtp_count = Math.ceil(bot_count * smtp_per_bot);
        setData('bot_count', bot_count);
        setData('smtp_count', smtp_count);
        setData('smtp_per_bot', smtp_per_bot);
        setData('thread_capacity', thread_capacity);
        setData('contact_per_bot', Math.ceil(contact_count / bot_count));
        setData('contact_count', contact_count);
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tasks" />
            <CardLayout
                title={'Tasks'}
                cardAction={
                    <div className="flex items-center gap-2">
                        <Button onClick={() => setOpen(true)}>
                            <Plus />
                            Add New Task
                        </Button>
                    </div>
                }
            >
                <Datatable
                    refresh={refresh}
                    columns={columns}
                    apiUrl={route('tasks.datatable')}
                    skeletonHeight="26px"
                    onClearFilters={handleResetFilters}
                />
            </CardLayout>

            {/* Add Zone Modal */}
            <Dialog open={open} onOpenChange={setOpen} modal={true}>
                <DialogContent className="min-w-7xl">
                    <DialogTitle>Add New Task</DialogTitle>
                    <form className="space-y-6" onSubmit={submit}>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
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
                                <Label htmlFor="name">Bot Type</Label>
                                <SelectFilter
                                    title={'Bot Type'}
                                    options={botTypes}
                                    value={data.bot_type}
                                    onChange={(value) => setData('bot_type', value as string)}
                                    multiple={false}
                                    icon={ChevronsUpDown}
                                    modal={true}
                                />
                                <InputError message={errors.bot_type} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="name">Select Contact</Label>
                                <SelectFilter
                                    title={'Select Contact'}
                                    apiEndpoint={route('get_contact', { bot_type: data.bot_type })}
                                    value={data.contact_id}
                                    onChange={(value) => setData('contact_id', value as string)}
                                    multiple={false}
                                    icon={ChevronsUpDown}
                                    modal={true}
                                />
                                <InputError message={errors.contact_id} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="name">Select Sender Name</Label>
                                <SelectFilter
                                    title={'Select Sender Name'}
                                    apiEndpoint={route('get_sender_name')}
                                    value={data.sender_name_id}
                                    onChange={(value) => setData('sender_name_id', value as string)}
                                    multiple={false}
                                    icon={ChevronsUpDown}
                                    modal={true}
                                />
                                <InputError message={errors.sender_name_id} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="name">Select Subject</Label>
                                <SelectFilter
                                    title={'Select Subject'}
                                    apiEndpoint={route('get_subject')}
                                    value={data.subject_id}
                                    onChange={(value) => setData('subject_id', value as string)}
                                    multiple={false}
                                    icon={ChevronsUpDown}
                                    modal={true}
                                />
                                <InputError message={errors.subject_id} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="name">Select Template</Label>
                                <SelectFilter
                                    title={'Select Template'}
                                    apiEndpoint={route('get_template')}
                                    value={data.template_id}
                                    onChange={(value) => setData('template_id', value as string)}
                                    multiple={false}
                                    icon={ChevronsUpDown}
                                    modal={true}
                                />
                                <InputError message={errors.template_id} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="name">Select Attachment</Label>
                                <SelectFilter
                                    title={'Select Attachment'}
                                    apiEndpoint={route('get_attachment')}
                                    value={data.attachment_id}
                                    onChange={(value) => setData('attachment_id', value as string)}
                                    multiple={false}
                                    icon={ChevronsUpDown}
                                    modal={true}
                                />
                                <InputError message={errors.attachment_id} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="name">Select SMTP</Label>
                                <SelectFilter
                                    title={'Select SMTP'}
                                    apiEndpoint={route('get_smtp', { bot_type: data.bot_type })}
                                    value={data.smtp_id}
                                    onChange={(value) => setData('smtp_id', value as string)}
                                    multiple={false}
                                    icon={ChevronsUpDown}
                                    modal={true}
                                />
                                <InputError message={errors.smtp_id} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="name">Server Provider</Label>
                                <SelectFilter
                                    title={'Server Provider'}
                                    apiEndpoint={route('get_provider')}
                                    value={data.provider_id}
                                    onChange={(value) => setData('provider_id', value as string)}
                                    multiple={false}
                                    icon={ChevronsUpDown}
                                    modal={true}
                                />
                                <InputError message={errors.region} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Server Region</Label>
                                <SelectFilter
                                    title={'Server Region'}
                                    apiEndpoint={route('get_region', { provider_id: data.provider_id })}
                                    value={data.region}
                                    onChange={(value) => setData('region', value as string)}
                                    multiple={false}
                                    icon={ChevronsUpDown}
                                    modal={true}
                                />
                                <InputError message={errors.region} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="name">SMTP Limit</Label>
                                <Input
                                    id="name"
                                    type="number"
                                    value={data.smtp_limit}
                                    onChange={(e) => setData('smtp_limit', Number(e.target.value))}
                                    required
                                    autoComplete="off"
                                    placeholder="SMTP Limit"
                                />
                                <InputError message={errors.smtp_limit} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="name">Time (In Minutes)</Label>
                                <Input
                                    id="name"
                                    type="number"
                                    value={data.time}
                                    onChange={(e) => setData('time', Number(e.target.value))}
                                    required
                                    autoComplete="off"
                                    placeholder="SMTP Limit"
                                />
                                <InputError message={errors.time} />
                            </div>
                        </div>

                        <Button type="button" className="w-full cursor-pointer" variant="secondary" onClick={() => {
                            calculateThreadCount(
                                data.contact_count,
                                data.time,
                                data.smtp_limit,
                                data.thread_count,
                                data.thread_capacity || 12
                            );
                        }}>
                            Calculate
                        </Button>

                        <div className="border p-4 rounded-lg">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Total Contact</Label>
                                    <Input
                                        id="name"
                                        type="number"
                                        value={data.contact_count}
                                        onChange={(e) => setData('contact_count', Number(e.target.value))}
                                        readOnly
                                    />
                                    <InputError message={errors.contact_count} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="name">Total Bot / VPS</Label>
                                    <Input
                                        id="name"
                                        type="number"
                                        value={data.bot_count}
                                        onChange={(e) => setData('bot_count', Number(e.target.value))}
                                        readOnly
                                        placeholder="Bot Count"
                                    />
                                    <InputError message={errors.bot_count} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Thread Count</Label>
                                    <Input
                                        id="name"
                                        type="number"
                                        value={data.thread_count}
                                        onChange={(e) => setData('thread_count', Number(e.target.value))}
                                        readOnly
                                        placeholder="Thread Count"
                                    />
                                    <InputError message={errors.bot_count} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Thread Capacity</Label>
                                    <Input
                                        id="name"
                                        type="number"
                                        value={data.thread_capacity}
                                        readOnly
                                        placeholder="Thread Capacity"
                                    />
                                    <InputError message={errors.thread_capacity} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="name">SMTP Per Bot</Label>
                                    <Input
                                        id="name"
                                        type="number"
                                        value={data.smtp_per_bot}
                                        onChange={(e) => setData('smtp_per_bot', Number(e.target.value))}
                                        readOnly
                                        placeholder="SMTP Per Bot"
                                    />
                                    <InputError message={errors.smtp_per_bot} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Total SMTP</Label>
                                    <Input
                                        id="name"
                                        type="number"
                                        value={data.smtp_count}
                                        onChange={(e) => setData('smtp_count', Number(e.target.value))}
                                        readOnly
                                        placeholder="Total SMTP"
                                    />
                                    <InputError message={errors.smtp_count} />
                                </div>
                            </div>
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
