import { describe, expect, it } from 'vitest'
import { searchAll } from '../../src/domain/search'
import { dish, restaurant, visit } from '../helpers/records'

const port = restaurant({ id: 'port', name: 'מזנון הנמל', city: 'חיפה', cuisine: 'ים תיכוני' })

const ramen = restaurant({ id: 'ramen', name: 'Ramen Kaze', city: 'תל אביב', note: 'להזמין מקום מראש' })

const records = {
  restaurants: [port, ramen],
  visits: [
    visit({ id: 'port visit', restaurantId: 'port', visitedOn: '2026-11-03' }),
    visit({ id: 'ramen visit', restaurantId: 'ramen', visitedOn: '2026-10-28' }),
  ],
  dishes: [
    dish({ id: 'sabich', visitId: 'port visit', name: 'סביח' }),
    dish({ id: 'miso', visitId: 'ramen visit', name: 'ראמן מיסו', note: 'חריף מדי' }),
  ],
}

describe('search', () => {
  it('finds restaurants by name, city, cuisine or note, ignoring case and surrounding spaces', () => {
    expect(searchAll(' kaze ', records).restaurants).toEqual([ramen])
    expect(searchAll('חיפה', records).restaurants).toEqual([port])
    expect(searchAll('ים תיכוני', records).restaurants).toEqual([port])
    expect(searchAll('מראש', records).restaurants).toEqual([ramen])
  })

  it('finds dishes by name or note, each with the restaurant it was ordered at', () => {
    expect(searchAll('סביח', records).dishes).toEqual([{ dish: records.dishes[0], restaurant: port }])
    expect(searchAll('חריף', records).dishes).toEqual([{ dish: records.dishes[1], restaurant: ramen }])
  })

  it('finds nothing for a blank query', () => {
    expect(searchAll('  ', records)).toEqual({ restaurants: [], dishes: [] })
  })
})
