import { SelectFilter } from '@/components/datatable/select-filter';
import InputError from '@/components/input-error';
import Datatable from '@/components/table/datatable';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import CardLayout from '@/layouts/card-layout';
import { getColumns } from '@/pages/gmail-api-task/columns';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import axios from 'axios';
import { ChevronsUpDown, LoaderCircle, Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Gmail API Tasks',
        href: route('gmail_api_tasks.index'),
    },
];

interface GmailApiTaskForm {
    smtp_id: string;
    provider_id: string;
    name: string;
    region: string;
    time: number;
    smtp_count: number;
    smtp_per_bot: number;
    bot_count: number;
    vps_template_id: string;
    vps_template_version: string;
    bot_speed: number; // Default bot speed
}

export default function GmailApiTaskIndex() {
    const [open, setOpen] = useState<boolean>(false);
    const [refresh, setRefresh] = useState<boolean>(false);

    const { data, setData, post, errors, processing, reset } = useForm<Required<GmailApiTaskForm>>({
        smtp_id: '',
        provider_id: '',
        name: '',
        region: '',
        time: 0,
        smtp_count: 0,
        smtp_per_bot: 0,
        bot_count: 0,
        vps_template_id: '',
        vps_template_version: '',
        bot_speed: 2, // Default bot speed
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('gmail_api_tasks.store'), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
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
        if (data.smtp_id) {
            getSmtpCountCount(data.smtp_id);
        }
    }, [data.smtp_id]);

    const getSmtpCountCount = async (smtpId: string) => {
        try {
            const { data } = await axios.get(route('get_smtp_count', { smtp_id: smtpId }));
            if (data.count !== undefined) {
                setData((prevData) => ({
                    ...prevData,
                    smtp_count: data.count,
                }));
            }
        } catch (error) {
            console.error('Error fetching contact count:', error);
        }
    };


    const calculate = (smtpCount: number, time: number, botSpeed: number = 2 ) => {
        const accountsPerMinute = Math.floor(smtpCount / time);
        const totalBots = Math.ceil(accountsPerMinute / botSpeed);
        const smtpPerBot = Math.ceil(smtpCount / totalBots);
        setData((prevData) => ({
            ...prevData,
            smtp_count: smtpCount,
            bot_count: totalBots,
            smtp_per_bot: smtpPerBot,
        }));
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gmail API Tasks" />
            <CardLayout
                title={'Gmail API Tasks'}
                cardAction={
                    <div className="flex items-center gap-2">
                        <Button onClick={() => setOpen(true)}>
                            <Plus />
                            Add New Gmail API Task
                        </Button>
                    </div>
                }
            >
                <Datatable
                    refresh={refresh}
                    columns={columns}
                    apiUrl={route('gmail_api_tasks.datatable')}
                    skeletonHeight="26px"
                    onClearFilters={handleResetFilters}
                />
            </CardLayout>

            {/* Add Zone Modal */}
            <Dialog open={open} onOpenChange={setOpen} modal={true}>
                <DialogContent className="min-w-7xl">
                    <DialogTitle>Add New Gmail API Task</DialogTitle>
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
                                <Label htmlFor="name">Select SMTP</Label>
                                <SelectFilter
                                    title={'Select SMTP'}
                                    apiEndpoint={route('get_smtp', { bot_type: 'GMAIL_API_OAUTH' })}
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
                            calculate(
                                data.smtp_count,
                                data.time,
                                2
                            );
                        }}>
                            Calculate
                        </Button>

                        <div className="border p-4 rounded-lg">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Total SMTP</Label>
                                    <Input
                                        id="name"
                                        type="number"
                                        value={data.smtp_count}
                                        onChange={(e) => setData('smtp_count', Number(e.target.value))}
                                        readOnly
                                    />
                                    <InputError message={errors.smtp_count} />
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
