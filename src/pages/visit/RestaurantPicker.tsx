import { useState } from 'react'
import { PlusIcon } from '../../components/icons'
import { restaurantsByRecentVisit } from '../../domain/lists'
import { searchRestaurants } from '../../domain/search'
import type { RestaurantDraft } from '../../data/repo'
import type { Records } from '../../domain/types'
import { VISIT_COPY } from './copy'
import { NewRestaurantForm } from './NewRestaurantForm'

type RestaurantPickerProps = {
  records: Records
  heading: string
  onPick: (restaurantId: string) => void
  onDraft?: (draft: RestaurantDraft) => void
}

function matchingRestaurants(query: string, records: Records) {
  const ordered = restaurantsByRecentVisit(records.restaurants, records.visits).map(({ restaurant }) => restaurant)

  if (!query.trim()) {
    return ordered
  }

  const matchingIds = new Set(searchRestaurants(query, records.restaurants).map((restaurant) => restaurant.id))

  return ordered.filter((restaurant) => matchingIds.has(restaurant.id))
}

export function RestaurantPicker({ records, heading, onPick, onDraft }: RestaurantPickerProps) {
  const [query, setQuery] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const shown = matchingRestaurants(query, records)

  if (isCreating && onDraft) {
    return (
      <div className="page-body page-stack visit-picker">
        <NewRestaurantForm restaurants={records.restaurants} initialName={query.trim()} onDrafted={onDraft} />
      </div>
    )
  }

  return (
    <div className="page-body page-stack visit-picker">
      <h2 className="visit-heading">{heading}</h2>
      <label>
        <span className="visually-hidden">{VISIT_COPY.searchRestaurants}</span>
        <input
          className="field"
          type="search"
          dir="auto"
          placeholder={VISIT_COPY.searchRestaurants}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>
      {shown.map((restaurant) => (
        <button key={restaurant.id} type="button" className="tile picker-tile" onClick={() => onPick(restaurant.id)}>
          <span className="picker-name" dir="auto">
            {restaurant.name}
          </span>
          {restaurant.city && <span className="secondary-text">{restaurant.city}</span>}
        </button>
      ))}
      {query.trim() && shown.length === 0 && <p className="empty-note">{VISIT_COPY.noRestaurantMatches}</p>}
      {onDraft && (
        <button type="button" className="choice new-restaurant-button" onClick={() => setIsCreating(true)}>
          <PlusIcon />
          <span>{VISIT_COPY.newRestaurant}</span>
        </button>
      )}
    </div>
  )
}
