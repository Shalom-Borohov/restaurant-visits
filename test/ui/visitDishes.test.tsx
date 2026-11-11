import { fireEvent, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { addDish, addRestaurant, addVisit, allDishes, allVisits } from '../../src/data/repo'
import { newVisitAtPath, restaurantPath, restaurantsStackVisitPath, visitsStackVisitPath } from '../../src/navigation/paths'
import { shrinkPhoto } from '../../src/photo/shrink'
import { freezeDate } from '../helpers/clock'
import { resetDb } from '../helpers/db'
import { alertMessage, alertShown, clickAlertButton } from '../helpers/overlays'
import { cameraPhoto, stubObjectUrls } from '../helpers/photo'
import { currentPath, renderAt } from '../helpers/renderAt'

vi.mock('../../src/photo/shrink', () => ({ shrinkPhoto: vi.fn() }))

const NOW = new Date(2026, 10, 10, 20, 15).getTime()

const press = async (name: string | RegExp) => fireEvent.click(await screen.findByRole('button', { name }))

const toasts = () => Array.from(document.querySelectorAll('ion-toast'), (toast) => toast.message)

async function seedVisit(dishNames: string[]) {
  const restaurantId = await addRestaurant({ name: 'Abu Hassan' }, NOW)
  const visitId = await addVisit({ restaurantId, visitedOn: '2026-11-08', kind: 'dineIn' }, NOW)

  for (const name of dishNames) {
    await addDish({ visitId, name }, undefined, NOW)
  }

  return { restaurantId, visitId }
}

async function deleteDishNamed(name: string) {
  await press(new RegExp(name))
  await press('מחיקת המנה')
  await alertShown()
}

describe('deleting a dish', () => {
  beforeEach(resetDb)
  freezeDate(NOW)

  it('keeps the visit when other dishes remain', async () => {
    const { visitId } = await seedVisit(['חומוס', 'פול'])

    renderAt(visitsStackVisitPath(visitId))
    await deleteDishNamed('חומוס')
    expect(alertMessage()).toBe('גם התמונה שלה תימחק.')
    clickAlertButton('מחיקה')

    await waitFor(async () => expect((await allDishes()).map((dish) => dish.name)).toEqual(['פול']))
    expect(await allVisits()).toHaveLength(1)
    expect(currentPath()).toBe(visitsStackVisitPath(visitId))
  })

  it('deletes the visit with its last dish, says so first, then opens the restaurant', async () => {
    const { restaurantId, visitId } = await seedVisit(['חומוס'])

    renderAt(restaurantsStackVisitPath(visitId))
    await deleteDishNamed('חומוס')
    expect(alertMessage()).toMatch(/גם הביקור יימחק/)
    clickAlertButton('מחיקה')

    await waitFor(async () => expect(await allVisits()).toHaveLength(0))
    expect(await allDishes()).toHaveLength(0)
    await waitFor(() => expect(currentPath()).toBe(restaurantPath(restaurantId)))
  })
})

describe('a camera photo that cannot be read', () => {
  beforeEach(resetDb)
  freezeDate(NOW)
  stubObjectUrls()

  it('opens the dish sheet without a photo and says so', async () => {
    vi.mocked(shrinkPhoto).mockRejectedValue(new Error('unreadable photo'))

    const restaurantId = await addRestaurant({ name: 'Abu Hassan' }, NOW)

    renderAt(newVisitAtPath(restaurantId))
    fireEvent.change(await screen.findByLabelText('צילום מנה'), { target: { files: [cameraPhoto()] } })

    expect(await screen.findByText('מנה חדשה')).toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    await waitFor(() => expect(toasts()).toContain('התמונה לא נטענה, אפשר להוסיף מנה בלי תמונה'))
  })
})
