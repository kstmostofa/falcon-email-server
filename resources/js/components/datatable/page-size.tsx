import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { pageSizeOptions } from '@/lib/constants';

interface PageSizeProps {
    perPage: number;
    onPagSizeChange: (value: number) => void;
}

export function PageSize({ perPage, onPagSizeChange }: PageSizeProps) {
    return (
        <Select value={perPage.toString()} onValueChange={(value) => onPagSizeChange(Number(value))}>
            <SelectTrigger className="w-[70px]">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {pageSizeOptions.map((value) => (
                    <SelectItem key={value} value={value.toString()}>
                        {value}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
