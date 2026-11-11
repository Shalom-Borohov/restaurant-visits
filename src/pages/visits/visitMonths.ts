import { dishesByVisit, visitsNewestFirst } from '../../domain/lists'
import type { Dish, Records, Visit } from '../../domain/types'
import { visitMonth } from '../../domain/visitDate'

export type VisitSummary = {
  visit: Visit
  restaurantName: string
  dishes: Dish[]
}

type VisitMonth = {
  month: string
  visits: VisitSummary[]
}

const NO_DISHES: Dish[] = []

export function visitMonths({ restaurants, visits, dishes }: Records): VisitMonth[] {
  const restaurantNames = new Map(restaurants.map((restaurant) => [restaurant.id, restaurant.name]))
  const dishesOfVisits = dishesByVisit(dishes)

  const summaries = visitsNewestFirst(visits).flatMap((visit): VisitSummary[] => {
    const restaurantName = restaurantNames.get(visit.restaurantId)

    return restaurantName ? [{ visit, restaurantName, dishes: dishesOfVisits.get(visit.id) ?? NO_DISHES }] : []
  })

  const byMonth = Map.groupBy(summaries, ({ visit }) => visitMonth(visit.visitedOn))

  return Array.from(byMonth, ([month, monthVisits]) => ({ month, visits: monthVisits }))
}
