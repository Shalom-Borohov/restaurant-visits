import { IonContent, IonPage } from '@ionic/react'
import { useDeferredValue, useMemo, useState } from 'react'
import { useRecords } from '../../data/hooks'
import { placeSuggestions } from '../../domain/places'
import type { Records } from '../../domain/types'
import { RESTAURANTS_COPY } from './copy'
import { NewVisitButton } from './NewVisitButton'
import { filterByPlace, filterWithinPlaces, NO_PLACE_FILTER } from './placeFilter'
import { PlaceFilters } from './PlaceFilters'
import { restaurantCards } from './restaurantCards'
import { RestaurantTile } from './RestaurantTile'
import './restaurants.css'
import { SearchField } from './SearchField'
import { SearchResults } from './SearchResults'
import { waitingDishes } from './waitingDishes'
import { WaitingDishes } from './WaitingDishes'

function RestaurantsBody({ records, query }: { records: Records; query: string }) {
  const [placeFilter, setPlaceFilter] = useState(NO_PLACE_FILTER)
  const places = useMemo(() => placeSuggestions(records.restaurants), [records])
  const activeFilter = useMemo(() => filterWithinPlaces(placeFilter, places), [placeFilter, places])
  const shownRecords = useMemo(() => filterByPlace(records, activeFilter), [records, activeFilter])
  const cards = useMemo(() => restaurantCards(shownRecords), [shownRecords])
  const waiting = useMemo(() => waitingDishes(records), [records])

  if (!records.restaurants.length) {
    return <p className="empty-note">{RESTAURANTS_COPY.noRestaurants}</p>
  }

  return (
    <div className="page-stack">
      <PlaceFilters places={places} filter={activeFilter} onFilterChange={setPlaceFilter} />
      {query.trim() ? (
        <SearchResults query={query} records={shownRecords} cards={cards} />
      ) : (
        <>
          {waiting && <WaitingDishes waiting={waiting} />}
          {cards.map((card) => (
            <RestaurantTile key={card.restaurant.id} card={card} />
          ))}
        </>
      )}
    </div>
  )
}

export function RestaurantsPage() {
  const records = useRecords()
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="page-body page-body-docked">
          <header className="glaze-header">
            <h1 className="glaze-title">{RESTAURANTS_COPY.title}</h1>
            <SearchField query={query} onQueryChange={setQuery} />
          </header>
          {records && <RestaurantsBody records={records} query={deferredQuery} />}
        </div>
        <NewVisitButton />
      </IonContent>
    </IonPage>
  )
}
