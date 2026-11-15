import { dishesByVisit, restaurantsByRecentVisit } from '../../domain/lists'
import { type DishSummary, SKIP_VERDICTS, summarizeDishes } from '../../domain/restaurantDishes'
import type { Records, Restaurant } from '../../domain/types'

export type RestaurantCard = {
  restaurant: Restaurant
  lastVisitedOn: string | undefined
  bestPhoto: DishSummary | undefined
}

const isWorthOrdering = (summary: DishSummary) => !summary.verdict || !SKIP_VERDICTS.includes(summary.verdict)

const isPhotoWorthShowing = (summary: DishSummary) => summary.photoDishId !== undefined && isWorthOrdering(summary)

export function restaurantCards({ restaurants, visits, dishes }: Records): RestaurantCard[] {
  const visitsByRestaurant = Map.groupBy(visits, (visit) => visit.restaurantId)
  const dishesOfVisits = dishesByVisit(dishes)

  return restaurantsByRecentVisit(restaurants, visits).map(({ restaurant, lastVisitedOn }) => {
    const ownVisits = visitsByRestaurant.get(restaurant.id) ?? []
    const ownDishes = ownVisits.flatMap((visit) => dishesOfVisits.get(visit.id) ?? [])

    return { restaurant, lastVisitedOn, bestPhoto: summarizeDishes(ownVisits, ownDishes).find(isPhotoWorthShowing) }
  })
}
