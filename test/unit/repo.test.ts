import { beforeEach, describe, expect, it } from 'vitest'
import {
  addDish,
  addRestaurant,
  addVisit,
  addVisitWithDish,
  allDishes,
  allRestaurants,
  allVisits,
  deleteDish,
  deleteRestaurant,
  deleteVisit,
  dishPhoto,
  dishThumbnail,
  setDishPhoto,
  updateDish,
  updateRestaurant,
  updateVisit,
} from '../../src/data/repo'
import type { ShrunkPhoto } from '../../src/domain/types'
import { resetDb } from '../helpers/db'
import { shrunkPhoto } from '../helpers/photo'

const NOW = new Date(2026, 10, 10, 20, 15).getTime()

const TOMORROW = '2026-11-11'

const photoBytes = () => new Uint8Array([1, 2, 3]).buffer

const thumbnailBytes = () => new Uint8Array([4, 5]).buffer

const takenPhoto = () => shrunkPhoto(photoBytes(), thumbnailBytes())

describe('repo', () => {
  beforeEach(resetDb)

  it('adds a restaurant with a trimmed name, a new id and its creation time', async () => {
    const id = await addRestaurant({ name: '  מזנון הנמל ', city: 'חיפה' }, NOW)

    expect(await allRestaurants()).toEqual([{ id, name: 'מזנון הנמל', city: 'חיפה', createdAt: NOW }])
  })

  it('adds a visit and a dish with its photo and thumbnail kept apart from the dish', async () => {
    const restaurantId = await addRestaurant({ name: 'מזנון הנמל' }, NOW)
    const visitId = await addVisit({ restaurantId, visitedOn: '2026-11-03', kind: 'dineIn' }, NOW)
    const dishId = await addDish({ visitId, name: 'סביח', price: 42 }, takenPhoto(), NOW)

    expect(await allVisits()).toEqual([
      { id: visitId, restaurantId, visitedOn: '2026-11-03', kind: 'dineIn', createdAt: NOW },
    ])
    expect(await allDishes()).toEqual([
      { id: dishId, visitId, name: 'סביח', price: 42, hasPhoto: true, createdAt: NOW },
    ])
    expect(await dishPhoto(dishId)).toEqual(photoBytes())
    expect(await dishThumbnail(dishId)).toEqual(thumbnailBytes())
  })

  it('saves a new visit together with its first dish', async () => {
    const restaurantId = await addRestaurant({ name: 'מזנון הנמל' }, NOW)

    const { visitId, dishId } = await addVisitWithDish(
      { restaurantId, visitedOn: '2026-11-03', kind: 'delivery' },
      { name: 'סביח' },
      takenPhoto(),
      NOW,
    )

    expect(await allVisits()).toEqual([
      { id: visitId, restaurantId, visitedOn: '2026-11-03', kind: 'delivery', createdAt: NOW },
    ])
    expect(await allDishes()).toEqual([{ id: dishId, visitId, name: 'סביח', hasPhoto: true, createdAt: NOW }])
    expect(await dishPhoto(dishId)).toEqual(photoBytes())
    expect(await dishThumbnail(dishId)).toEqual(thumbnailBytes())
  })

  it('writes neither the visit nor the dish when the dish is invalid', async () => {
    const restaurantId = await addRestaurant({ name: 'מזנון הנמל' }, NOW)

    await expect(
      addVisitWithDish({ restaurantId, visitedOn: '2026-11-03', kind: 'dineIn' }, { name: '  ' }, undefined, NOW),
    ).rejects.toThrow()
    expect(await allVisits()).toEqual([])
    expect(await allDishes()).toEqual([])
  })

  it('saves a new restaurant together with its first visit and dish', async () => {
    const { restaurantId, visitId, dishId } = await addVisitWithDish(
      { newRestaurant: { name: ' מיזנון ', city: 'תל אביב' }, visitedOn: '2026-11-03', kind: 'dineIn' },
      { name: 'כרובית' },
      undefined,
      NOW,
    )

    expect(await allRestaurants()).toEqual([{ id: restaurantId, name: 'מיזנון', city: 'תל אביב', createdAt: NOW }])
    expect(await allVisits()).toEqual([
      { id: visitId, restaurantId, visitedOn: '2026-11-03', kind: 'dineIn', createdAt: NOW },
    ])
    expect(await allDishes()).toEqual([{ id: dishId, visitId, name: 'כרובית', createdAt: NOW }])
  })

  it('writes neither the new restaurant nor the visit when the dish is invalid', async () => {
    await expect(
      addVisitWithDish(
        { newRestaurant: { name: 'מיזנון' }, visitedOn: '2026-11-03', kind: 'dineIn' },
        { name: '  ' },
        undefined,
        NOW,
      ),
    ).rejects.toThrow()
    expect(await allRestaurants()).toEqual([])
    expect(await allVisits()).toEqual([])
  })

  it('refuses a visit dated after today, alone or with its first dish', async () => {
    const restaurantId = await addRestaurant({ name: 'מזנון הנמל' }, NOW)

    await expect(addVisit({ restaurantId, visitedOn: TOMORROW, kind: 'dineIn' }, NOW)).rejects.toThrow()
    await expect(
      addVisitWithDish({ restaurantId, visitedOn: TOMORROW, kind: 'dineIn' }, { name: 'סביח' }, undefined, NOW),
    ).rejects.toThrow()
    expect(await allVisits()).toEqual([])
    expect(await allDishes()).toEqual([])
  })

  it('accepts a visit dated today', async () => {
    const restaurantId = await addRestaurant({ name: 'מזנון הנמל' }, NOW)

    await addVisit({ restaurantId, visitedOn: '2026-11-10', kind: 'dineIn' }, NOW)

    expect(await allVisits()).toHaveLength(1)
  })

  it('refuses a price with more than two decimals or below zero', async () => {
    const restaurantId = await addRestaurant({ name: 'מזנון הנמל' }, NOW)
    const visitId = await addVisit({ restaurantId, visitedOn: '2026-11-03', kind: 'dineIn' }, NOW)

    await expect(addDish({ visitId, name: 'סביח', price: 42.555 }, undefined, NOW)).rejects.toThrow()
    await expect(addDish({ visitId, name: 'סביח', price: -1 }, undefined, NOW)).rejects.toThrow()
    await addDish({ visitId, name: 'סביח', price: 0.29 }, undefined, NOW)

    expect((await allDishes()).map((saved) => saved.price)).toEqual([0.29])
  })

  it('drops blank optional text, so an empty form field is not stored', async () => {
    const id = await addRestaurant({ name: 'נונה רוזה', city: '  ', cuisine: '', note: ' ' }, NOW)

    expect(await allRestaurants()).toEqual([{ id, name: 'נונה רוזה', createdAt: NOW }])
  })

  describe('editing', () => {
    async function dishAtNewVisit(photo?: ShrunkPhoto) {
      const restaurantId = await addRestaurant({ name: 'מזנון הנמל' }, NOW)
      const visitId = await addVisit({ restaurantId, visitedOn: '2026-11-03', kind: 'dineIn' }, NOW)

      return addDish({ visitId, name: 'שקשוקה', price: 58 }, photo, NOW)
    }

    it('rates a dish later, keeping everything else', async () => {
      const dishId = await dishAtNewVisit(takenPhoto())
      const [saved] = await allDishes()

      await updateDish({ ...saved, verdict: 'must', note: ' חריפה ' })

      expect(await allDishes()).toEqual([{ ...saved, verdict: 'must', note: 'חריפה' }])
      expect(await dishPhoto(dishId)).toEqual(photoBytes())
    })

    it('replaces a dish photo and its thumbnail', async () => {
      const dishId = await dishAtNewVisit(takenPhoto())
      const replacement = shrunkPhoto(new Uint8Array([9]).buffer, new Uint8Array([8]).buffer)

      await setDishPhoto(dishId, replacement)

      expect(await dishPhoto(dishId)).toEqual(replacement.photo)
      expect(await dishThumbnail(dishId)).toEqual(replacement.thumbnail)
      expect((await allDishes())[0].hasPhoto).toBe(true)
    })

    it('removes a dish photo with its thumbnail', async () => {
      const dishId = await dishAtNewVisit(takenPhoto())

      await setDishPhoto(dishId, undefined)

      expect(await dishPhoto(dishId)).toBeUndefined()
      expect(await dishThumbnail(dishId)).toBeUndefined()
      expect((await allDishes())[0].hasPhoto).toBeUndefined()
    })

    it('updates a visit and a restaurant', async () => {
      await dishAtNewVisit()
      const [savedVisit] = await allVisits()
      const [savedRestaurant] = await allRestaurants()

      await updateVisit({ ...savedVisit, visitedOn: '2026-11-02', kind: 'takeaway' }, NOW)
      await updateRestaurant({ ...savedRestaurant, wouldReturn: 'yes', note: 'להזמין מקום' })

      expect(await allVisits()).toEqual([{ ...savedVisit, visitedOn: '2026-11-02', kind: 'takeaway' }])
      expect(await allRestaurants()).toEqual([{ ...savedRestaurant, wouldReturn: 'yes', note: 'להזמין מקום' }])
    })

    it('refuses to move a visit to a day after today', async () => {
      await dishAtNewVisit()
      const [savedVisit] = await allVisits()

      await expect(updateVisit({ ...savedVisit, visitedOn: TOMORROW }, NOW)).rejects.toThrow()
      expect(await allVisits()).toEqual([savedVisit])
    })
  })

  describe('deleting', () => {
    async function twoVisitsWithPhotos() {
      const restaurantId = await addRestaurant({ name: 'ראמן קאזה' }, NOW)
      const otherRestaurantId = await addRestaurant({ name: 'נונה רוזה' }, NOW)
      const visitId = await addVisit({ restaurantId, visitedOn: '2026-10-28', kind: 'dineIn' }, NOW)
      const otherVisitId = await addVisit({ restaurantId: otherRestaurantId, visitedOn: '2026-10-12', kind: 'delivery' }, NOW)
      const dishId = await addDish({ visitId, name: 'ראמן מיסו' }, takenPhoto(), NOW)
      const otherDishId = await addDish({ visitId: otherVisitId, name: 'ניוקי' }, takenPhoto(), NOW)

      return { restaurantId, visitId, dishId, otherVisitId, otherDishId }
    }

    it('removes a dish with its photo', async () => {
      const { dishId, otherDishId } = await twoVisitsWithPhotos()

      await deleteDish(dishId)

      expect((await allDishes()).map((dish) => dish.id)).toEqual([otherDishId])
      expect(await dishPhoto(dishId)).toBeUndefined()
      expect(await dishThumbnail(dishId)).toBeUndefined()
    })

    it('removes the visit together with its last dish', async () => {
      const { visitId, dishId, otherVisitId } = await twoVisitsWithPhotos()
      const keptDishId = await addDish({ visitId, name: 'גיוזה' }, undefined, NOW)

      await deleteDish(dishId)
      expect((await allVisits()).map((visit) => visit.id).sort()).toEqual([visitId, otherVisitId].sort())

      await deleteDish(keptDishId)
      expect((await allVisits()).map((visit) => visit.id)).toEqual([otherVisitId])
    })

    it('removes a visit with its dishes and their photos, leaving other visits alone', async () => {
      const { visitId, dishId, otherVisitId, otherDishId } = await twoVisitsWithPhotos()

      await deleteVisit(visitId)

      expect((await allVisits()).map((visit) => visit.id)).toEqual([otherVisitId])
      expect((await allDishes()).map((dish) => dish.id)).toEqual([otherDishId])
      expect(await dishPhoto(dishId)).toBeUndefined()
      expect(await dishThumbnail(dishId)).toBeUndefined()
      expect(await dishPhoto(otherDishId)).toEqual(photoBytes())
      expect(await dishThumbnail(otherDishId)).toEqual(thumbnailBytes())
    })

    it('removes a restaurant with its visits, dishes and photos', async () => {
      const { restaurantId, dishId, otherVisitId, otherDishId } = await twoVisitsWithPhotos()

      await deleteRestaurant(restaurantId)

      expect((await allRestaurants()).map((restaurant) => restaurant.name)).toEqual(['נונה רוזה'])
      expect((await allVisits()).map((visit) => visit.id)).toEqual([otherVisitId])
      expect((await allDishes()).map((dish) => dish.id)).toEqual([otherDishId])
      expect(await dishPhoto(dishId)).toBeUndefined()
      expect(await dishThumbnail(dishId)).toBeUndefined()
    })
  })
})
