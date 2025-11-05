import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface CountrySelectProps {
  value?: string
  onValueChange: (value: string) => void
  disabled?: boolean
}

const COUNTRIES = [
  { code: 'KE', name: 'Kenya', flag: '🇰🇪' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
]

export function CountrySelect({
  value,
  onValueChange,
  disabled,
}: CountrySelectProps) {
  const selectedCountry = COUNTRIES.find((c) => c.name === value)

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className="w-full">
        <SelectValue
          placeholder={
            selectedCountry ? (
              <span className="flex items-center gap-2">
                <span>{selectedCountry.flag}</span>
                <span>{selectedCountry.name}</span>
              </span>
            ) : (
              'Select a country'
            )
          }
        />
      </SelectTrigger>
      <SelectContent>
        {COUNTRIES.map((country) => (
          <SelectItem key={country.code} value={country.name}>
            <span className="flex items-center gap-2">
              <span>{country.flag}</span>
              <span>{country.name}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
