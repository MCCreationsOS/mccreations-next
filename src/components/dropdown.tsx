import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandInput, CommandItem } from "./ui/command";
import { CommandList } from "cmdk";
import { cn } from "@/lib/utils";

interface options {
    label: string;
    value: string;
}

export function Dropdown({options, initialValue, onChange}: {options: options[], initialValue: string, onChange: (value: string | number) => void}) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(initialValue);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between" role="combobox" aria-expanded={open} aria-controls="dropdown-menu">
                    {value ? options.find(option => option.value === value)?.label : "Select an option"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56" align="start">
                <Command>
                    <CommandInput placeholder="Search..." />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        {options.map(option => (
                            <CommandItem key={option.value} value={option.value} onSelect={(currentValue) => {
                                setValue(currentValue === value ? "" : currentValue);
                                onChange(currentValue);
                                setOpen(false);
                            }}>
                                <Check className={cn(value === option.value ? "opacity-100" : "opacity-0")} />
                                {option.label}
                            </CommandItem>
                        ))}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
