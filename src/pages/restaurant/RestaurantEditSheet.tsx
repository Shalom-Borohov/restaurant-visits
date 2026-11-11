import { IonButton, IonButtons, IonContent, IonHeader, IonModal, IonTitle, IonToolbar } from '@ionic/react'
import { useRef, useState } from 'react'
import { ChoiceGroup } from '../../components/ChoiceGroup'
import { formText } from '../../components/formText'
import { TextField } from '../../components/TextField'
import { useMessageToast } from '../../components/useMessageToast'
import { COMMON_COPY } from '../../copy/common'
import { RETURN_LABELS } from '../../copy/labels'
import { updateRestaurant } from '../../data/repo'
import type { PlaceSuggestions } from '../../domain/places'
import { isName, type Restaurant, RETURN_VERDICTS } from '../../domain/types'
import { RESTAURANT_COPY } from './copy'

type RestaurantEditSheetProps = {
  restaurant: Restaurant
  suggestions: PlaceSuggestions
  isOpen: boolean
  openCount: number
  onClose: () => void
}

type RestaurantFormProps = Omit<RestaurantEditSheetProps, 'isOpen' | 'openCount'>

const FIELD_NAMES = { name: 'name', city: 'city', cuisine: 'cuisine', note: 'note' } as const

function RestaurantForm({ restaurant, suggestions, onClose }: RestaurantFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const [name, setName] = useState(restaurant.name)
  const [wouldReturn, setWouldReturn] = useState(restaurant.wouldReturn)
  const [isSaving, setIsSaving] = useState(false)
  const toast = useMessageToast()

  async function save() {
    const form = formRef.current

    if (!form) {
      return
    }

    setIsSaving(true)

    try {
      await updateRestaurant({
        ...restaurant,
        name,
        wouldReturn,
        city: formText(form, FIELD_NAMES.city),
        cuisine: formText(form, FIELD_NAMES.cuisine),
        note: formText(form, FIELD_NAMES.note),
      })
      onClose()
    } catch {
      setIsSaving(false)
      void toast(COMMON_COPY.actionFailed)
    }
  }

  return (
    <>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={onClose}>{COMMON_COPY.cancel}</IonButton>
          </IonButtons>
          <IonTitle>{RESTAURANT_COPY.editTitle}</IonTitle>
          <IonButtons slot="end">
            <IonButton strong disabled={!isName(name) || isSaving} onClick={() => void save()}>
              {COMMON_COPY.save}
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <form ref={formRef} className="restaurant-form" onSubmit={(event) => event.preventDefault()}>
          <TextField
            label={RESTAURANT_COPY.nameField}
            name={FIELD_NAMES.name}
            defaultValue={restaurant.name}
            onTextChange={setName}
          />
          <TextField
            label={COMMON_COPY.city}
            name={FIELD_NAMES.city}
            defaultValue={restaurant.city}
            suggestions={suggestions.cities}
          />
          <TextField
            label={COMMON_COPY.cuisine}
            name={FIELD_NAMES.cuisine}
            defaultValue={restaurant.cuisine}
            suggestions={suggestions.cuisines}
          />
          <fieldset className="restaurant-form-choices">
            <legend>{RESTAURANT_COPY.wouldReturnField}</legend>
            <ChoiceGroup
              choices={RETURN_VERDICTS}
              chosen={wouldReturn}
              labelOf={(verdict) => RETURN_LABELS[verdict]}
              tapAgainClears
              onChoose={setWouldReturn}
            />
          </fieldset>
          <label className="restaurant-form-field">
            <span>{RESTAURANT_COPY.noteField}</span>
            <textarea
              className="field restaurant-form-note"
              dir="auto"
              name={FIELD_NAMES.note}
              placeholder={RESTAURANT_COPY.notePlaceholder}
              defaultValue={restaurant.note}
            />
          </label>
        </form>
      </IonContent>
    </>
  )
}

export function RestaurantEditSheet({ isOpen, openCount, onClose, ...formProps }: RestaurantEditSheetProps) {
  return (
    <IonModal isOpen={isOpen} backdropDismiss={false} onDidDismiss={onClose}>
      <RestaurantForm key={openCount} {...formProps} onClose={onClose} />
    </IonModal>
  )
}
