import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { GmailApiTask } from '@/pages/gmail-api-task/columns';
import { router } from '@inertiajs/react';
import { LoaderCircle, Play, Trash } from 'lucide-react';
import { useState } from 'react';

export default function GmailApiTaskTableAction({
    task,
    setRefresh,
}: {
    task: GmailApiTask;
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const [open, setOpen] = useState<boolean>(false);
    const [deleting, setDeleting] = useState<boolean>(false);
    const [start, setStart] = useState<boolean>(false);
    const [starting, setStarting] = useState<boolean>(false);
    const handleDelete = () => {
        alert(task.id)
        setDeleting(true);
        router.delete(route('gmail_api_tasks.destroy', task.id), {
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
            route('gmail_api_tasks.start', task.id),
            {},
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => setRefresh((prev) => !prev),
            },
        );
    };
    return (
        <>
            <div className="flex justify-end gap-2">
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
        </>
    );
}
