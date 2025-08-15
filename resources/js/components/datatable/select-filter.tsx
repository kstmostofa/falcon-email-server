import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, LucideIcon, PlusCircle, X } from 'lucide-react';
import * as React from 'react';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Option {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
}

interface SelectFilterProps {
    title?: string;
    options?: Option[];
    apiEndpoint?: string;
    multiple?: boolean;
    onChange?: (value: string | string[]) => void;
    value?: string | string[] | number[];
    disabled?: boolean;
    icon?: LucideIcon | null;
    modal?: boolean;
}

export function SelectFilter({
    title = 'Select Filter',
    options = [],
    apiEndpoint,
    multiple = false,
    onChange,
    value,
    disabled = false,
    icon = null,
    modal = false,
}: SelectFilterProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [data, setData] = useState<Option[]>(options);
    const [internalValue, setInternalValue] = useState<string | string[]>(multiple ? [] : '');
    const actualValue = value !== undefined ? value : internalValue;

    const debounceTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    const fetchData = async (query: string) => {
        if (!apiEndpoint) return;
        setLoading(true);
        try {
            const url = new URL(apiEndpoint, window.location.origin);
            if (query) url.searchParams.set('search', query);

            const res = await fetch(url.toString());
            const json = await res.json();
            setData(json);
        } catch (err) {
            console.error('Failed to fetch select options:', err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (apiEndpoint) {
            fetchData('');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiEndpoint]);

    const handleSearchChange = (val: string) => {
        setSearch(val);
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }
        debounceTimeoutRef.current = setTimeout(() => {
            if (apiEndpoint) {
                fetchData(val);
            }
        }, 300);
    };

    const isSelected = (v: string) => (multiple ? (actualValue as string[])?.includes(v) : actualValue === v);

    const handleSelect = (v: string) => {
        if (multiple) {
            let newValue: string[];
            const current = actualValue as string[];
            if (current.includes(v)) {
                newValue = current.filter((item) => item !== v);
            } else {
                newValue = [...current, v];
            }
            if (!value) setInternalValue(newValue);
            onChange?.(newValue);
        } else {
            const newValue = v === actualValue ? '' : v;
            if (!value) setInternalValue(newValue);
            onChange?.(newValue);
            setOpen(false);
        }
    };

    const selectedLabels = React.useMemo(() => {
        const selected = multiple ? (actualValue as string[]) : [actualValue];
        return data.filter((d) => selected.includes(d.value));
    }, [actualValue, data, multiple]);

    const onReset = () => {
        if (multiple) {
            setInternalValue([]);
            onChange?.([]);
        } else {
            setInternalValue('');
            onChange?.('');
        }
        setOpen(false);
    };
    return (
        <Popover open={open && !disabled} onOpenChange={setOpen} modal={modal}>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" disabled={disabled || loading} className="h-8 w-full justify-start gap-2 overflow-hidden">
                    {icon ? React.createElement(icon, { className: 'h-4 w-4 shrink-0' }) : <PlusCircle className="h-4 w-4 shrink-0" />}

                    {selectedLabels.length > 0 ? (
                        <div className="flex flex-wrap items-center gap-1">
                            {selectedLabels.slice(0, 2).map((item) => (
                                <Badge key={item.value} className="rounded-sm px-1 text-xs" variant="secondary">
                                    {item.label}
                                </Badge>
                            ))}
                            {selectedLabels.length > 2 && (
                                <Badge className="rounded-sm px-1 text-xs" variant="outline">
                                    +{selectedLabels.length - 2} more
                                </Badge>
                            )}
                        </div>
                    ) : (
                        <span className="text-md font-medium">{title}</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
                <Command>
                    <CommandInput value={search} onValueChange={handleSearchChange} placeholder={title} />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup>
                            {data.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <CommandItem
                                        className="text-sm font-medium"
                                        key={item.value}
                                        value={item.value}
                                        onSelect={() => handleSelect(item.value)}
                                    >
                                        <Check className={cn('mr-2 h-4 w-4', isSelected(item.value) ? 'opacity-100' : 'opacity-0')} />
                                        {Icon && <Icon className="mr-2 h-4 w-4" />}
                                        {item.label}
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                        {/*//add a command item to clear selection*/}
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
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
