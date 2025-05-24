import { countries } from 'countries-list'

export interface Country {
  code: string
  name: string
}

export const getCountries = (): Country[] => {
  return Object.entries(countries).map(([code, country]) => ({
    code,
    name: country.name,
  })).sort((a, b) => a.name.localeCompare(b.name))
}

export const getCountryByCode = (code: string): Country | undefined => {
  const country = countries[code as keyof typeof countries]
  if (!country) return undefined
  
  return {
    code,
    name: country.name,
  }
} 