import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { addDish, addRestaurant, addVisit } from '../../src/data/repo'
import { resetDb } from '../helpers/db'
import { expectInOrder } from '../helpers/ionic'
import { currentPath, renderAt } from '../helpers/renderAt'

const NOW = new Date(2026, 10, 10, 20, 15).getTime()

const LATER = NOW + 1

const visitRow = (restaurantName: string) => screen.findAllByRole('link', { name: new RegExp(restaurantName) })

async function seedVisits() {
  const harbour = await addRestaurant({ name: 'מזנון הנמל' }, NOW)
  const rosa = await addRestaurant({ name: 'נונה רוזה' }, NOW)
  const early = await addVisit({ restaurantId: harbour, visitedOn: '2026-10-20', kind: 'dineIn' }, NOW)
  const delivery = await addVisit({ restaurantId: rosa, visitedOn: '2026-11-03', kind: 'delivery' }, NOW)
  const sameDayLater = await addVisit({ restaurantId: harbour, visitedOn: '2026-11-03', kind: 'takeaway' }, LATER)

  await addDish({ visitId: early, name: 'סביח', price: 42 }, undefined, NOW)
  await addDish({ visitId: delivery, name: 'פיצה', price: 64 }, undefined, NOW)
  await addDish({ visitId: delivery, name: 'סלט', price: 36 }, undefined, NOW)
  await addDish({ visitId: sameDayLater, name: 'חומוס' }, undefined, NOW)

  return { sameDayLater }
}

describe('visits', () => {
  beforeEach(resetDb)

  it('lists visits newest first under month headings, with kind, dish count and total', async () => {
    await seedVisits()
    renderAt('/tabs/visits')

    await expectInOrder(['נובמבר 2026', 'איסוף', 'משלוח', 'אוקטובר 2026', 'במקום'])

    const [rosaRow] = await visitRow('נונה רוזה')

    expect(within(rosaRow).getByText('2 מנות')).toBeVisible()
    expect(within(rosaRow).getByText('₪100')).toBeVisible()
    expect(within(rosaRow).getByText('3 בנוב׳')).toBeVisible()

    const [takeawayRow] = await visitRow('מזנון הנמל')

    expect(within(takeawayRow).getByText('מנה אחת')).toBeVisible()
    expect(within(takeawayRow).queryByText(/₪/)).not.toBeInTheDocument()
  })

  it('shows the first plates of a visit and how many more there are', async () => {
    const rosa = await addRestaurant({ name: 'נונה רוזה' }, NOW)
    const visitId = await addVisit({ restaurantId: rosa, visitedOn: '2026-11-03', kind: 'dineIn' }, NOW)

    for (const name of ['א', 'ב', 'ג', 'ד', 'ה', 'ו']) {
      await addDish({ visitId, name }, undefined, NOW)
    }

    renderAt('/tabs/visits')

    const [row] = await visitRow('נונה רוזה')

    expect(row.querySelectorAll('.plate')).toHaveLength(4)
    expect(within(row).getByText('+2')).toBeVisible()
  })

  it('gives the row plates a plain rim with no verdict colour', async () => {
    const rosa = await addRestaurant({ name: 'נונה רוזה' }, NOW)
    const visitId = await addVisit({ restaurantId: rosa, visitedOn: '2026-11-03', kind: 'dineIn' }, NOW)

    await addDish({ visitId, name: 'פיצה', verdict: 'must' }, undefined, NOW)
    await addDish({ visitId, name: 'סלט' }, undefined, NOW)
    renderAt('/tabs/visits')

    const [row] = await visitRow('נונה רוזה')
    const plates = Array.from(row.querySelectorAll('.plate'))

    expect(plates).toHaveLength(2)
    plates.forEach((plate) => expect(plate.className).toMatch(/\bplate-rim-plain\b/))
    expect(row.querySelector('.plate-rim-must, .plate-rim-unrated')).toBeNull()
  })

  it('opens a visit when tapped', async () => {
    const { sameDayLater } = await seedVisits()

    renderAt('/tabs/visits')

    const [takeawayRow] = await visitRow('מזנון הנמל')

    fireEvent.click(takeawayRow)

    await waitFor(() => expect(currentPath()).toBe(`/tabs/visits/${sameDayLater}`))
  })

  it('points to the restaurants tab when there are no visits', async () => {
    renderAt('/tabs/visits')

    expect(await screen.findByText(/עדיין אין ביקורים/)).toBeVisible()
  })
})
