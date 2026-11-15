import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useRecords } from '../../data/hooks'
import { recordsOfRestaurant } from '../../domain/lists'
import { placeSuggestions } from '../../domain/places'
import { summarizeDishes } from '../../domain/restaurantDishes'
import { RESTAURANTS_PATH } from '../../navigation/paths'
import { RESTAURANT_COPY } from './copy'
import { DishGroups } from './DishGroups'
import { DeleteRestaurantButton, NewVisitHereLink } from './RestaurantActions'
import { RestaurantEditSheet } from './RestaurantEditSheet'
import { RestaurantSummary } from './RestaurantSummary'
import { useIsInView } from './useIsInView'
import { VisitList } from './VisitList'
import './restaurant.css'

export function RestaurantPage() {
  const { restaurantId } = useParams()
  const records = useRecords()
  const [editSheet, setEditSheet] = useState({ isOpen: false, openCount: 0 })
  const own = records && recordsOfRestaurant(records, restaurantId)
  const { isInView: isNameInView, observedRef: nameRef } = useIsInView()

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref={RESTAURANTS_PATH} />
          </IonButtons>
          {own && (
            <IonTitle
              className={`restaurant-toolbar-title${isNameInView ? ' restaurant-toolbar-title-hidden' : ''}`}
              aria-hidden={isNameInView ? 'true' : 'false'}
            >
              {own.restaurant.name}
            </IonTitle>
          )}
          {own && (
            <IonButtons slot="end">
              <button
                type="button"
                className="toolbar-text-button"
                onClick={() => setEditSheet((current) => ({ isOpen: true, openCount: current.openCount + 1 }))}
              >
                {RESTAURANT_COPY.edit}
              </button>
            </IonButtons>
          )}
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {records && !own && <p className="empty-note">{RESTAURANT_COPY.notFound}</p>}
        {own && (
          <>
            <div className="page-body restaurant-body">
              <RestaurantSummary restaurant={own.restaurant} visits={own.visits} headingRef={nameRef} />
              <DishGroups summaries={summarizeDishes(own.visits, own.dishes)} />
              <VisitList visits={own.visits} dishes={own.dishes} />
              <DeleteRestaurantButton restaurant={own.restaurant} />
            </div>
            <NewVisitHereLink restaurantId={own.restaurant.id} />
            <RestaurantEditSheet
              restaurant={own.restaurant}
              suggestions={placeSuggestions(own.otherRestaurants)}
              isOpen={editSheet.isOpen}
              openCount={editSheet.openCount}
              onClose={() => setEditSheet((current) => ({ ...current, isOpen: false }))}
            />
          </>
        )}
      </IonContent>
    </IonPage>
  )
}
