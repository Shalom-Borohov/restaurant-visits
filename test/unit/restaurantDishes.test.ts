import { describe, expect, it } from 'vitest'
import { summarizeDishes } from '../../src/domain/restaurantDishes'
import { dish, visit } from '../helpers/records'

const october = visit({ id: 'october', visitedOn: '2026-10-12' })

const november = visit({ id: 'november', visitedOn: '2026-11-03' })

describe('a restaurant’s dishes', () => {
  it('groups the same dish across visits by name, ignoring case and surrounding spaces', () => {
    const summaries = summarizeDishes(
      [october, november],
      [
        dish({ id: 'first', visitId: 'october', name: 'Sabich', price: 38, verdict: 'good', hasPhoto: true }),
        dish({ id: 'second', visitId: 'november', name: ' sabich ', price: 42, verdict: 'must' }),
      ],
    )

    expect(summaries).toEqual([
      {
        name: ' sabich ',
        orderCount: 2,
        lastOrderedOn: '2026-11-03',
        verdict: 'must',
        price: 42,
        photoDishId: 'first',
        latestDishId: 'second',
        latestVisitId: 'november',
      },
    ])
  })

  it('keeps the most recent verdict and price when the latest order has none', () => {
    const [summary] = summarizeDishes(
      [october, november],
      [
        dish({ id: 'rated', visitId: 'october', name: 'גיוזה', price: 32, verdict: 'weak' }),
        dish({ id: 'unrated', visitId: 'november', name: 'גיוזה' }),
      ],
    )

    expect(summary).toMatchObject({ verdict: 'weak', price: 32, latestDishId: 'unrated' })
  })

  it('puts the latest-added dish first when two orders share a visit date', () => {
    const [summary] = summarizeDishes(
      [november, visit({ id: 'same day', visitedOn: '2026-11-03' })],
      [
        dish({ id: 'earlier', visitId: 'november', name: 'סביח', verdict: 'fine', createdAt: 1 }),
        dish({ id: 'later', visitId: 'same day', name: 'סביח', verdict: 'must', createdAt: 2 }),
      ],
    )

    expect(summary).toMatchObject({ verdict: 'must', latestDishId: 'later' })
  })

  it('orders best verdict first, unrated last, and most recent first within a verdict', () => {
    const summaries = summarizeDishes(
      [october, november],
      [
        dish({ id: 'unrated', visitId: 'november', name: 'לימונענע' }),
        dish({ id: 'avoid', visitId: 'november', name: 'קבב טלה', verdict: 'avoid' }),
        dish({ id: 'old must', visitId: 'october', name: 'חומוס', verdict: 'must' }),
        dish({ id: 'fine', visitId: 'november', name: 'פול', verdict: 'fine' }),
        dish({ id: 'new must', visitId: 'november', name: 'סביח', verdict: 'must' }),
        dish({ id: 'weak', visitId: 'november', name: 'צ׳יפס', verdict: 'weak' }),
        dish({ id: 'good', visitId: 'october', name: 'פיתה', verdict: 'good' }),
      ],
    )

    expect(summaries.map((summary) => summary.name)).toEqual([
      'סביח',
      'חומוס',
      'פיתה',
      'פול',
      'צ׳יפס',
      'קבב טלה',
      'לימונענע',
    ])
  })
})
