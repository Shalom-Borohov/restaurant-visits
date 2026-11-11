import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useRecords } from '../../data/hooks'
import { recordsOfRestaurant } from '../../domain/lists'
import { placeSuggestions } from '../../domain/places'
import { summarizeDishes } from '../../domain/restaurantDishes'
import { RESTAURANTS_PATH } from '../../navigation/paths'
import { RESTAURANT_COPY } from './copy'
import { DishStack } from './DishStack'
import { DeleteRestaurantButton, NewVisitHereButton } from './RestaurantActions'
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
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {records && !own && <p className="empty-note">{RESTAURANT_COPY.notFound}</p>}
        {own && (
          <>
            <div className="page-body page-body-docked page-stack restaurant-body">
              <RestaurantSummary
                restaurant={own.restaurant}
                visits={own.visits}
                headingRef={nameRef}
                onEdit={() => setEditSheet((current) => ({ isOpen: true, openCount: current.openCount + 1 }))}
              />
              <DishStack summaries={summarizeDishes(own.visits, own.dishes)} />
              <VisitList visits={own.visits} dishes={own.dishes} />
              <DeleteRestaurantButton restaurant={own.restaurant} />
            </div>
            <div slot="fixed" className="floating-dock new-visit-here-dock">
              <NewVisitHereButton restaurantId={own.restaurant.id} />
            </div>
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
