import type { NewDishFields } from '../../data/repo'
import { INVALID_PRICE, parsePriceText } from '../../domain/price'
import { type Dish, isName, type ShrunkPhoto, type Verdict } from '../../domain/types'

export type PhotoChange = { kind: 'kept' } | { kind: 'picked'; taken: ShrunkPhoto } | { kind: 'removed' }

export type DishFormState = {
  name: string
  priceText: string
  verdict?: Verdict
  photo: PhotoChange
}

export const NOTE_FIELD = 'note'

const NO_TEXT = ''

export const emptyDishForm = (takenPhoto: ShrunkPhoto | undefined): DishFormState => ({
  name: NO_TEXT,
  priceText: NO_TEXT,
  photo: takenPhoto ? { kind: 'picked', taken: takenPhoto } : { kind: 'kept' },
})

export const formFromDish = (dish: Dish): DishFormState => ({
  name: dish.name,
  priceText: dish.price === undefined ? NO_TEXT : String(dish.price),
  verdict: dish.verdict,
  photo: { kind: 'kept' },
})

export const isPriceValid = (priceText: string) => parsePriceText(priceText) !== INVALID_PRICE

export function savableFields(form: DishFormState): Omit<NewDishFields, 'note'> | undefined {
  const price = parsePriceText(form.priceText)

  if (!isName(form.name) || price === INVALID_PRICE) {
    return undefined
  }

  return { name: form.name, price, verdict: form.verdict }
}

export const pickedPhoto = (photo: PhotoChange) => (photo.kind === 'picked' ? photo.taken : undefined)
