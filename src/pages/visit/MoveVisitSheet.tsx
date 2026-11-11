import { IonButton, IonButtons, IonContent, IonHeader, IonModal, IonTitle, IonToolbar } from '@ionic/react'
import { COMMON_COPY } from '../../copy/common'
import type { Records } from '../../domain/types'
import { VISIT_COPY } from './copy'
import { RestaurantPicker } from './RestaurantPicker'

type MoveVisitSheetProps = {
  isOpen: boolean
  records: Records
  onPick: (restaurantId: string) => void
  onClose: () => void
}

export function MoveVisitSheet({ isOpen, records, onPick, onClose }: MoveVisitSheetProps) {
  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={onClose}>{COMMON_COPY.cancel}</IonButton>
          </IonButtons>
          <IonTitle>{VISIT_COPY.moveVisitTitle}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <RestaurantPicker records={records} heading={VISIT_COPY.moveVisitQuestion} onPick={onPick} />
      </IonContent>
    </IonModal>
  )
}
