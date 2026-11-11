import { IonModal } from '@ionic/react'
import { useState } from 'react'
import type { Dish, ShrunkPhoto } from '../../domain/types'
import { type AddDish, DishForm } from './DishForm'
import './dishSheet.css'

type DishSheetOptions = {
  suggestions: string[]
  onAdd: AddDish
  onDismissed: () => void
  isLastDish: boolean
  onVisitDeleted: () => void
}

type SheetTarget = {
  dish: Dish | undefined
  takenPhoto: ShrunkPhoto | undefined
  openCount: number
}

const FULL_SHEET = 1

const SHEET_BREAKPOINTS = [0, FULL_SHEET]

export function useDishSheet({ suggestions, onAdd, onDismissed, isLastDish, onVisitDeleted }: DishSheetOptions) {
  const [target, setTarget] = useState<SheetTarget>({ dish: undefined, takenPhoto: undefined, openCount: 0 })
  const [isOpen, setIsOpen] = useState(false)
  const close = () => setIsOpen(false)

  function open(dish: Dish | undefined, takenPhoto: ShrunkPhoto | undefined) {
    setTarget((current) => ({ dish, takenPhoto, openCount: current.openCount + 1 }))
    setIsOpen(true)
  }

  function dismissed() {
    close()
    setTarget((current) => ({ ...current, takenPhoto: undefined }))
    onDismissed()
  }

  const sheet = (
    <IonModal
      isOpen={isOpen}
      initialBreakpoint={FULL_SHEET}
      breakpoints={SHEET_BREAKPOINTS}
      onDidDismiss={dismissed}
    >
      <DishForm
        key={target.openCount}
        dish={target.dish}
        takenPhoto={target.takenPhoto}
        suggestions={suggestions}
        onAdd={onAdd}
        onClose={close}
        isLastDish={isLastDish}
        onVisitDeleted={() => {
          close()
          onVisitDeleted()
        }}
      />
    </IonModal>
  )

  return {
    openAdd: (takenPhoto: ShrunkPhoto | undefined) => open(undefined, takenPhoto),
    openEdit: (dish: Dish) => open(dish, undefined),
    sheet,
  }
}
