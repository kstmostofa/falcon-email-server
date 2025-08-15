import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { router } from '@inertiajs/react';
import { LoaderCircle, Trash } from 'lucide-react';
import { useState } from 'react';
import { Contact } from '@/pages/contact/columns';

export default function ContactTableAction({ contact, setRefresh }: { contact: Contact; setRefresh: React.Dispatch<React.SetStateAction<boolean>> }) {
    const [open, setOpen] = useState<boolean>(false);
    const [deleting, setDeleting] = useState<boolean>(false);

    const handleDelete = () => {
        setDeleting(true);
        router.delete(route('contacts.destroy', contact.id), {
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
    return (
        <>
            <div className="flex justify-end gap-2">
                <Badge variant="destructive" className="sm rounded-md p-1.5 font-normal" onClick={() => setOpen(true)}>
                    <Trash />
                </Badge>
            </div>

            {/*Delete Confirmation Dialog*/}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogTitle>Delete Contact</DialogTitle>
                    <p>Are you sure you want to delete this Contact?</p>
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
        </>
    );
}
