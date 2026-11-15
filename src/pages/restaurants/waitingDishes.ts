import { unratedDishes } from '../../domain/lists'
import type { Dish, Records } from '../../domain/types'

export type WaitingDish = {
  dish: Dish
  restaurantName: string
  visitedOn: string
}

export type Waiting = {
  dishes: WaitingDish[]
  sharedVisitId: string | undefined
}

const SINGLE_VISIT = 1

export function waitingDishes({ restaurants, visits, dishes }: Records): Waiting | undefined {
  const restaurantNames = new Map(restaurants.map((restaurant) => [restaurant.id, restaurant.name]))

  const unrated = unratedDishes(visits, dishes).flatMap(({ dish, visit }) => {
    const restaurantName = restaurantNames.get(visit.restaurantId)

    return restaurantName ? [{ dish, restaurantName, visitedOn: visit.visitedOn }] : []
  })

  const [newest] = unrated

  if (!newest) {
    return undefined
  }

  const fromOneVisit = new Set(unrated.map(({ dish }) => dish.visitId)).size === SINGLE_VISIT

  return { dishes: unrated, sharedVisitId: fromOneVisit ? newest.dish.visitId : undefined }
}
