import Dexie, { type EntityTable } from 'dexie'
import type { Dish, DishPhoto, Restaurant, Visit } from '../domain/types'

const DB_NAME = 'restaurant-visits'

class RestaurantVisitsDb extends Dexie {
  declare restaurants: EntityTable<Restaurant, 'id'>
  declare visits: EntityTable<Visit, 'id'>
  declare dishes: EntityTable<Dish, 'id'>
  declare photos: EntityTable<DishPhoto, 'dishId'>
  declare thumbnails: EntityTable<DishPhoto, 'dishId'>

  constructor() {
    super(DB_NAME)
    this.version(1).stores({
      restaurants: 'id',
      visits: 'id, restaurantId',
      dishes: 'id, visitId',
      photos: 'dishId',
      thumbnails: 'dishId',
    })
  }
}

export const db = new RestaurantVisitsDb()

export const allTables = () => [db.restaurants, db.visits, db.dishes, db.photos, db.thumbnails]

export const photoTables = () => [db.dishes, db.photos, db.thumbnails]
