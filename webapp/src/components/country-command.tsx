'use client'

import * as React from 'react'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command'
import { Check, ChevronsUpDown } from 'lucide-react'

interface Country {
  code: string
  country: string
}

interface CountryCommandProps {
  countries: Country[]
  value: string | null // the selected country code
  onSelect: (code: string) => void
  disabled?: boolean
}

export function CountryCommand({ countries, value, disabled, onSelect }: CountryCommandProps) {
  const [open, setOpen] = React.useState(false)

  const handleSelect = (code: string) => {
    onSelect(code)
    setOpen(false)
  }

  const selectedCountry = countries.find((c) => c.code === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {selectedCountry ? selectedCountry.country : 'Select a country...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="p-0" align='start'>
        <Command>
          <CommandInput placeholder="Search countries..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {countries.map((c) => (
                <CommandItem
                  key={c.code}
                  onSelect={() => handleSelect(c.code)}
                >
                  {c.country}
                  {value === c.code && (
                    <Check className="ml-auto h-4 w-4" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
