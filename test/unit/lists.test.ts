import { describe, expect, it } from 'vitest'
import { restaurantsByRecentVisit, unratedDishes, visitTotal } from '../../src/domain/lists'
import { dish, restaurant, visit } from '../helpers/records'

describe('restaurant list', () => {
  it('puts the most recently visited first, then restaurants never visited, newest added first', () => {
    const restaurants = [
      restaurant({ id: 'old', name: 'נונה רוזה' }),
      restaurant({ id: 'never, older', name: 'פלאפל הצפון', createdAt: 1 }),
      restaurant({ id: 'recent', name: 'מזנון הנמל' }),
      restaurant({ id: 'never, newer', name: 'בית הקפה', createdAt: 2 }),
    ]

    const visits = [
      visit({ id: 'a', restaurantId: 'old', visitedOn: '2026-11-04' }),
      visit({ id: 'b', restaurantId: 'old', visitedOn: '2026-10-12' }),
      visit({ id: 'c', restaurantId: 'recent', visitedOn: '2026-11-05' }),
    ]

    expect(restaurantsByRecentVisit(restaurants, visits)).toEqual([
      { restaurant: restaurants[2], lastVisitedOn: '2026-11-05' },
      { restaurant: restaurants[0], lastVisitedOn: '2026-11-04' },
      { restaurant: restaurants[3], lastVisitedOn: undefined },
      { restaurant: restaurants[1], lastVisitedOn: undefined },
    ])
  })

  it('puts the restaurant logged later first when two were visited the same day', () => {
    const restaurants = [restaurant({ id: 'lunch', name: 'מזנון הנמל' }), restaurant({ id: 'dinner', name: 'נונה רוזה' })]

    const visits = [
      visit({ id: 'a', restaurantId: 'lunch', visitedOn: '2026-11-05', createdAt: 1 }),
      visit({ id: 'b', restaurantId: 'dinner', visitedOn: '2026-11-05', createdAt: 2 }),
    ]

    expect(restaurantsByRecentVisit(restaurants, visits).map((item) => item.restaurant.id)).toEqual([
      'dinner',
      'lunch',
    ])
  })
})

describe('unrated dishes', () => {
  it('lists dishes without a verdict, from the most recent visit first', () => {
    const visits = [
      visit({ id: 'october', visitedOn: '2026-10-12' }),
      visit({ id: 'november', visitedOn: '2026-11-03' }),
    ]

    const dishes = [
      dish({ id: 'old unrated', visitId: 'october', name: 'ניוקי' }),
      dish({ id: 'rated', visitId: 'november', name: 'סביח', verdict: 'must' }),
      dish({ id: 'new unrated', visitId: 'november', name: 'שקשוקה' }),
    ]

    expect(unratedDishes(visits, dishes)).toEqual([
      { dish: dishes[2], visit: visits[1] },
      { dish: dishes[0], visit: visits[0] },
    ])
  })
})

describe('visit total', () => {
  it('sums the prices of its dishes, skipping dishes without a price', () => {
    const dishes = [
      dish({ id: 'a', visitId: 'v', name: 'שקשוקה', price: 58 }),
      dish({ id: 'b', visitId: 'v', name: 'מים' }),
      dish({ id: 'c', visitId: 'v', name: 'לימונענע', price: 16 }),
    ]

    expect(visitTotal(dishes)).toBe(74)
  })

  it('has no total when no dish has a price', () => {
    expect(visitTotal([dish({ id: 'a', visitId: 'v', name: 'מים' })])).toBeUndefined()
  })
})
