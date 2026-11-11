import type { Dish, Records, Restaurant, Visit } from './types'

type RestaurantListItem = {
  restaurant: Restaurant
  lastVisitedOn: string | undefined
}

const NOTHING_SPENT = 0

const newestVisitFirst = (first: Visit, second: Visit) =>
  second.visitedOn.localeCompare(first.visitedOn) || second.createdAt - first.createdAt

const oldestDishFirst = (first: Dish, second: Dish) => first.createdAt - second.createdAt

export const visitsNewestFirst = (visits: Visit[]) => visits.toSorted(newestVisitFirst)

export const dishesOfVisit = (dishes: Dish[], visitId: string) =>
  dishes.filter((dish) => dish.visitId === visitId).sort(oldestDishFirst)

export const dishesByVisit = (dishes: Dish[]) => Map.groupBy(dishes.toSorted(oldestDishFirst), (dish) => dish.visitId)

function latestVisits(visits: Visit[]) {
  const latest = new Map<string, Visit>()

  visits.forEach((visit) => {
    const known = latest.get(visit.restaurantId)

    if (!known || newestVisitFirst(visit, known) < 0) {
      latest.set(visit.restaurantId, visit)
    }
  })

  return latest
}

export const lastVisitedOn = (visits: Visit[], restaurantId: string) =>
  latestVisits(visits).get(restaurantId)?.visitedOn

type RankedRestaurant = {
  restaurant: Restaurant
  lastVisit: Visit | undefined
}

const recentFirst = (first: RankedRestaurant, second: RankedRestaurant) => {
  if (first.lastVisit && second.lastVisit) {
    return newestVisitFirst(first.lastVisit, second.lastVisit)
  }

  if (first.lastVisit || second.lastVisit) {
    return first.lastVisit ? -1 : 1
  }

  return second.restaurant.createdAt - first.restaurant.createdAt
}

export function restaurantsByRecentVisit(restaurants: Restaurant[], visits: Visit[]) {
  const latest = latestVisits(visits)

  return restaurants
    .map((restaurant): RankedRestaurant => ({ restaurant, lastVisit: latest.get(restaurant.id) }))
    .sort(recentFirst)
    .map(({ restaurant, lastVisit }): RestaurantListItem => ({ restaurant, lastVisitedOn: lastVisit?.visitedOn }))
}

export function recordsOfRestaurant({ restaurants, visits, dishes }: Records, restaurantId: string | undefined) {
  const restaurant = restaurants.find((candidate) => candidate.id === restaurantId)

  if (!restaurant) {
    return undefined
  }

  const ownVisits = visits.filter((visit) => visit.restaurantId === restaurant.id)
  const ownVisitIds = new Set(ownVisits.map((visit) => visit.id))

  return {
    restaurant,
    visits: ownVisits,
    dishes: dishes.filter((dish) => ownVisitIds.has(dish.visitId)),
    otherRestaurants: restaurants.filter((candidate) => candidate.id !== restaurant.id),
  }
}

export function unratedDishes(visits: Visit[], dishes: Dish[]) {
  const visitsById = new Map(visits.map((visit) => [visit.id, visit]))

  return dishes
    .flatMap((dish) => {
      const visit = visitsById.get(dish.visitId)

      return visit && !dish.verdict ? [{ dish, visit }] : []
    })
    .sort(
      (first, second) =>
        second.visit.visitedOn.localeCompare(first.visit.visitedOn) || second.dish.createdAt - first.dish.createdAt,
    )
}

export function visitTotal(dishes: Dish[]) {
  const prices = dishes.flatMap((dish) => (dish.price === undefined ? [] : [dish.price]))

  return prices.length ? prices.reduce((sum, price) => sum + price, NOTHING_SPENT) : undefined
}
