import { fireEvent, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { addDish, addRestaurant, addVisit, allDishes, allRestaurants, allVisits } from '../../src/data/repo'
import { NEW_VISIT_PATH, restaurantPath, restaurantsStackVisitPath, visitsStackVisitPath } from '../../src/navigation/paths'
import { freezeDate } from '../helpers/clock'
import { resetDb } from '../helpers/db'
import { ionElement } from '../helpers/ionic'
import { currentPath, renderAt } from '../helpers/renderAt'

const NOW = new Date(2026, 10, 10, 20, 15).getTime()

const WITHOUT_PHOTO = 'מנה בלי תמונה'

const press = async (name: string | RegExp) => fireEvent.click(await screen.findByRole('button', { name }))

const pressText = async (text: string) => fireEvent.click(await screen.findByText(text))

const typeInto = async (label: string, text: string) =>
  fireEvent.change(await screen.findByLabelText(label), { target: { value: text } })

async function draftRestaurant(name: string) {
  renderAt(NEW_VISIT_PATH)
  await press('מסעדה חדשה')
  await typeInto('שם המסעדה', name)
  await press('המשך')

  const shownTitle = await ionElement('ion-title')

  await waitFor(() => expect(shownTitle).toHaveTextContent(name))
}

describe('a new restaurant while logging', () => {
  beforeEach(resetDb)
  freezeDate(NOW)

  it('saves nothing when the visit is left before its first dish', async () => {
    await draftRestaurant('Miznon')
    await press(WITHOUT_PHOTO)
    await pressText('ביטול')
    await pressText('מסעדות')

    await waitFor(() => expect(currentPath()).toBe('/tabs/restaurants'))
    expect(await allRestaurants()).toEqual([])
    expect(await allVisits()).toEqual([])
  })

  it('saves the restaurant, the visit and the dish together with the first dish, then opens the visit', async () => {
    await draftRestaurant('Miznon')
    expect(await allRestaurants()).toEqual([])
    await press(WITHOUT_PHOTO)
    await typeInto('שם המנה', 'כרובית')
    await pressText('שמירה')

    await waitFor(async () => expect(await allVisits()).toHaveLength(1))

    const [created] = await allRestaurants()
    const [saved] = await allVisits()

    expect(created.name).toBe('Miznon')
    expect(saved.restaurantId).toBe(created.id)
    expect(await allDishes()).toMatchObject([{ visitId: saved.id, name: 'כרובית' }])
    await waitFor(() => expect(currentPath()).toBe(restaurantsStackVisitPath(saved.id)))
  })
})

describe('moving a visit', () => {
  beforeEach(resetDb)
  freezeDate(NOW)

  it('moves a saved visit to another restaurant through the picker', async () => {
    const fromId = await addRestaurant({ name: 'Abu Hassan' }, NOW)
    const toId = await addRestaurant({ name: 'Port Said' }, NOW)
    const visitId = await addVisit({ restaurantId: fromId, visitedOn: '2026-11-08', kind: 'dineIn' }, NOW)

    await addDish({ visitId, name: 'חומוס' }, undefined, NOW)

    const visitScreen = renderAt(visitsStackVisitPath(visitId))

    await press(/מסעדה.*Abu Hassan/)
    expect(screen.queryByRole('button', { name: 'מסעדה חדשה' })).not.toBeInTheDocument()
    await press(/Port Said/)

    await waitFor(async () => expect((await allVisits())[0].restaurantId).toBe(toId))
    visitScreen.unmount()

    const newRestaurantScreen = renderAt(restaurantPath(toId))

    expect(await screen.findByRole('button', { name: /מנה אחת/ })).toBeInTheDocument()
    newRestaurantScreen.unmount()

    renderAt(restaurantPath(fromId))
    expect(await screen.findByText('עוד אין ביקורים')).toBeInTheDocument()
  })
})
