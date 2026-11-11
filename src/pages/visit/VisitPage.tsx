import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react'
import { useState } from 'react'
import { useLocation, useParams, useSearchParams } from 'react-router-dom'
import { useRecords } from '../../data/hooks'
import type { VisitRestaurant } from '../../data/repo'
import type { Records, Visit } from '../../domain/types'
import { isInVisitsStack, RESTAURANTS_PATH, VISITS_PATH } from '../../navigation/paths'
import { VISIT_COPY } from './copy'
import { RestaurantPicker } from './RestaurantPicker'
import { VisitEditor } from './VisitEditor'
import './visit.css'

const RESTAURANT_PARAM = 'restaurant'

const NEW_RESTAURANT_KEY = 'new-restaurant'

type ShownRestaurant = {
  name: string
  choice: VisitRestaurant
}

type PickedRestaurant = {
  forParam: string | null
  choice: VisitRestaurant | undefined
}

const choiceFromParam = (restaurantParam: string | null) =>
  restaurantParam ? { restaurantId: restaurantParam } : undefined

function savedRestaurant(records: Records, restaurantId: string) {
  const restaurant = records.restaurants.find((candidate) => candidate.id === restaurantId)

  return restaurant && { name: restaurant.name, choice: { restaurantId: restaurant.id } }
}

function shownRestaurant(
  records: Records,
  visit: Visit | undefined,
  choice: VisitRestaurant | undefined,
): ShownRestaurant | undefined {
  if (visit) {
    return savedRestaurant(records, visit.restaurantId)
  }

  if (!choice) {
    return undefined
  }

  return 'newRestaurant' in choice
    ? { name: choice.newRestaurant.name, choice }
    : savedRestaurant(records, choice.restaurantId)
}

function editorKey(visit: Visit | undefined, choice: VisitRestaurant) {
  if (visit) {
    return visit.id
  }

  return 'restaurantId' in choice ? choice.restaurantId : NEW_RESTAURANT_KEY
}

export function VisitPage() {
  const { visitId } = useParams()
  const { pathname } = useLocation()
  const [searchParams] = useSearchParams()
  const restaurantParam = searchParams.get(RESTAURANT_PARAM)

  const [picked, setPicked] = useState<PickedRestaurant>({
    forParam: restaurantParam,
    choice: choiceFromParam(restaurantParam),
  })

  if (picked.forParam !== restaurantParam) {
    setPicked({ forParam: restaurantParam, choice: choiceFromParam(restaurantParam) })
  }

  const records = useRecords()
  const visit = visitId ? records?.visits.find((candidate) => candidate.id === visitId) : undefined
  const shown = records && shownRestaurant(records, visit, picked.choice)
  const isMissingVisit = Boolean(records && visitId && !visit)
  const pick = (choice: VisitRestaurant) => setPicked({ forParam: restaurantParam, choice })

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref={isInVisitsStack(pathname) ? VISITS_PATH : RESTAURANTS_PATH} />
          </IonButtons>
          <IonTitle dir="auto">{shown ? shown.name : VISIT_COPY.newVisit}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {isMissingVisit && <p className="empty-note">{VISIT_COPY.visitNotFound}</p>}
        {records && !isMissingVisit && !shown && (
          <RestaurantPicker
            key={restaurantParam}
            records={records}
            heading={VISIT_COPY.pickRestaurant}
            onPick={(restaurantId) => pick({ restaurantId })}
            onDraft={(newRestaurant) => pick({ newRestaurant })}
          />
        )}
        {records && !isMissingVisit && shown && (
          <VisitEditor
            key={editorKey(visit, shown.choice)}
            records={records}
            restaurant={shown.choice}
            restaurantName={shown.name}
            visit={visit}
          />
        )}
      </IonContent>
    </IonPage>
  )
}
