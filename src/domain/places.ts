import type { Restaurant } from './types'

export type PlaceSuggestions = {
  cities: string[]
  cuisines: string[]
}

const HEBREW_LOCALE = 'he'

const distinctSorted = (texts: (string | undefined)[]) =>
  [...new Set(texts.filter((text) => text !== undefined))].sort((first, second) =>
    first.localeCompare(second, HEBREW_LOCALE),
  )

export const placeSuggestions = (restaurants: Restaurant[]): PlaceSuggestions => ({
  cities: distinctSorted(restaurants.map((restaurant) => restaurant.city)),
  cuisines: distinctSorted(restaurants.map((restaurant) => restaurant.cuisine)),
})
