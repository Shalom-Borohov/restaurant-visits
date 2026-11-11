import { dishesByVisit, restaurantsByRecentVisit } from '../../domain/lists'
import { type DishSummary, summarizeDishes } from '../../domain/restaurantDishes'
import type { Records, Restaurant, Verdict } from '../../domain/types'

export type RestaurantCard = {
  restaurant: Restaurant
  lastVisitedOn: string | undefined
  best: DishSummary | undefined
  worst: DishSummary | undefined
}

const SKIP_VERDICTS: readonly Verdict[] = ['weak', 'avoid']

const isSkip = (summary: DishSummary) => summary.verdict !== undefined && SKIP_VERDICTS.includes(summary.verdict)

export function restaurantCards({ restaurants, visits, dishes }: Records): RestaurantCard[] {
  const visitsByRestaurant = Map.groupBy(visits, (visit) => visit.restaurantId)
  const dishesOfVisits = dishesByVisit(dishes)

  return restaurantsByRecentVisit(restaurants, visits).map(({ restaurant, lastVisitedOn }) => {
    const ownVisits = visitsByRestaurant.get(restaurant.id) ?? []
    const ownDishes = ownVisits.flatMap((visit) => dishesOfVisits.get(visit.id) ?? [])
    const [best, ...rest] = summarizeDishes(ownVisits, ownDishes)

    return { restaurant, lastVisitedOn, best, worst: rest.findLast(isSkip) }
  })
}
