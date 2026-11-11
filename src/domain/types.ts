import {
  boolean,
  check,
  type InferOutput,
  is,
  minLength,
  number,
  object,
  optional,
  picklist,
  pipe,
  string,
  transform,
  trim,
} from 'valibot'
import { isPriceAmount } from './price'
import { isVisitDate } from './visitDate'

const MINIMUM_NAME_LENGTH = 1

export const VERDICTS = ['must', 'good', 'fine', 'weak', 'avoid'] as const

export type Verdict = (typeof VERDICTS)[number]

export const VISIT_KINDS = ['dineIn', 'delivery', 'takeaway'] as const

export type VisitKind = (typeof VISIT_KINDS)[number]

export const RETURN_VERDICTS = ['yes', 'no'] as const

export type ReturnVerdict = (typeof RETURN_VERDICTS)[number]

const nameSchema = pipe(string(), trim(), minLength(MINIMUM_NAME_LENGTH))

export const isName = (text: string) => is(nameSchema, text)

const optionalTextSchema = optional(
  pipe(
    string(),
    trim(),
    transform((text) => text || undefined),
  ),
)

export const restaurantSchema = object({
  id: string(),
  name: nameSchema,
  createdAt: number(),
  city: optionalTextSchema,
  cuisine: optionalTextSchema,
  wouldReturn: optional(picklist(RETURN_VERDICTS)),
  note: optionalTextSchema,
})

export type Restaurant = InferOutput<typeof restaurantSchema>

export const visitSchema = object({
  id: string(),
  restaurantId: string(),
  visitedOn: pipe(string(), check(isVisitDate)),
  kind: picklist(VISIT_KINDS),
  createdAt: number(),
})

export type Visit = InferOutput<typeof visitSchema>

export const dishSchema = object({
  id: string(),
  visitId: string(),
  name: nameSchema,
  createdAt: number(),
  price: optional(pipe(number(), check(isPriceAmount))),
  verdict: optional(picklist(VERDICTS)),
  note: optionalTextSchema,
  hasPhoto: optional(boolean()),
})

export type Dish = InferOutput<typeof dishSchema>

export type Records = {
  restaurants: Restaurant[]
  visits: Visit[]
  dishes: Dish[]
}

export type DishPhoto = {
  dishId: string
  bytes: ArrayBuffer
}

export type ShrunkPhoto = {
  photo: ArrayBuffer
  thumbnail: ArrayBuffer
}
