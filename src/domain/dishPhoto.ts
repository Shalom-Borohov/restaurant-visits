import type { Dish } from './types'

export const photoDishId = (dish: Dish) => (dish.hasPhoto ? dish.id : undefined)
