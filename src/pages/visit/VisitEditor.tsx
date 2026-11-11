import { useIonRouter } from '@ionic/react'
import { useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useConfirmDelete } from '../../components/useConfirmDelete'
import { useMessageToast } from '../../components/useMessageToast'
import { COMMON_COPY } from '../../copy/common'
import {
  addDish,
  addVisitWithDish,
  deleteVisit,
  type NewDishFields,
  updateVisit,
  type VisitRestaurant,
} from '../../data/repo'
import { dishesOfVisit } from '../../domain/lists'
import { summarizeDishes } from '../../domain/restaurantDishes'
import type { Records, ShrunkPhoto, Visit } from '../../domain/types'
import { todayVisitDate } from '../../domain/visitDate'
import { isInVisitsStack, restaurantPath, restaurantsStackVisitPath, VISITS_PATH } from '../../navigation/paths'
import { AddDishDock } from './AddDishDock'
import { VISIT_COPY } from './copy'
import { DishList } from './DishList'
import { MoveVisitSheet } from './MoveVisitSheet'
import { useDishSheet } from './useDishSheet'
import { type VisitSettings, VisitSettingsFields } from './VisitSettingsFields'

type VisitEditorProps = {
  records: Records
  restaurant: VisitRestaurant
  restaurantName: string
  visit: Visit | undefined
}

const DEFAULT_KIND = 'dineIn'

const SINGLE_DISH = 1

function earlierDishNames({ visits, dishes }: Records, restaurantId: string | undefined) {
  if (!restaurantId) {
    return []
  }

  const restaurantVisits = visits.filter((visit) => visit.restaurantId === restaurantId)

  return summarizeDishes(restaurantVisits, dishes).map((summary) => summary.name)
}

export function VisitEditor({ records, restaurant, restaurantName, visit }: VisitEditorProps) {
  const [pending, setPending] = useState<VisitSettings>(() => ({
    visitedOn: todayVisitDate(new Date()),
    kind: DEFAULT_KIND,
  }))

  const [isMoving, setIsMoving] = useState(false)
  const createdVisitId = useRef<string>(undefined)
  const router = useIonRouter()
  const { pathname } = useLocation()
  const toast = useMessageToast()
  const confirmDeletion = useConfirmDelete()
  const settings = visit ?? pending
  const visitId = visit?.id
  const visitDishes = useMemo(() => (visitId ? dishesOfVisit(records.dishes, visitId) : []), [records, visitId])
  const savedRestaurantId = 'restaurantId' in restaurant ? restaurant.restaurantId : undefined
  const suggestions = useMemo(() => earlierDishNames(records, savedRestaurantId), [records, savedRestaurantId])

  async function addDishToVisit(fields: NewDishFields, photo: ShrunkPhoto | undefined) {
    if (visit) {
      await addDish({ ...fields, visitId: visit.id }, photo, Date.now())

      return
    }

    const { visitId } = await addVisitWithDish({ ...restaurant, ...pending }, fields, photo, Date.now())

    createdVisitId.current = visitId
  }

  function openCreatedVisit() {
    if (createdVisitId.current) {
      router.push(restaurantsStackVisitPath(createdVisitId.current), 'none', 'replace')
    }
  }

  function leaveDeletedVisit(restaurantId: string) {
    const leaveTo = isInVisitsStack(pathname) ? VISITS_PATH : restaurantPath(restaurantId)

    router.push(leaveTo, 'back', 'replace')
  }

  function leaveVisit() {
    if (visit) {
      leaveDeletedVisit(visit.restaurantId)
    }
  }

  const { openAdd, openEdit, sheet } = useDishSheet({
    suggestions,
    onAdd: addDishToVisit,
    onDismissed: openCreatedVisit,
    isLastDish: visitDishes.length === SINGLE_DISH,
    onVisitDeleted: leaveVisit,
  })

  function saveVisit(saved: Visit, changes: Partial<Visit>) {
    updateVisit({ ...saved, ...changes }, Date.now()).catch(() => toast(COMMON_COPY.actionFailed))
  }

  function changeSettings(changes: Partial<VisitSettings>) {
    if (!visit) {
      setPending((current) => ({ ...current, ...changes }))

      return
    }

    saveVisit(visit, changes)
  }

  function moveVisit(saved: Visit, restaurantId: string) {
    setIsMoving(false)

    if (restaurantId !== saved.restaurantId) {
      saveVisit(saved, { restaurantId })
    }
  }

  function confirmDeleteVisit(doomed: Visit) {
    confirmDeletion({
      header: VISIT_COPY.deleteVisitQuestion,
      message: VISIT_COPY.deleteVisitWarning,
      remove: () => deleteVisit(doomed.id),
      onDeleted: () => leaveDeletedVisit(doomed.restaurantId),
    })
  }

  return (
    <>
      <div className="page-body page-body-docked page-stack visit-editor">
        <VisitSettingsFields settings={settings} onChange={changeSettings}>
          {visit && (
            <button type="button" className="visit-settings-restaurant" onClick={() => setIsMoving(true)}>
              <span className="visit-settings-label">{VISIT_COPY.visitRestaurant}</span>
              <span className="field visit-settings-restaurant-name" dir="auto">
                {restaurantName}
              </span>
            </button>
          )}
        </VisitSettingsFields>
        <DishList dishes={visitDishes} onOpen={openEdit} />
        {visit && (
          <button type="button" className="danger-button visit-delete" onClick={() => confirmDeleteVisit(visit)}>
            {VISIT_COPY.deleteVisit}
          </button>
        )}
      </div>
      <AddDishDock onPhotoTaken={openAdd} onWithoutPhoto={() => openAdd(undefined)} />
      {sheet}
      {visit && (
        <MoveVisitSheet
          isOpen={isMoving}
          records={records}
          onPick={(restaurantId) => moveVisit(visit, restaurantId)}
          onClose={() => setIsMoving(false)}
        />
      )}
    </>
  )
}
