import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    onClear?: () => void;
    placeholder?: string;
}

export function SearchInput({ value, onChange, onClear, placeholder }: SearchInputProps) {
    return (
        <div className="relative">
            <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
            <Input
                id="search"
                type="text"
                placeholder={placeholder ?? 'Search...'}
                value={value}
                className="w-full pl-8 md:w-[300px] lg:w-[400px]"
                onChange={(e) => {
                    onChange(e.target.value);
                }}
            />

            {value && (
                <Button size="sm" variant="link" className="absolute top-4.5 right-1 -translate-y-1/2 text-red-500" onClick={onClear}>
                    <X className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
}
