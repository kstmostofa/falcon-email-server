import { Check, ChevronsUpDown, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface ComboboxProps {
    apiEndpoint: string;
    multiple?: boolean;
    disabled?: boolean;
    onChange?: (value: string | string[]) => void;
    placeholder?: string;
    value?: string | string[];
    modal?: boolean;
}

interface SelectItem {
    value: string;
    label: string;
}

export function Combobox({ apiEndpoint, multiple = false, disabled = false, onChange, placeholder, value, modal = false }: ComboboxProps) {
    const [open, setOpen] = useState(false);
    const [data, setData] = useState<SelectItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    // const [internalValue, setInternalValue] = useState<string | string[]>(multiple ? [] : '');
    // const actualValue = value !== undefined ? value : internalValue;

    const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const fetchData = async (query: string) => {
        if (!apiEndpoint || apiEndpoint.trim() === '') {
            setData([]);
            return;
        }
        setLoading(true);
        try {
            const url = new URL(apiEndpoint);
            if (query) url.searchParams.set('search', query);
            const response = await fetch(url.toString());
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error('Failed to fetch data:', error, 'from', URL);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData('');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiEndpoint]);

    const handleSearchChange = (val: string) => {
        setSearch(val);

        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        debounceTimeoutRef.current = setTimeout(() => {
            fetchData(val);
        }, 300);
    };

    const handleSetValue = (selected: string) => {
        if (multiple) {
            const current = value as string[];
            const newValue = current.includes(selected) ? current.filter((v) => v !== selected) : [...current, selected];
            // if (!value) setInternalValue(newValue);
            onChange?.(newValue);
        } else {
            const newValue = selected === value ? '' : selected;
            // if (!value) setInternalValue(newValue);
            onChange?.(newValue);
            setOpen(false);
        }
    };

    const selectedLabels = useMemo(() => {
        if (multiple) {
            const selected = value as string[];
            return data.filter((d) => selected.includes(d.value));
        } else {
            const selected = data.find((d) => d.value === value);
            return selected ? [selected] : [];
        }
    }, [data, value, multiple]);

    const onReset = () => {
        if (multiple) {
            // setInternalValue([]);
            onChange?.([]);
        } else {
            // setInternalValue('');
            onChange?.('');
        }
        setOpen(false);
    };

    return (
        <Popover open={open && !disabled} onOpenChange={setOpen} modal={modal}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} disabled={disabled || loading} className="w-[480px] justify-between">
                    <div className="flex gap-2">
                        {selectedLabels.length > 0 ? (
                            <>
                                {multiple ? (
                                    <>
                                        {selectedLabels.slice(0, 2).map((item) => (
                                            <Badge key={item.value} className="rounded-sm px-1 font-medium" variant="secondary">
                                                {item.label}
                                            </Badge>
                                        ))}
                                        {selectedLabels.length > 2 && (
                                            <Badge className="rounded-sm px-1 font-medium" variant="outline">
                                                +{selectedLabels.length - 2} more selected
                                            </Badge>
                                        )}
                                    </>
                                ) : (
                                    <Badge className="rounded-sm px-1 font-medium" variant="secondary">
                                        {selectedLabels[0].label}
                                    </Badge>
                                )}
                            </>
                        ) : multiple ? (
                            placeholder || 'Select options'
                        ) : (
                            placeholder || 'Select an option'
                        )}
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[480px] overflow-visible p-0">
                <Command className="overflow-y-auto">
                    <CommandInput placeholder="Search..." value={search} onValueChange={handleSearchChange} disabled={disabled || loading} />
                    <CommandEmpty>{loading ? 'Loading...' : 'No data found.'}</CommandEmpty>
                    <CommandGroup>
                        <CommandList className="max-h-[300px] overflow-x-hidden overflow-y-auto">
                            {data.map((item) => {
                                const isSelected = multiple ? (value as string[]).includes(item.value) : value === item.value;

                                return (
                                    <CommandItem key={item.value} value={item.value} onSelect={() => handleSetValue(item.value)} disabled={disabled}>
                                        <Check className={cn('mr-2 h-4 w-4', isSelected ? 'opacity-100' : 'opacity-0')} />
                                        {item.label}
                                    </CommandItem>
                                );
                            })}
                        </CommandList>
                    </CommandGroup>
                    {selectedLabels.length > 0 && (
                        <>
                            <CommandSeparator />
                            <CommandGroup>
                                <CommandItem onSelect={onReset} className="justify-center text-center font-medium">
                                    <X className="text-red-500" />
                                    Clear Selection
                                </CommandItem>
                            </CommandGroup>
                        </>
                    )}
                </Command>
            </PopoverContent>
        </Popover>
    );
}
