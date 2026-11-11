import { fireEvent, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { addDish, addRestaurant, addVisit, allDishes, dishPhoto, dishThumbnail } from '../../src/data/repo'
import { newVisitAtPath, visitsStackVisitPath } from '../../src/navigation/paths'
import { freezeDate } from '../helpers/clock'
import { resetDb } from '../helpers/db'
import { modalDismissed } from '../helpers/overlays'
import { cameraPhoto, PHOTO_URL, shrunkPhoto, stubObjectUrls } from '../helpers/photo'
import { renderAt } from '../helpers/renderAt'

const { SHRUNK_BYTES, THUMBNAIL_BYTES } = vi.hoisted(() => ({ SHRUNK_BYTES: [1, 2, 3], THUMBNAIL_BYTES: [4] }))

vi.mock('../../src/photo/shrink', () => ({
  shrinkPhoto: async () => ({
    photo: new Uint8Array(SHRUNK_BYTES).buffer,
    thumbnail: new Uint8Array(THUMBNAIL_BYTES).buffer,
  }),
}))

const NOW = new Date(2026, 10, 10, 20, 15).getTime()

const WITHOUT_PHOTO = 'מנה בלי תמונה'

const DISH_CAMERA = 'צילום מנה'

const NEW_DISH_TITLE = 'מנה חדשה'

const press = async (name: string | RegExp) => fireEvent.click(await screen.findByRole('button', { name }))

const pressText = async (text: string) => fireEvent.click(await screen.findByText(text))

const typeInto = async (label: string, text: string) =>
  fireEvent.change(await screen.findByLabelText(label), { target: { value: text } })

const shrunkBytes = () => new Uint8Array(SHRUNK_BYTES).buffer

const thumbnailBytes = () => new Uint8Array(THUMBNAIL_BYTES).buffer

const pickPhoto = async (label: string) =>
  fireEvent.change(await screen.findByLabelText(label), { target: { files: [cameraPhoto()] } })

describe('dish photos', () => {
  beforeEach(resetDb)
  freezeDate(NOW)
  stubObjectUrls()

  it('opens the rear camera with one tap from the visit screen, images only', async () => {
    const restaurantId = await addRestaurant({ name: 'Abu Hassan' }, NOW)

    renderAt(newVisitAtPath(restaurantId))

    expect(await screen.findByLabelText(DISH_CAMERA)).toHaveAttribute('capture', 'environment')
    expect(screen.getByLabelText(DISH_CAMERA)).toHaveAttribute('accept', 'image/*')
  })

  it('opens the sheet without a photo from the smaller button, with the camera and library still there', async () => {
    const restaurantId = await addRestaurant({ name: 'Abu Hassan' }, NOW)

    renderAt(newVisitAtPath(restaurantId))
    await press(WITHOUT_PHOTO)

    expect(await screen.findByText(NEW_DISH_TITLE)).toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(screen.getByLabelText('צילום')).toHaveAttribute('capture', 'environment')
    expect(screen.getByLabelText('צילום')).toHaveAttribute('accept', 'image/*')
    expect(screen.getByLabelText('מהגלריה')).not.toHaveAttribute('capture')
    expect(screen.getByLabelText('מהגלריה')).toHaveAttribute('accept', 'image/*')
  })

  it('opens nothing when the camera is cancelled', async () => {
    const restaurantId = await addRestaurant({ name: 'Abu Hassan' }, NOW)

    renderAt(newVisitAtPath(restaurantId))
    fireEvent.change(await screen.findByLabelText(DISH_CAMERA), { target: { files: [] } })

    await new Promise((resolve) => setTimeout(resolve))
    expect(screen.queryByText(NEW_DISH_TITLE)).not.toBeInTheDocument()
  })

  it('opens the sheet with the shrunk camera photo in place, then stores it with the new dish', async () => {
    const restaurantId = await addRestaurant({ name: 'Abu Hassan' }, NOW)

    renderAt(newVisitAtPath(restaurantId))
    await pickPhoto(DISH_CAMERA)
    expect(await screen.findByText(NEW_DISH_TITLE)).toBeInTheDocument()
    await typeInto('שם המנה', 'חומוס')
    expect(await screen.findByRole('img', { name: 'חומוס' })).toHaveAttribute('src', PHOTO_URL)
    await pressText('שמירה')

    await waitFor(async () => expect(await allDishes()).toHaveLength(1))
    const [saved] = await allDishes()

    expect(saved.hasPhoto).toBe(true)
    expect(await dishPhoto(saved.id)).toEqual(shrunkBytes())
    expect(await dishThumbnail(saved.id)).toEqual(thumbnailBytes())
  })

  it('replaces and removes the photo of an existing dish', async () => {
    const restaurantId = await addRestaurant({ name: 'Abu Hassan' }, NOW)
    const visitId = await addVisit({ restaurantId, visitedOn: '2026-11-08', kind: 'delivery' }, NOW)
    const keptPhoto = shrunkPhoto(new Uint8Array([7]).buffer, new Uint8Array([6]).buffer)
    const dishId = await addDish({ visitId, name: 'חומוס' }, keptPhoto, NOW)

    renderAt(visitsStackVisitPath(visitId))
    await press(/חומוס/)
    await pickPhoto('מהגלריה')

    const dismissed = modalDismissed()

    await pressText('שמירה')
    await dismissed
    expect(await dishPhoto(dishId)).toEqual(shrunkBytes())
    expect(await dishThumbnail(dishId)).toEqual(thumbnailBytes())

    await press(/חומוס/)
    await pressText('הסרת התמונה')
    await pressText('שמירה')
    await waitFor(async () => expect(await dishPhoto(dishId)).toBeUndefined())
    expect((await allDishes())[0].hasPhoto).toBeUndefined()
  })
})
