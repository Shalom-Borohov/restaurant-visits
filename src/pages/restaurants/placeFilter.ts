import type { PlaceSuggestions } from '../../domain/places'
import type { Records, Restaurant } from '../../domain/types'

export type PlaceFilter = {
  city: string | undefined
  cuisine: string | undefined
}

export const NO_PLACE_FILTER: PlaceFilter = { city: undefined, cuisine: undefined }

const fits = (restaurant: Restaurant, { city, cuisine }: PlaceFilter) =>
  (!city || restaurant.city === city) && (!cuisine || restaurant.cuisine === cuisine)

const stillOffered = (chosen: string | undefined, offered: string[]) =>
  chosen !== undefined && offered.includes(chosen) ? chosen : undefined

export const filterWithinPlaces = ({ city, cuisine }: PlaceFilter, places: PlaceSuggestions): PlaceFilter => ({
  city: stillOffered(city, places.cities),
  cuisine: stillOffered(cuisine, places.cuisines),
})

export const filterByPlace =(records: Records, filter: PlaceFilter): Records => ({
  ...records,
  restaurants: records.restaurants.filter((restaurant) => fits(restaurant, filter)),
})
