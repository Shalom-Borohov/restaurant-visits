import { normalizeText } from './text'
import type { Dish, Records, Restaurant } from './types'

export type DishMatch = {
  dish: Dish
  restaurant: Restaurant
}

const matches = (query: string, fields: (string | undefined)[]) =>
  fields.some((field) => field !== undefined && normalizeText(field).includes(query))

const restaurantMatches = (query: string, restaurants: Restaurant[]) =>
  restaurants.filter((restaurant) =>
    matches(query, [restaurant.name, restaurant.city, restaurant.cuisine, restaurant.note]),
  )

export function searchRestaurants(rawQuery: string, restaurants: Restaurant[]) {
  const query = normalizeText(rawQuery)

  return query ? restaurantMatches(query, restaurants) : []
}

export function searchAll(rawQuery: string, { restaurants, visits, dishes }: Records) {
  const query = normalizeText(rawQuery)

  if (!query) {
    return { restaurants: [], dishes: [] }
  }

  const restaurantsById = new Map(restaurants.map((restaurant) => [restaurant.id, restaurant]))

  const restaurantOfVisit = new Map(visits.map((visit) => [visit.id, restaurantsById.get(visit.restaurantId)]))

  const dishMatches = dishes.flatMap((dish): DishMatch[] => {
    const restaurant = restaurantOfVisit.get(dish.visitId)

    return restaurant && matches(query, [dish.name, dish.note]) ? [{ dish, restaurant }] : []
  })

  return {
    restaurants: restaurantMatches(query, restaurants),
    dishes: dishMatches,
  }
}
