import { parse } from 'valibot'
import {
  type Dish,
  dishSchema,
  type Restaurant,
  restaurantSchema,
  type ShrunkPhoto,
  type Visit,
  visitSchema,
} from '../domain/types'
import { isAfterToday, todayVisitDate } from '../domain/visitDate'
import { allTables, db, photoTables } from './db'

type Created = 'id' | 'createdAt'

export type RestaurantDraft = Omit<Restaurant, Created>

export type VisitDraft = Omit<Visit, Created>

export type DishDraft = Omit<Dish, Created | 'hasPhoto'>

export type NewDishFields = Omit<DishDraft, 'visitId'>

export const allRestaurants = () => db.restaurants.toArray()

export const allVisits = () => db.visits.toArray()

export const allDishes = () => db.dishes.toArray()

export async function dishPhoto(dishId: string) {
  const photo = await db.photos.get(dishId)

  return photo?.bytes
}

export async function dishThumbnail(dishId: string) {
  const thumbnail = await db.thumbnails.get(dishId)

  return thumbnail?.bytes
}

const putPhoto = (dishId: string, { photo, thumbnail }: ShrunkPhoto) =>
  db.photos.put({ dishId, bytes: photo }).then(() => db.thumbnails.put({ dishId, bytes: thumbnail }))

export async function addRestaurant(draft: RestaurantDraft, now: number) {
  const id = crypto.randomUUID()

  await db.restaurants.add(parse(restaurantSchema, { ...draft, id, createdAt: now }))

  return id
}

function pastVisit(visit: Visit, now: number) {
  const parsed = parse(visitSchema, visit)

  if (isAfterToday(parsed.visitedOn, todayVisitDate(new Date(now)))) {
    throw new Error('a visit cannot be dated after today')
  }

  return parsed
}

export async function addVisit(draft: VisitDraft, now: number) {
  const id = crypto.randomUUID()

  await db.visits.add(pastVisit({ ...draft, id, createdAt: now }, now))

  return id
}

async function writeDish(draft: DishDraft, photo: ShrunkPhoto | undefined, now: number) {
  const id = crypto.randomUUID()

  await db.dishes.add(parse(dishSchema, { ...draft, id, createdAt: now, ...(photo && { hasPhoto: true }) }))

  if (photo) {
    await putPhoto(id, photo)
  }

  return id
}

export const addDish = (draft: DishDraft, photo: ShrunkPhoto | undefined, now: number) =>
  db.transaction('rw', photoTables(), () => writeDish(draft, photo, now))

export type VisitRestaurant = Pick<VisitDraft, 'restaurantId'> | { newRestaurant: RestaurantDraft }

type VisitWithRestaurantDraft = Omit<VisitDraft, 'restaurantId'> & VisitRestaurant

async function visitRestaurantId(visitDraft: VisitWithRestaurantDraft, now: number) {
  if ('newRestaurant' in visitDraft) {
    return addRestaurant(visitDraft.newRestaurant, now)
  }

  return visitDraft.restaurantId
}

export const addVisitWithDish = (
  visitDraft: VisitWithRestaurantDraft,
  dishDraft: NewDishFields,
  photo: ShrunkPhoto | undefined,
  now: number,
) =>
  db.transaction('rw', allTables(), async () => {
    const restaurantId = await visitRestaurantId(visitDraft, now)
    const visitId = await addVisit({ restaurantId, visitedOn: visitDraft.visitedOn, kind: visitDraft.kind }, now)
    const dishId = await writeDish({ ...dishDraft, visitId }, photo, now)

    return { restaurantId, visitId, dishId }
  })

export async function updateRestaurant(restaurant: Restaurant) {
  await db.restaurants.put(parse(restaurantSchema, restaurant))
}

export async function updateVisit(visit: Visit, now: number) {
  await db.visits.put(pastVisit(visit, now))
}

export async function updateDish(dish: Dish) {
  await db.dishes.put(parse(dishSchema, dish))
}

const deletePhotos = (dishIds: string[]) =>
  db.photos.bulkDelete(dishIds).then(() => db.thumbnails.bulkDelete(dishIds))

export const setDishPhoto = (dishId: string, photo: ShrunkPhoto | undefined) =>
  db.transaction('rw', photoTables(), async () => {
    if (photo) {
      await putPhoto(dishId, photo)
      await db.dishes.update(dishId, { hasPhoto: true })

      return
    }

    await deletePhotos([dishId])
    await db.dishes.update(dishId, { hasPhoto: undefined })
  })

async function deleteDishes(dishIds: string[]) {
  await db.dishes.bulkDelete(dishIds)
  await deletePhotos(dishIds)
}

async function deleteVisits(visitIds: string[]) {
  const dishIds = await db.dishes.where('visitId').anyOf(visitIds).primaryKeys()

  await deleteDishes(dishIds)
  await db.visits.bulkDelete(visitIds)
}

const NO_DISHES = 0

export const deleteDish = (dishId: string) =>
  db.transaction('rw', [db.visits, ...photoTables()], async () => {
    const dish = await db.dishes.get(dishId)

    await deleteDishes([dishId])

    if (dish && (await db.dishes.where('visitId').equals(dish.visitId).count()) === NO_DISHES) {
      await db.visits.delete(dish.visitId)
    }
  })

export const deleteVisit = (visitId: string) => db.transaction('rw', allTables(), () => deleteVisits([visitId]))

export const deleteRestaurant = (restaurantId: string) =>
  db.transaction('rw', allTables(), async () => {
    const visitIds = await db.visits.where('restaurantId').equals(restaurantId).primaryKeys()

    await deleteVisits(visitIds)
    await db.restaurants.delete(restaurantId)
  })
