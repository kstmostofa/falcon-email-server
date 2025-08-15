import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function TableSkeleton({ rows = 3, skeletonHeight }: { rows?: number; skeletonHeight: string }) {
    return (
        <Table>
            <TableHeader className="w-full">
                <TableRow className="w-full">
                    <TableHead className="w-full">
                        <Skeleton className="h-5 w-full" />
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {[...Array(rows)].map((_, i) => (
                    <TableRow key={i}>
                        <TableCell>
                            <Skeleton style={{ height: skeletonHeight }} className="w-full" />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
