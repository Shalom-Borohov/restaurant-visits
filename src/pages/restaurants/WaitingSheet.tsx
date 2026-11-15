import { IonButton, IonButtons, IonContent, IonHeader, IonModal, IonTitle, IonToolbar } from '@ionic/react'
import { Link } from 'react-router-dom'
import { DishPhoto } from '../../components/DishPhoto'
import { Shekels } from '../../components/Shekels'
import { COMMON_COPY } from '../../copy/common'
import { joinParts } from '../../copy/joinParts'
import { shortDate } from '../../copy/labels'
import { photoDishId } from '../../domain/dishPhoto'
import { restaurantsStackVisitPath } from '../../navigation/paths'
import { RESTAURANTS_COPY } from './copy'
import type { WaitingDish } from './waitingDishes'

type WaitingSheetProps = {
  isOpen: boolean
  dishes: WaitingDish[]
  onClose: () => void
}

const HALF_SHEET = 0.6

const FULL_SHEET = 1

const SHEET_BREAKPOINTS = [0, HALF_SHEET, FULL_SHEET]

export function WaitingSheet({ isOpen, dishes, onClose }: WaitingSheetProps) {
  return (
    <IonModal isOpen={isOpen} initialBreakpoint={HALF_SHEET} breakpoints={SHEET_BREAKPOINTS} onDidDismiss={onClose}>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonTitle>{RESTAURANTS_COPY.waitingTitle}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose}>{COMMON_COPY.close}</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="waiting-sheet">
          <ul className="list-panel restaurants-dish-panel">
            {dishes.map(({ dish, restaurantName, visitedOn }) => (
              <li key={dish.id}>
                <Link
                  className="restaurants-row restaurants-dish-row"
                  to={restaurantsStackVisitPath(dish.visitId)}
                  onClick={onClose}
                >
                  <DishPhoto photoDishId={photoDishId(dish)} name={dish.name} size="small" />
                  <span className="restaurants-row-text">
                    <span className="restaurants-row-name restaurants-dish-name">{dish.name}</span>
                    <span className="restaurants-row-meta">{joinParts([restaurantName, shortDate(visitedOn)])}</span>
                  </span>
                  {dish.price !== undefined && (
                    <Shekels className="restaurants-dish-price" amount={dish.price} />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </IonContent>
    </IonModal>
  )
}
