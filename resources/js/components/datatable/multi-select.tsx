import { Check, PlusCircle, XCircle } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import * as React from 'react';

interface Option {
    label: string;
    value: string;
    icon?: React.ElementType;
    count?: number;
}

interface SelectFilterProps {
    title?: string;
    options: Option[];
    multiple: boolean;
    selectedValues: string[];
    onChange: (values: string[]) => void;
}

export function SelectFilter({ title, options, multiple = false, selectedValues, onChange }: SelectFilterProps) {
    const [open, setOpen] = React.useState(false);

    const selectedSet = new Set(selectedValues);

    const onItemSelect = (option: Option, isSelected: boolean) => {
        let newValues: string[];

        if (multiple) {
            if (isSelected) {
                newValues = selectedValues?.filter((v) => v !== option.value);
            } else {
                newValues = [...selectedValues, option.value];
            }
        } else {
            newValues = isSelected ? [] : [option.value];
            setOpen(false);
        }

        onChange(newValues);
    };

    const onReset = () => {
        onChange([]);
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="border-dashed">
                    {selectedSet.size > 0 ? (
                        <div
                            role="button"
                            aria-label={`Clear ${title} filter`}
                            tabIndex={0}
                            onClick={(e) => {
                                e.stopPropagation();
                                onReset();
                            }}
                            className="focus-visible:ring-ring rounded-sm opacity-70 transition-opacity hover:opacity-100 focus-visible:ring-1 focus-visible:outline-none"
                        >
                            <XCircle />
                        </div>
                    ) : (
                        <PlusCircle />
                    )}
                    {title}
                    {selectedSet.size > 0 && (
                        <>
                            <Separator orientation="vertical" className="mx-0.5 data-[orientation=vertical]:h-4" />
                            <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                                {selectedSet.size}
                            </Badge>
                            <div className="hidden items-center gap-1 lg:flex">
                                {selectedSet.size > 2 ? (
                                    <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                                        {selectedSet.size} selected
                                    </Badge>
                                ) : (
                                    options
                                        .filter((option) => selectedSet.has(option.value))
                                        .map((option) => (
                                            <Badge variant="secondary" key={option.value} className="rounded-sm px-1 font-normal">
                                                {option.label}
                                            </Badge>
                                        ))
                                )}
                            </div>
                        </>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[12.5rem] p-0" align="start">
                <Command>
                    <CommandInput placeholder={title} />
                    <CommandList className="max-h-full">
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup className="max-h-[18.75rem] overflow-x-hidden overflow-y-auto">
                            {options.map((option) => {
                                const isSelected = selectedSet.has(option.value);

                                return (
                                    <CommandItem key={option.value} onSelect={() => onItemSelect(option, isSelected)}>
                                        <div
                                            className={cn(
                                                'border-primary mr-2 flex size-4 items-center justify-center rounded-sm border',
                                                isSelected ? 'bg-primary text-white' : 'opacity-50 [&_svg]:invisible',
                                            )}
                                        >
                                            <Check className="h-3 w-3" />
                                        </div>
                                        {option.icon && <option.icon className="mr-2 h-4 w-4" />}
                                        <span className="truncate">{option.label}</span>
                                        {option.count !== undefined && <span className="ml-auto font-mono text-xs">{option.count}</span>}
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>

                        {selectedSet.size > 0 && (
                            <>
                                <CommandSeparator />
                                <CommandGroup>
                                    <CommandItem onSelect={onReset} className="justify-center text-center">
                                        Clear filters
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
