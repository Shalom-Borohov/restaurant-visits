import { IonButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/react'
import { useRef, useState } from 'react'
import { formText } from '../../components/formText'
import { useConfirmDelete } from '../../components/useConfirmDelete'
import { useMessageToast } from '../../components/useMessageToast'
import { COMMON_COPY } from '../../copy/common'
import { deleteDish, type NewDishFields, setDishPhoto, updateDish } from '../../data/repo'
import type { Dish, ShrunkPhoto } from '../../domain/types'
import { shrinkPhoto } from '../../photo/shrink'
import { DISH_COPY } from './copy'
import { DishFields } from './DishFields'
import { DishPhotoArea } from './DishPhotoArea'
import {
  type DishFormState,
  emptyDishForm,
  formFromDish,
  NOTE_FIELD,
  type PhotoChange,
  pickedPhoto,
  savableFields,
} from './dishForm'

export type AddDish = (fields: NewDishFields, photo: ShrunkPhoto | undefined) => Promise<void>

type DishFormProps = {
  dish: Dish | undefined
  takenPhoto: ShrunkPhoto | undefined
  suggestions: string[]
  onAdd: AddDish
  onClose: () => void
  isLastDish: boolean
  onVisitDeleted: () => void
}

async function saveEdit(dish: Dish, fields: NewDishFields, photo: PhotoChange) {
  await updateDish({ ...dish, ...fields })

  if (photo.kind !== 'kept') {
    await setDishPhoto(dish.id, pickedPhoto(photo))
  }
}

export function DishForm({
  dish,
  takenPhoto,
  suggestions,
  onAdd,
  onClose,
  isLastDish,
  onVisitDeleted,
}: DishFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const [form, setForm] = useState(() => (dish ? formFromDish(dish) : emptyDishForm(takenPhoto)))
  const [isSaving, setIsSaving] = useState(false)
  const [isShrinking, setIsShrinking] = useState(false)
  const toast = useMessageToast()
  const confirmDeletion = useConfirmDelete()
  const change = (changes: Partial<DishFormState>) => setForm((current) => ({ ...current, ...changes }))
  const fields = savableFields(form)
  const isSaveDisabled = !fields || isSaving || isShrinking

  async function pickPhoto(file: File) {
    setIsShrinking(true)

    try {
      change({ photo: { kind: 'picked', taken: await shrinkPhoto(file) } })
    } catch {
      void toast(DISH_COPY.photoFailed)
    } finally {
      setIsShrinking(false)
    }
  }

  async function save() {
    const formElement = formRef.current

    if (!fields || !formElement || isSaveDisabled) {
      return
    }

    setIsSaving(true)

    try {
      const allFields = { ...fields, note: formText(formElement, NOTE_FIELD) }

      await (dish ? saveEdit(dish, allFields, form.photo) : onAdd(allFields, pickedPhoto(form.photo)))
      onClose()
    } catch {
      setIsSaving(false)
      void toast(COMMON_COPY.actionFailed)
    }
  }

  function confirmDelete(doomed: Dish) {
    confirmDeletion({
      header: DISH_COPY.deleteDishQuestion,
      message: isLastDish ? DISH_COPY.deleteLastDishWarning : DISH_COPY.deleteDishWarning,
      remove: () => deleteDish(doomed.id),
      onDeleted: isLastDish ? onVisitDeleted : onClose,
    })
  }

  return (
    <>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={onClose}>{COMMON_COPY.cancel}</IonButton>
          </IonButtons>
          <IonTitle>{dish ? DISH_COPY.editDish : DISH_COPY.newDish}</IonTitle>
          <IonButtons slot="end">
            <IonButton strong disabled={isSaveDisabled} onClick={() => void save()}>
              {COMMON_COPY.save}
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <form ref={formRef} className="dish-sheet-body page-stack" onSubmit={(event) => event.preventDefault()}>
          <DishPhotoArea
            dish={dish}
            name={form.name}
            verdict={form.verdict}
            photo={form.photo}
            isShrinking={isShrinking}
            onPick={(file) => void pickPhoto(file)}
            onRemove={() => change({ photo: { kind: 'removed' } })}
          />
          <DishFields form={form} initialNote={dish?.note} suggestions={suggestions} onChange={change} />
          {dish && (
            <button type="button" className="danger-button dish-sheet-delete" onClick={() => confirmDelete(dish)}>
              {DISH_COPY.deleteDish}
            </button>
          )}
        </form>
      </IonContent>
    </>
  )
}
