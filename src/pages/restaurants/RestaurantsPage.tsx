import { IonContent, IonPage } from '@ionic/react'
import { useDeferredValue, useMemo, useState } from 'react'
import { NewVisitLink } from '../../components/NewVisitLink'
import { useRecords } from '../../data/hooks'
import { placeSuggestions } from '../../domain/places'
import type { Records } from '../../domain/types'
import { NEW_VISIT_PATH } from '../../navigation/paths'
import { RESTAURANTS_COPY } from './copy'
import { filterByPlace, filterWithinPlaces, NO_PLACE_FILTER } from './placeFilter'
import { PlaceFilters } from './PlaceFilters'
import { restaurantCards } from './restaurantCards'
import { RestaurantList } from './RestaurantList'
import './restaurants.css'
import { SearchField } from './SearchField'
import { SearchResults } from './SearchResults'
import { waitingDishes } from './waitingDishes'
import { WaitingLine } from './WaitingLine'

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
    <div className="restaurants-body">
      <PlaceFilters places={places} filter={activeFilter} onFilterChange={setPlaceFilter} />
      {query.trim() ? (
        <SearchResults query={query} records={shownRecords} cards={cards} />
      ) : (
        <>
          {waiting && <WaitingLine waiting={waiting} />}
          <RestaurantList cards={cards} />
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
        <div className="page-body">
          <h1 className="page-title">{RESTAURANTS_COPY.title}</h1>
          <SearchField query={query} onQueryChange={setQuery} />
          {records && <RestaurantsBody records={records} query={deferredQuery} />}
        </div>
        <NewVisitLink to={NEW_VISIT_PATH} />
      </IonContent>
    </IonPage>
  )
}
