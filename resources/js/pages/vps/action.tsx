import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Vps } from '@/pages/vps/columns';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { Binary, LoaderCircle, Play, Trash } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function VpsTableAction({ vps, setRefresh }: { vps: Vps; setRefresh: React.Dispatch<React.SetStateAction<boolean>> }) {
    const [open, setOpen] = useState<boolean>(false);
    const [deleting, setDeleting] = useState<boolean>(false);
    const [start, setStart] = useState<boolean>(false);
    const [starting, setStarting] = useState<boolean>(false);
    const [update, setUpdate] = useState<boolean>(false);
    const [updating, setUpdating] = useState<boolean>(false);

    const handleDelete = () => {
        setDeleting(true);
        router.delete(route('vps.destroy', vps.id), {
            preserveScroll: true,
            preserveState: true,
            onFinish: () => {
                setDeleting(false);
            },
            onSuccess: () => {
                setOpen(false);
                setRefresh((prev) => !prev);
            },
        });
    };

    const handleStart = () => {
        router.post(
            route('tasks.start', vps.id),
            {},
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => setRefresh((prev) => !prev),
            },
        );
    };

    const handleUpdate = () => {
        setUpdating(true);
        axios
            .get(route('vps.update_ip_address', vps.id))
            .then((response) => {
                if (response.data.success) {
                    setUpdating(false);
                    setUpdate(false);
                    setRefresh((prev) => !prev);
                    toast.success('IP address updated successfully');
                } else {
                    console.error('Failed to update IP address:', response.data.message);
                }
            })
            .catch((error) => {
                setUpdating(false);
                setUpdate(false);
                if (error.response && error.response.data) {
                    toast.error(error.response.data.message || 'Failed to update IP address');
                } else {
                    toast.error('Failed to update IP address');
                }
            });
    };
    return (
        <>
            <div className="flex justify-end gap-2">
                <Badge className="sm rounded-md p-1.5 font-normal" onClick={() => setUpdate(true)}>
                    <Binary />
                </Badge>
                <Badge className="sm rounded-md p-1.5 font-normal" onClick={() => setStart(true)}>
                    <Play />
                </Badge>
                <Badge variant="destructive" className="sm rounded-md p-1.5 font-normal" onClick={() => setOpen(true)}>
                    <Trash />
                </Badge>
            </div>

            {/*Delete Confirmation Dialog*/}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogTitle>Delete</DialogTitle>
                    <p>Are you sure you want to delete this Data?</p>
                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button variant="secondary">Cancel</Button>
                        </DialogClose>
                        <Button disabled={deleting} onClick={handleDelete} variant="destructive">
                            {deleting && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            Yes, Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={start} onOpenChange={setStart}>
                <DialogContent>
                    <DialogTitle>Delete</DialogTitle>
                    <p>Are you sure you want to start this Task?</p>
                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button variant="secondary">Cancel</Button>
                        </DialogClose>
                        <Button disabled={starting} onClick={handleStart} variant="destructive">
                            {starting && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            Yes, Start
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={update} onOpenChange={setUpdate}>
                <DialogContent>
                    <DialogTitle>Update IP Address</DialogTitle>
                    <p>Are you sure you want to update ip address?</p>
                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button variant="secondary">Cancel</Button>
                        </DialogClose>
                        <Button disabled={updating} onClick={handleUpdate}>
                            {updating && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            Yes, Update
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
