import { unratedDishes } from '../../domain/lists'
import type { Dish, Records } from '../../domain/types'

export type WaitingDish = {
  dish: Dish
  restaurantName: string
}

type SharedVisit = {
  restaurantName: string
  visitedOn: string
}

export type Waiting = {
  shown: WaitingDish[]
  hiddenCount: number
  sharedVisit: SharedVisit | undefined
}

const MAX_WAITING_SHOWN = 8

const NONE_HIDDEN = 0

const SINGLE_VISIT = 1

export function waitingDishes({ restaurants, visits, dishes }: Records): Waiting | undefined {
  const restaurantNames = new Map(restaurants.map((restaurant) => [restaurant.id, restaurant.name]))

  const unrated = unratedDishes(visits, dishes).flatMap(({ dish, visit }) => {
    const restaurantName = restaurantNames.get(visit.restaurantId)

    return restaurantName ? [{ dish, visit, restaurantName }] : []
  })

  const [newest] = unrated

  if (!newest) {
    return undefined
  }

  const fromOneVisit = new Set(unrated.map(({ visit }) => visit.id)).size === SINGLE_VISIT

  return {
    shown: unrated.slice(0, MAX_WAITING_SHOWN).map(({ dish, restaurantName }) => ({ dish, restaurantName })),
    hiddenCount: Math.max(unrated.length - MAX_WAITING_SHOWN, NONE_HIDDEN),
    sharedVisit: fromOneVisit ? { restaurantName: newest.restaurantName, visitedOn: newest.visit.visitedOn } : undefined,
  }
}
