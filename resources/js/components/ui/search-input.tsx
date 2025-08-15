import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SearchInputProps {
    onChange: (value: string) => void;
    placeholder?: string;
    value: string;
}

export function SearchInput({ onChange, placeholder,value='' }: SearchInputProps) {
    const [searchValue, setSearchValue] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            onChange(searchValue);
        }, 300);

        return () => clearTimeout(timer);

    }, [searchValue, onChange]);


    const handleClear = () => {
        setSearchValue('');
        onChange('');
    };

    useEffect(() => {
        setSearchValue(value);
        onChange(value);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    return (
        <div className="relative w-full md:w-[300px] lg:w-[400px]">
            <Search className="text-muted-foreground absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2" />
            <Input
                id="search"
                type="text"
                placeholder={placeholder ?? 'Search...'}
                value={searchValue}
                className="pl-8 w-full"
                onChange={(e) => setSearchValue(e.target.value)}
            />
            {searchValue && (
                <Button
                    variant="link"
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-red-500 hover:text-red-500 cursor-pointer"
                    onClick={handleClear}
                    aria-label="Clear search"
                >
                    <X className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
}
