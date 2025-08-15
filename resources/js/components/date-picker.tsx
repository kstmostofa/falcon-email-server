import { CalendarIcon } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

function formatDate(date: Date | undefined) {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
}

function isValidDate(date: Date | undefined) {
    return date instanceof Date && !isNaN(date.getTime());
}

interface DatePickerProps {
    placeholder?: string;
    value?: Date;
    onChange?: (date: Date | undefined) => void;
}

export function DatePicker({ placeholder, value, onChange }: DatePickerProps) {
    const [open, setOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState(formatDate(value));
    const [month, setMonth] = React.useState<Date | undefined>(value);

    React.useEffect(() => {
        setInputValue(formatDate(value));
        if (value) setMonth(value);
    }, [value]);

    return (
        <div className="flex flex-col gap-3">
            <div className="relative flex gap-2">
                <Input
                    id="date"
                    value={inputValue}
                    placeholder={placeholder || 'Select date'}
                    className="bg-background pr-10"
                    autoComplete="off"
                    onClick={() => setOpen(true)}
                    onChange={(e) => {
                        const newValue = e.target.value;
                        setInputValue(newValue);

                        const parsedDate = new Date(newValue);
                        if (isValidDate(parsedDate)) {
                            onChange?.(parsedDate);
                            setMonth(parsedDate);
                        } else {
                            onChange?.(undefined);
                        }
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'ArrowDown') {
                            e.preventDefault();
                            setOpen(true);
                        }
                    }}
                />
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button id="date-picker" variant="ghost" className="absolute top-1/2 right-2 size-6 -translate-y-1/2">
                            <CalendarIcon className="size-3.5" />
                            <span className="sr-only">{placeholder}</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto overflow-hidden p-0" align="end" alignOffset={-8} sideOffset={10}>
                        <Calendar
                            mode="single"
                            selected={value}
                            captionLayout="dropdown"
                            month={month}
                            onMonthChange={setMonth}
                            onSelect={(selectedDate) => {
                                onChange?.(selectedDate);
                                setOpen(false);
                            }}
                        />
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
}
