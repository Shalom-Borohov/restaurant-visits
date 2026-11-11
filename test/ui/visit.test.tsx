import { fireEvent, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  addDish,
  addRestaurant,
  addVisit,
  allDishes,
  allRestaurants,
  allVisits,
  updateDish,
} from '../../src/data/repo'
import {
  NEW_VISIT_PATH,
  newVisitAtPath,
  restaurantPath,
  restaurantsStackVisitPath,
  VISITS_PATH,
  visitsStackVisitPath,
} from '../../src/navigation/paths'
import { freezeDate } from '../helpers/clock'
import { resetDb } from '../helpers/db'
import { expectInOrder, ionElement, selectedTab } from '../helpers/ionic'
import { alertShown, clickAlertButton } from '../helpers/overlays'
import { currentPath, currentSearch, renderAt } from '../helpers/renderAt'

const NOW = new Date(2026, 10, 10, 20, 15).getTime()

const WITHOUT_PHOTO = 'מנה בלי תמונה'

const press = async (name: string | RegExp) => fireEvent.click(await screen.findByRole('button', { name }))

const pressText = async (text: string) => fireEvent.click(await screen.findByText(text))

const typeInto = async (label: string, text: string) =>
  fireEvent.change(await screen.findByLabelText(label), { target: { value: text } })

async function savedVisits() {
  await waitFor(async () => expect(await allVisits()).not.toHaveLength(0))

  return allVisits()
}

async function addDishNamed(name: string) {
  await press(WITHOUT_PHOTO)
  await typeInto('שם המנה', name)
  await pressText('שמירה')
}

describe('logging a visit', () => {
  beforeEach(resetDb)
  freezeDate(NOW)

  it('picks an existing restaurant, then saves the visit with its first dish and opens it', async () => {
    const restaurantId = await addRestaurant({ name: 'Abu Hassan', city: 'יפו' }, NOW)

    renderAt(NEW_VISIT_PATH)
    await press(/Abu Hassan/)
    await addDishNamed('חומוס')

    const [saved] = await savedVisits()

    expect(saved).toMatchObject({ restaurantId, visitedOn: '2026-11-10', kind: 'dineIn' })
    expect(await allDishes()).toMatchObject([{ visitId: saved.id, name: 'חומוס' }])
    await waitFor(() => expect(currentPath()).toBe(restaurantsStackVisitPath(saved.id)))
  })

  it('finds a restaurant by search, most recently visited first', async () => {
    const olderId = await addRestaurant({ name: 'Taizu' }, NOW)
    const newerId = await addRestaurant({ name: 'Port Said', city: 'תל אביב' }, NOW)

    await addVisit({ restaurantId: olderId, visitedOn: '2026-10-01', kind: 'dineIn' }, NOW)
    await addVisit({ restaurantId: newerId, visitedOn: '2026-11-01', kind: 'dineIn' }, NOW)
    renderAt(NEW_VISIT_PATH)

    await expectInOrder(['Port Said', 'Taizu'])
    await typeInto('חיפוש מסעדה', 'תל אביב')
    await waitFor(() => expect(screen.queryByText('Taizu')).not.toBeInTheDocument())
    expect(screen.getByText('Port Said')).toBeInTheDocument()
  })

  it('creates a new restaurant inline, suggesting earlier cities, and logs the visit there', async () => {
    await addRestaurant({ name: 'Taizu', city: 'תל אביב', cuisine: 'אסייתי' }, NOW)
    renderAt(NEW_VISIT_PATH)

    await press('מסעדה חדשה')
    expect(screen.getByRole('option', { name: 'תל אביב' })).toBeInTheDocument()
    await typeInto('שם המסעדה', 'Miznon')
    await typeInto('עיר', 'תל אביב')
    await typeInto('מטבח', 'ישראלי')
    await press('המשך')

    expect(await screen.findByText('Miznon')).toBeInTheDocument()
    await addDishNamed('כרובית')

    const [saved] = await savedVisits()
    const created = (await allRestaurants()).find((restaurant) => restaurant.name === 'Miznon')

    expect(created).toMatchObject({ city: 'תל אביב', cuisine: 'ישראלי' })
    expect(saved.restaurantId).toBe(created?.id)
  })

  it('writes nothing when leaving a new visit before adding a dish', async () => {
    const restaurantId = await addRestaurant({ name: 'Abu Hassan' }, NOW)

    renderAt(newVisitAtPath(restaurantId))
    await press('משלוח')
    await press(WITHOUT_PHOTO)
    await pressText('ביטול')

    expect(await allVisits()).toHaveLength(0)
    expect(currentPath()).toBe(NEW_VISIT_PATH)
  })

  it('logs at the restaurant it was opened for when an unfinished new visit is still open', async () => {
    const harbourId = await addRestaurant({ name: 'Harbour' }, NOW)
    const ramenId = await addRestaurant({ name: 'Ramen Kaze' }, NOW)

    renderAt(newVisitAtPath(harbourId))
    expect(await screen.findByText(WITHOUT_PHOTO)).toBeInTheDocument()
    await pressText('מסעדות')
    fireEvent.click(await screen.findByRole('link', { name: /Ramen Kaze/ }))
    fireEvent.click(await screen.findByRole('button', { name: 'ביקור חדש כאן' }))
    await waitFor(() => expect(currentSearch()).toBe(`?restaurant=${ramenId}`))

    const shownTitle = await ionElement('ion-title')

    await waitFor(() => expect(shownTitle).toHaveTextContent('Ramen Kaze'))
  })

  it("suggests the restaurant's earlier dishes and fills the exact name", async () => {
    const restaurantId = await addRestaurant({ name: 'Abu Hassan' }, NOW)
    const earlierVisitId = await addVisit({ restaurantId, visitedOn: '2026-10-01', kind: 'dineIn' }, NOW)

    await addDish({ visitId: earlierVisitId, name: 'Hummus Masabacha' }, undefined, NOW)
    renderAt(newVisitAtPath(restaurantId))
    await press(WITHOUT_PHOTO)
    await typeInto('שם המנה', 'masa')
    await press('Hummus Masabacha')

    expect(screen.getByLabelText('שם המנה')).toHaveValue('Hummus Masabacha')
  })
})

describe('an existing visit', () => {
  beforeEach(resetDb)
  freezeDate(NOW)

  async function seedVisit() {
    const restaurantId = await addRestaurant({ name: 'Abu Hassan' }, NOW)
    const visitId = await addVisit({ restaurantId, visitedOn: '2026-11-08', kind: 'dineIn' }, NOW)
    const dishId = await addDish({ visitId, name: 'חומוס', price: 42 }, undefined, NOW)

    return { restaurantId, visitId, dishId }
  }

  it('shows its dishes as plates with their verdict and the visit total', async () => {
    const { visitId } = await seedVisit()

    await addDish({ visitId, name: 'פול', price: 38, verdict: 'must' }, undefined, NOW + 1)
    renderAt(visitsStackVisitPath(visitId))

    const shownTitle = await ionElement('ion-title')

    await waitFor(() => expect(shownTitle).toHaveTextContent('Abu Hassan'))
    expect(await screen.findByText('לדרג')).toBeInTheDocument()
    expect(screen.getByText('חובה להזמין')).toBeInTheDocument()
    expect(screen.getByText('סה״כ ₪80')).toBeInTheDocument()
  })

  it('rates an unrated dish later and adds its price and note', async () => {
    const { visitId, dishId } = await seedVisit()

    renderAt(visitsStackVisitPath(visitId))
    await press(/חומוס/)
    await press('טעים')
    await typeInto('מחיר', '44.5')
    await typeInto('הערה', 'עם ביצה')
    await pressText('שמירה')

    await waitFor(async () =>
      expect((await allDishes()).find((dish) => dish.id === dishId)).toMatchObject({
        verdict: 'good',
        price: 44.5,
        note: 'עם ביצה',
      }),
    )
  })

  it('clears a verdict when it is pressed again', async () => {
    const { visitId, dishId } = await seedVisit()

    await updateDish({ id: dishId, visitId, name: 'חומוס', verdict: 'fine', createdAt: NOW })
    renderAt(visitsStackVisitPath(visitId))
    await press(/חומוס/)
    await press('בסדר')
    await pressText('שמירה')

    await waitFor(async () => expect((await allDishes())[0].verdict).toBeUndefined())
  })

  it('saves a kind or date change at once and refuses future dates', async () => {
    const { visitId } = await seedVisit()

    renderAt(visitsStackVisitPath(visitId))
    await press('איסוף')
    await waitFor(async () => expect((await allVisits())[0].kind).toBe('takeaway'))

    await typeInto('תאריך', '2026-11-01')
    await waitFor(async () => expect((await allVisits())[0].visitedOn).toBe('2026-11-01'))

    await typeInto('תאריך', '2026-11-12')
    expect(screen.getByLabelText('תאריך')).toHaveValue('2026-11-01')
    expect((await allVisits())[0].visitedOn).toBe('2026-11-01')
  })

  it('accepts the new day as today when the screen stays open past midnight', async () => {
    const { visitId } = await seedVisit()

    renderAt(visitsStackVisitPath(visitId))
    expect(await screen.findByLabelText('תאריך')).toHaveValue('2026-11-08')

    vi.setSystemTime(new Date(2026, 10, 11, 0, 30))
    await typeInto('תאריך', '2026-11-11')

    await waitFor(async () => expect((await allVisits())[0].visitedOn).toBe('2026-11-11'))
  })

  it('deletes the visit with its dishes after confirming, then opens the restaurant', async () => {
    const { visitId, restaurantId } = await seedVisit()

    renderAt(restaurantsStackVisitPath(visitId))
    await press('מחיקת הביקור')
    await alertShown()
    clickAlertButton('מחיקה')

    await waitFor(async () => expect(await allVisits()).toHaveLength(0))
    expect(await allDishes()).toHaveLength(0)
    await waitFor(() => expect(currentPath()).toBe(restaurantPath(restaurantId)))
  })

  it('returns to the visits list after deleting a visit opened from there', async () => {
    const { visitId } = await seedVisit()

    renderAt(visitsStackVisitPath(visitId))
    await press('מחיקת הביקור')
    await alertShown()
    clickAlertButton('מחיקה')

    await waitFor(async () => expect(await allVisits()).toHaveLength(0))
    await waitFor(() => expect(currentPath()).toBe(VISITS_PATH))
    expect(selectedTab()).toBe('visits')
  })
})
