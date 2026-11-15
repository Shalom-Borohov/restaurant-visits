import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { addDish, addRestaurant, addVisit } from '../../src/data/repo'
import { resetDb } from '../helpers/db'
import { expectInOrder } from '../helpers/ionic'
import { shrunkPhoto, stubObjectUrls } from '../helpers/photo'
import { currentPath, renderAt } from '../helpers/renderAt'

const NOW = new Date(2026, 10, 10, 20, 15).getTime()

const LATER = NOW + 1

const takenPhoto = () => shrunkPhoto(new Uint8Array([1, 2, 3]).buffer, new Uint8Array([4]).buffer)

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

  describe('photos on a row', () => {
    stubObjectUrls()

    it('shows the first four dish photos of a visit and how many more there are', async () => {
      const rosa = await addRestaurant({ name: 'נונה רוזה' }, NOW)
      const visitId = await addVisit({ restaurantId: rosa, visitedOn: '2026-11-03', kind: 'dineIn' }, NOW)

      const names = ['שקשוקה', 'חומוס', 'סביח', 'פלאפל', 'מלבי', 'סלט']

      for (const [order, name] of names.entries()) {
        await addDish({ visitId, name }, takenPhoto(), NOW + order)
      }

      renderAt('/tabs/visits')

      const [row] = await visitRow('נונה רוזה')

      expect(await within(row).findByRole('img', { name: 'פלאפל' })).toBeVisible()
      expect(within(row).getAllByRole('img').map((photo) => photo.getAttribute('alt'))).toEqual([
        'שקשוקה',
        'חומוס',
        'סביח',
        'פלאפל',
      ])
      expect(within(row).getByText('+2')).toBeVisible()
    })

    it('never fades a photo on a row, whatever the verdict', async () => {
      const rosa = await addRestaurant({ name: 'נונה רוזה' }, NOW)
      const visitId = await addVisit({ restaurantId: rosa, visitedOn: '2026-11-03', kind: 'dineIn' }, NOW)

      await addDish({ visitId, name: 'פיצה', verdict: 'avoid' }, takenPhoto(), NOW)
      await addDish({ visitId, name: 'סלט', verdict: 'weak' }, takenPhoto(), NOW)
      renderAt('/tabs/visits')

      const [row] = await visitRow('נונה רוזה')

      expect(await within(row).findByRole('img', { name: 'פיצה' })).toBeVisible()
      expect(within(row).getByRole('img', { name: 'סלט' })).toBeVisible()
      expect(row.querySelector('.dish-photo-fade-dark, .dish-photo-fade-dim')).toBeNull()
      expect(within(row).queryByText(/^\+/)).not.toBeInTheDocument()
    })
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
