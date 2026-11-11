import { type FormEvent, useState } from 'react'
import { formText } from '../../components/formText'
import { TextField } from '../../components/TextField'
import { COMMON_COPY } from '../../copy/common'
import type { RestaurantDraft } from '../../data/repo'
import { placeSuggestions } from '../../domain/places'
import { isName, type Restaurant } from '../../domain/types'
import { VISIT_COPY } from './copy'

type NewRestaurantFormProps = {
  restaurants: Restaurant[]
  initialName: string
  onDrafted: (draft: RestaurantDraft) => void
}

const FIELD_NAMES = { name: 'name', city: 'city', cuisine: 'cuisine' } as const

export function NewRestaurantForm({ restaurants, initialName, onDrafted }: NewRestaurantFormProps) {
  const [name, setName] = useState(initialName)
  const suggestions = placeSuggestions(restaurants)

  function draft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const place = { city: formText(form, FIELD_NAMES.city), cuisine: formText(form, FIELD_NAMES.cuisine) }

    onDrafted({ name: name.trim(), ...place })
  }

  return (
    <form className="tile page-stack new-restaurant" onSubmit={draft}>
      <h2>{VISIT_COPY.newRestaurant}</h2>
      <TextField
        label={VISIT_COPY.restaurantName}
        name={FIELD_NAMES.name}
        defaultValue={initialName}
        isLabelHidden
        onTextChange={setName}
      />
      <TextField
        label={COMMON_COPY.city}
        name={FIELD_NAMES.city}
        suggestions={suggestions.cities}
        isLabelHidden
      />
      <TextField
        label={COMMON_COPY.cuisine}
        name={FIELD_NAMES.cuisine}
        suggestions={suggestions.cuisines}
        isLabelHidden
      />
      <button type="submit" className="primary-button" disabled={!isName(name)}>
        {VISIT_COPY.continueToVisit}
      </button>
    </form>
  )
}
