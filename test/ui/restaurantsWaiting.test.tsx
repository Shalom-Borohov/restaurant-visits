import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { addDish, addRestaurant, addVisit } from '../../src/data/repo'
import type { Verdict } from '../../src/domain/types'
import { resetDb } from '../helpers/db'
import { selectedTab } from '../helpers/ionic'
import { currentPath, renderAt } from '../helpers/renderAt'

const NOW = new Date(2026, 10, 10, 20, 15).getTime()

const RESTAURANTS_URL = '/tabs/restaurants'

const seedRestaurant = (name: string) => addRestaurant({ name }, NOW)

const seedVisit = (restaurantId: string, visitedOn: string) =>
  addVisit({ restaurantId, visitedOn, kind: 'dineIn' }, NOW)

const seedDish = (visitId: string, name: string, verdict?: Verdict, price?: number) =>
  addDish({ visitId, name, verdict, price }, undefined, NOW)

const searchField = () => screen.getByRole('searchbox', { name: 'חיפוש מסעדה או מנה' })

describe('dishes waiting for a verdict', () => {
  beforeEach(resetDb)

  it('opens the visit from the waiting line when every waiting dish is from that visit', async () => {
    const harbour = await seedRestaurant('Harbour')
    const visitId = await seedVisit(harbour, '2026-11-03')

    await seedDish(visitId, 'Shakshuka', undefined, 58)
    await seedDish(visitId, 'Lemonana', undefined, 16)
    await seedDish(visitId, 'Sabich', 'must')
    renderAt(RESTAURANTS_URL)

    fireEvent.click(await screen.findByRole('link', { name: /2 מנות מחכות לדירוג/ }))

    await waitFor(() => expect(currentPath()).toBe(`/tabs/restaurants/visits/${visitId}`))
    expect(selectedTab()).toBe('restaurants')
  })

  it('counts a single waiting dish in words', async () => {
    const harbour = await seedRestaurant('Harbour')
    const visitId = await seedVisit(harbour, '2026-11-03')

    await seedDish(visitId, 'Shakshuka')
    renderAt(RESTAURANTS_URL)

    expect(await screen.findByRole('link', { name: /מנה אחת מחכה לדירוג/ })).toBeVisible()
  })

  it('lists waiting dishes from several visits in a sheet, newest visit first, each opening its visit', async () => {
    const harbour = await seedRestaurant('Harbour')
    const ramen = await seedRestaurant('Ramen Kaze')
    const olderVisit = await seedVisit(ramen, '2026-10-28')
    const newerVisit = await seedVisit(harbour, '2026-11-03')

    await seedDish(olderVisit, 'Gyoza')
    await seedDish(newerVisit, 'Shakshuka', undefined, 58)
    await seedDish(newerVisit, 'Sabich', 'must')
    renderAt(RESTAURANTS_URL)

    fireEvent.click(await screen.findByRole('button', { name: /2 מנות מחכות לדירוג/ }))

    const newest = await screen.findByRole('link', { name: /Shakshuka/ })
    const older = screen.getByRole('link', { name: /Gyoza/ })

    expect(newest.compareDocumentPosition(older) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(within(newest).getByText('Harbour · 3 בנוב׳')).toBeVisible()
    expect(within(newest).getByText('₪58')).toBeVisible()
    expect(within(older).getByText('Ramen Kaze · 28 באוק׳')).toBeVisible()
    expect(screen.queryByRole('link', { name: /Sabich/ })).not.toBeInTheDocument()

    fireEvent.click(newest)

    await waitFor(() => expect(currentPath()).toBe(`/tabs/restaurants/visits/${newerVisit}`))
    expect(selectedTab()).toBe('restaurants')
    await waitFor(() => expect(screen.queryByRole('link', { name: /Gyoza/ })).not.toBeInTheDocument())
  })

  it('hides the waiting line while searching', async () => {
    const harbour = await seedRestaurant('Harbour')
    const visitId = await seedVisit(harbour, '2026-11-03')

    await seedDish(visitId, 'Shakshuka')
    renderAt(RESTAURANTS_URL)

    await screen.findByRole('link', { name: /מחכה לדירוג/ })
    fireEvent.change(searchField(), { target: { value: 'harbour' } })

    await waitFor(() => expect(screen.queryByText(/לדירוג/)).not.toBeInTheDocument())
  })

  it('hides the waiting line when every dish is rated', async () => {
    const harbour = await seedRestaurant('Harbour')
    const visitId = await seedVisit(harbour, '2026-11-03')

    await seedDish(visitId, 'Sabich', 'must')
    renderAt(RESTAURANTS_URL)

    await screen.findByRole('link', { name: /Harbour/ })

    expect(screen.queryByText(/לדירוג/)).not.toBeInTheDocument()
  })
})
