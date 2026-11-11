import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { addDish, addRestaurant, addVisit, deleteRestaurant, type RestaurantDraft } from '../../src/data/repo'
import type { Verdict } from '../../src/domain/types'
import { resetDb } from '../helpers/db'
import { expectInOrder, selectedTab } from '../helpers/ionic'
import { currentPath, renderAt } from '../helpers/renderAt'

const NOW = new Date(2026, 10, 10, 20, 15).getTime()

const RESTAURANTS_URL = '/tabs/restaurants'

const RESULT_HEADING_LEVEL = 2

const seedRestaurant = (name: string, fields: Partial<RestaurantDraft> = {}) => addRestaurant({ name, ...fields }, NOW)

const seedVisit = (restaurantId: string, visitedOn: string) =>
  addVisit({ restaurantId, visitedOn, kind: 'dineIn' }, NOW)

const seedDish = (visitId: string, name: string, verdict?: Verdict, price?: number) =>
  addDish({ visitId, name, verdict, price }, undefined, NOW)

const restaurantTile = (name: RegExp) => screen.findByRole('link', { name })

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

  it('leads a restaurant with its best dish and shows its worst, in words', async () => {
    const harbour = await seedRestaurant('Harbour', { city: 'חיפה', cuisine: 'ים תיכוני' })
    const visitId = await seedVisit(harbour, '2026-11-03')

    await seedDish(visitId, 'Sabich', 'must')
    await seedDish(visitId, 'Hummus', 'fine')
    await seedDish(visitId, 'Lamb kebab', 'avoid')
    renderAt(RESTAURANTS_URL)

    const tile = await restaurantTile(/Harbour/)

    expect(within(tile).getByText('Sabich')).toBeVisible()
    expect(within(tile).getByText('חובה להזמין')).toBeVisible()
    expect(within(tile).getByText('Lamb kebab')).toBeVisible()
    expect(within(tile).getByText('לא להזמין')).toBeVisible()
    expect(within(tile).queryByText('Hummus')).not.toBeInTheDocument()
    expect(within(tile).getByText('חיפה · ים תיכוני')).toBeVisible()
  })

  it('shows no worst dish when nothing was weak or worse', async () => {
    const pasta = await seedRestaurant('Pasta Bar')
    const visitId = await seedVisit(pasta, '2026-11-03')

    await seedDish(visitId, 'Focaccia', 'must')
    await seedDish(visitId, 'Penne', 'fine')
    renderAt(RESTAURANTS_URL)

    const tile = await restaurantTile(/Pasta Bar/)

    expect(within(tile).getByText('Focaccia')).toBeVisible()
    expect(within(tile).queryByText('Penne')).not.toBeInTheDocument()
  })

  it('says a restaurant has no dishes yet', async () => {
    await seedRestaurant('Grill', { cuisine: 'בשרים' })
    renderAt(RESTAURANTS_URL)

    const tile = await restaurantTile(/Grill/)

    expect(within(tile).getByText('אין מנות עדיין')).toBeVisible()
    expect(within(tile).getByText('בשרים')).toBeVisible()
  })

  it('lists dishes waiting for a verdict, newest first, each opening its visit', async () => {
    const harbour = await seedRestaurant('Harbour')
    const ramen = await seedRestaurant('Ramen Kaze')
    const olderVisit = await seedVisit(ramen, '2026-10-28')
    const newerVisit = await seedVisit(harbour, '2026-11-03')

    await seedDish(olderVisit, 'Gyoza')
    await seedDish(newerVisit, 'Shakshuka', undefined, 58)
    await seedDish(newerVisit, 'Sabich', 'must')
    renderAt(RESTAURANTS_URL)

    const waiting = await screen.findByRole('region', { name: /מחכות לדירוג/ })

    expect(within(waiting).queryByText('Sabich')).not.toBeInTheDocument()
    expect(within(waiting).getByText('₪58')).toBeVisible()

    const [newest, older] = within(waiting).getAllByRole('link')

    expect(newest).toHaveTextContent('Shakshuka')
    expect(newest).toHaveTextContent('Harbour')
    expect(older).toHaveTextContent('Gyoza')
    expect(older).toHaveTextContent('Ramen Kaze')
    expect(within(waiting).queryByText('Harbour · 3 בנוב׳')).not.toBeInTheDocument()

    fireEvent.click(newest)

    await waitFor(() => expect(currentPath()).toBe(`/tabs/restaurants/visits/${newerVisit}`))
    expect(selectedTab()).toBe('restaurants')
  })

  it('names the restaurant and date once in the heading when every waiting dish is from one visit', async () => {
    const harbour = await seedRestaurant('Harbour')
    const visitId = await seedVisit(harbour, '2026-11-03')

    await seedDish(visitId, 'Shakshuka', undefined, 58)
    await seedDish(visitId, 'Lemonana', undefined, 16)
    renderAt(RESTAURANTS_URL)

    const waiting = await screen.findByRole('region', { name: /מחכות לדירוג/ })

    expect(within(waiting).getByText('Harbour · 3 בנוב׳')).toBeVisible()

    const [first] = within(waiting).getAllByRole('link')

    expect(first).not.toHaveTextContent('Harbour')
  })

  it('hides the waiting dishes when every dish is rated', async () => {
    const harbour = await seedRestaurant('Harbour')
    const visitId = await seedVisit(harbour, '2026-11-03')

    await seedDish(visitId, 'Sabich', 'must')
    renderAt(RESTAURANTS_URL)

    await restaurantTile(/Harbour/)

    expect(screen.queryByRole('region', { name: /מחכות לדירוג/ })).not.toBeInTheDocument()
  })

  it('finds a dish by name and opens its restaurant', async () => {
    const harbour = await seedRestaurant('Harbour')
    const visitId = await seedVisit(harbour, '2026-11-03')

    await seedRestaurant('Pasta Bar')
    await seedDish(visitId, 'Green Shakshuka', 'good')
    renderAt(RESTAURANTS_URL)

    await restaurantTile(/Pasta Bar/)
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

    await restaurantTile(/^Harbour/)
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

    await restaurantTile(/Harbour/)
    fireEvent.change(searchField(), { target: { value: 'pizza' } })

    expect(await screen.findByText('לא נמצא')).toBeVisible()
    expect(screen.queryByText('Harbour')).not.toBeInTheDocument()

    fireEvent.change(searchField(), { target: { value: '' } })

    expect(await restaurantTile(/Harbour/)).toBeVisible()
  })

  it('filters the list by city, and a second tap clears it', async () => {
    await seedRestaurant('Harbour', { city: 'חיפה', cuisine: 'ים תיכוני' })
    await seedRestaurant('Ramen Kaze', { city: 'תל אביב', cuisine: 'יפני' })
    renderAt(RESTAURANTS_URL)

    const haifa = await screen.findByRole('button', { name: 'חיפה' })

    fireEvent.click(haifa)

    await waitFor(() => expect(screen.queryByText('Ramen Kaze')).not.toBeInTheDocument())
    expect(haifa).toHaveAttribute('aria-pressed', 'true')
    expect(await restaurantTile(/Harbour/)).toBeVisible()

    fireEvent.click(haifa)

    expect(await restaurantTile(/Ramen Kaze/)).toBeVisible()
  })

  it('drops a city filter once no restaurant has that city any more', async () => {
    const harbourId = await seedRestaurant('Harbour', { city: 'חיפה' })

    await seedRestaurant('Ramen Kaze', { city: 'תל אביב' })
    renderAt(RESTAURANTS_URL)
    fireEvent.click(await screen.findByRole('button', { name: 'חיפה' }))
    await waitFor(() => expect(screen.queryByText('Ramen Kaze')).not.toBeInTheDocument())

    await deleteRestaurant(harbourId)

    expect(await restaurantTile(/Ramen Kaze/)).toBeVisible()
  })

  it('filters the list by cuisine', async () => {
    await seedRestaurant('Harbour', { city: 'חיפה', cuisine: 'ים תיכוני' })
    await seedRestaurant('Ramen Kaze', { city: 'חיפה', cuisine: 'יפני' })
    renderAt(RESTAURANTS_URL)

    fireEvent.click(await screen.findByRole('button', { name: 'יפני' }))

    await waitFor(() => expect(screen.queryByText('Harbour')).not.toBeInTheDocument())
    expect(await restaurantTile(/Ramen Kaze/)).toBeVisible()
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
    expect(screen.queryByRole('region', { name: /מחכות לדירוג/ })).not.toBeInTheDocument()
  })

  it('opens a restaurant from its tile', async () => {
    const harbour = await seedRestaurant('Harbour')

    renderAt(RESTAURANTS_URL)
    fireEvent.click(await restaurantTile(/Harbour/))

    await waitFor(() => expect(currentPath()).toBe(`/tabs/restaurants/${harbour}`))
  })
})
