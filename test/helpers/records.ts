import type { Dish, Restaurant, Visit } from '../../src/domain/types'

const CREATED_AT = 1_700_000_000_000

export const restaurant = (fields: Partial<Restaurant> & Pick<Restaurant, 'id' | 'name'>): Restaurant => ({
  createdAt: CREATED_AT,
  ...fields,
})

export const visit = (fields: Partial<Visit> & Pick<Visit, 'id' | 'visitedOn'>): Visit => ({
  restaurantId: 'restaurant',
  kind: 'dineIn',
  createdAt: CREATED_AT,
  ...fields,
})

export const dish = (fields: Partial<Dish> & Pick<Dish, 'id' | 'visitId' | 'name'>): Dish => ({
  createdAt: CREATED_AT,
  ...fields,
})
