import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { addDish, addRestaurant, addVisit, deleteRestaurant, type RestaurantDraft } from '../../src/data/repo'
import type { Verdict } from '../../src/domain/types'
import { resetDb } from '../helpers/db'
import { expectInOrder, selectedTab } from '../helpers/ionic'
import { shrunkPhoto, stubObjectUrls } from '../helpers/photo'
import { currentPath, renderAt } from '../helpers/renderAt'

const NOW = new Date(2026, 10, 10, 20, 15).getTime()

const RESTAURANTS_URL = '/tabs/restaurants'

const RESULT_HEADING_LEVEL = 2

const seedRestaurant = (name: string, fields: Partial<RestaurantDraft> = {}) => addRestaurant({ name, ...fields }, NOW)

const seedVisit = (restaurantId: string, visitedOn: string) =>
  addVisit({ restaurantId, visitedOn, kind: 'dineIn' }, NOW)

const seedDish = (visitId: string, name: string, verdict?: Verdict, price?: number) =>
  addDish({ visitId, name, verdict, price }, undefined, NOW)

const restaurantRow = (name: RegExp) => screen.findByRole('link', { name })

const searchField = () => screen.getByRole('searchbox', { name: 'חיפוש מסעדה או מנה' })

describe('restaurants', () => {
  beforeEach(resetDb)

  it('lists restaurants most recently visited first', async () => {
    const older = await seedRestaurant('Older Place')
    const newer = await seedRestaurant('Newer Place')

    await seedVisit(older, '2026-10-01')
    await seedVisit(newer, '2026-11-03')
    renderAt(RESTAURANTS_URL)

    await expectInOrder(['Newer Place', 'Older Place'])
    await screen.findByText('3 בנוב׳')
  })

  it('shows a restaurant as one row of its place and last visit, naming no dish', async () => {
    const harbour = await seedRestaurant('Harbour', { city: 'חיפה', cuisine: 'ים תיכוני' })
    const visitId = await seedVisit(harbour, '2026-11-03')

    await seedDish(visitId, 'Sabich', 'must')
    await seedDish(visitId, 'Lamb kebab', 'avoid')
    renderAt(RESTAURANTS_URL)

    const row = await restaurantRow(/Harbour/)

    expect(within(row).getByText('חיפה · ים תיכוני')).toBeVisible()
    expect(within(row).getByText('3 בנוב׳')).toBeVisible()
    expect(within(row).queryByText('Sabich')).not.toBeInTheDocument()
    expect(within(row).queryByText('Lamb kebab')).not.toBeInTheDocument()
    expect(within(row).queryByText('חובה להזמין')).not.toBeInTheDocument()
  })

  it('ends the line of a restaurant I would not return to with "לא אחזור"', async () => {
    await seedRestaurant('Trattoria', { city: 'תל אביב', cuisine: 'איטלקי', wouldReturn: 'no' })
    await seedRestaurant('Harbour', { city: 'חיפה', wouldReturn: 'yes' })
    renderAt(RESTAURANTS_URL)

    expect(within(await restaurantRow(/Trattoria/)).getByText('תל אביב · איטלקי · לא אחזור')).toBeVisible()
    expect(within(await restaurantRow(/Harbour/)).getByText('חיפה')).toBeVisible()
  })

  it('shows a restaurant with no dishes by its cuisine', async () => {
    await seedRestaurant('Grill', { cuisine: 'בשרים' })
    renderAt(RESTAURANTS_URL)

    const row = await restaurantRow(/Grill/)

    expect(within(row).getByText('בשרים')).toBeVisible()
  })

  it('finds a dish by name and opens its restaurant', async () => {
    const harbour = await seedRestaurant('Harbour')
    const visitId = await seedVisit(harbour, '2026-11-03')

    await seedRestaurant('Pasta Bar')
    await seedDish(visitId, 'Green Shakshuka', 'good')
    renderAt(RESTAURANTS_URL)

    await restaurantRow(/Pasta Bar/)
    fireEvent.change(searchField(), { target: { value: 'shaksh' } })

    const result = await screen.findByRole('link', { name: /Green Shakshuka/ })

    expect(within(result).getByText('Harbour')).toBeVisible()
    expect(within(result).getByText('טעים')).toBeVisible()
    expect(screen.queryByText('Pasta Bar')).not.toBeInTheDocument()

    fireEvent.click(result)

    await waitFor(() => expect(currentPath()).toBe(`/tabs/restaurants/${harbour}`))
  })

  it('groups search results under restaurant and dish headings, each only when it has results', async () => {
    const harbour = await seedRestaurant('Harbour')
    const visitId = await seedVisit(harbour, '2026-11-03')

    await seedDish(visitId, 'Harbour Fries')
    renderAt(RESTAURANTS_URL)

    await restaurantRow(/^Harbour/)
    fireEvent.change(searchField(), { target: { value: 'harbour' } })

    expect(await screen.findByRole('heading', { name: 'מסעדות', level: RESULT_HEADING_LEVEL })).toBeVisible()
    expect(screen.getByRole('heading', { name: 'מנות', level: RESULT_HEADING_LEVEL })).toBeVisible()

    fireEvent.change(searchField(), { target: { value: 'fries' } })

    await waitFor(() =>
      expect(screen.queryByRole('heading', { name: 'מסעדות', level: RESULT_HEADING_LEVEL })).not.toBeInTheDocument(),
    )
    expect(screen.getByRole('heading', { name: 'מנות', level: RESULT_HEADING_LEVEL })).toBeVisible()
  })

  it('says when a search finds nothing, and clearing it brings the list back', async () => {
    await seedRestaurant('Harbour')
    renderAt(RESTAURANTS_URL)

    await restaurantRow(/Harbour/)
    fireEvent.change(searchField(), { target: { value: 'pizza' } })

    expect(await screen.findByText('לא נמצא')).toBeVisible()
    expect(screen.queryByText('Harbour')).not.toBeInTheDocument()

    fireEvent.change(searchField(), { target: { value: '' } })

    expect(await restaurantRow(/Harbour/)).toBeVisible()
  })

  it('filters the list by city, and a second tap clears it', async () => {
    await seedRestaurant('Harbour', { city: 'חיפה', cuisine: 'ים תיכוני' })
    await seedRestaurant('Ramen Kaze', { city: 'תל אביב', cuisine: 'יפני' })
    renderAt(RESTAURANTS_URL)

    const haifa = await screen.findByRole('button', { name: 'חיפה' })

    fireEvent.click(haifa)

    await waitFor(() => expect(screen.queryByText('Ramen Kaze')).not.toBeInTheDocument())
    expect(haifa).toHaveAttribute('aria-pressed', 'true')
    expect(await restaurantRow(/Harbour/)).toBeVisible()

    fireEvent.click(haifa)

    expect(await restaurantRow(/Ramen Kaze/)).toBeVisible()
  })

  it('drops a city filter once no restaurant has that city any more', async () => {
    const harbourId = await seedRestaurant('Harbour', { city: 'חיפה' })

    await seedRestaurant('Ramen Kaze', { city: 'תל אביב' })
    renderAt(RESTAURANTS_URL)
    fireEvent.click(await screen.findByRole('button', { name: 'חיפה' }))
    await waitFor(() => expect(screen.queryByText('Ramen Kaze')).not.toBeInTheDocument())

    await deleteRestaurant(harbourId)

    expect(await restaurantRow(/Ramen Kaze/)).toBeVisible()
  })

  it('filters the list by cuisine', async () => {
    await seedRestaurant('Harbour', { city: 'חיפה', cuisine: 'ים תיכוני' })
    await seedRestaurant('Ramen Kaze', { city: 'חיפה', cuisine: 'יפני' })
    renderAt(RESTAURANTS_URL)

    fireEvent.click(await screen.findByRole('button', { name: 'יפני' }))

    await waitFor(() => expect(screen.queryByText('Harbour')).not.toBeInTheDocument())
    expect(await restaurantRow(/Ramen Kaze/)).toBeVisible()
  })

  it('starts a new visit from the camera button', async () => {
    renderAt(RESTAURANTS_URL)

    fireEvent.click(await screen.findByRole('link', { name: 'ביקור חדש' }))

    await waitFor(() => expect(currentPath()).toBe('/tabs/restaurants/visits/new'))
    expect(selectedTab()).toBe('restaurants')
  })

  it('points to a new visit when there are no restaurants yet', async () => {
    renderAt(RESTAURANTS_URL)

    expect(await screen.findByText(/עוד אין כאן מסעדות/)).toBeVisible()
    expect(screen.queryByRole('group')).not.toBeInTheDocument()
    expect(screen.queryByText(/לדירוג/)).not.toBeInTheDocument()
  })

  it('opens a restaurant from its row', async () => {
    const harbour = await seedRestaurant('Harbour')

    renderAt(RESTAURANTS_URL)
    fireEvent.click(await restaurantRow(/Harbour/))

    await waitFor(() => expect(currentPath()).toBe(`/tabs/restaurants/${harbour}`))
  })
})

describe('the photo on a restaurant row', () => {
  beforeEach(resetDb)
  stubObjectUrls()

  const photographedDish = (visitId: string, name: string, verdict: Verdict) =>
    addDish({ visitId, name, verdict }, shrunkPhoto(new Uint8Array([1]).buffer, new Uint8Array([2]).buffer), NOW)

  it('falls back to the next dish worth ordering when the best dish has no photo', async () => {
    const harbour = await seedRestaurant('Harbour')
    const visitId = await seedVisit(harbour, '2026-11-03')

    await seedDish(visitId, 'Sabich', 'must')
    await photographedDish(visitId, 'Hummus', 'good')
    renderAt(RESTAURANTS_URL)

    const row = await restaurantRow(/Harbour/)

    expect(await within(row).findByRole('img', { name: 'Hummus' })).toBeInTheDocument()
  })

  it('never shows a dish to skip as the restaurant\'s photo', async () => {
    const harbour = await seedRestaurant('Harbour')
    const visitId = await seedVisit(harbour, '2026-11-03')

    const ramen = await seedRestaurant('Ramen Kaze')

    await seedDish(visitId, 'Sabich', 'must')
    await photographedDish(visitId, 'Lamb kebab', 'avoid')
    await photographedDish(await seedVisit(ramen, '2026-11-01'), 'Tonkotsu', 'must')
    renderAt(RESTAURANTS_URL)

    await screen.findByRole('img', { name: 'Tonkotsu' })

    const row = await restaurantRow(/Harbour/)

    expect(within(row).queryByRole('img')).not.toBeInTheDocument()
  })
})
