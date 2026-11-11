import type { Dish, Visit } from '../domain/types'
import { COMMON_COPY } from './common'
import { VISIT_KIND_LABELS } from './labels'

export const visitDetails = (visit: Visit, dishes: Dish[]) => [
  VISIT_KIND_LABELS[visit.kind],
  COMMON_COPY.dishCount(dishes.length),
]
