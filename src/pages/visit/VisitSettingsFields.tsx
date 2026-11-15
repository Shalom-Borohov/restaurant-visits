import { ChoiceGroup } from '../../components/ChoiceGroup'
import { OpenIcon } from '../../components/icons'
import { useMessageToast } from '../../components/useMessageToast'
import { VISIT_KIND_LABELS } from '../../copy/labels'
import { type Visit, VISIT_KINDS } from '../../domain/types'
import { isAfterToday, isVisitDate, todayVisitDate } from '../../domain/visitDate'
import { VISIT_COPY } from './copy'

export type VisitSettings = Pick<Visit, 'visitedOn' | 'kind'>

type MovableRestaurant = {
  name: string
  onMove: () => void
}

type VisitSettingsFieldsProps = {
  settings: VisitSettings
  onChange: (changes: Partial<VisitSettings>) => void
  restaurant: MovableRestaurant | undefined
}

const currentDay = () => todayVisitDate(new Date())

export function VisitSettingsFields({ settings, onChange, restaurant }: VisitSettingsFieldsProps) {
  const toast = useMessageToast()

  function changeDate(visitedOn: string) {
    if (!isVisitDate(visitedOn)) {
      return
    }

    if (isAfterToday(visitedOn, currentDay())) {
      void toast(VISIT_COPY.futureDate)

      return
    }

    onChange({ visitedOn })
  }

  return (
    <ul className="tile list-panel visit-facts">
      {restaurant && (
        <li>
          <button type="button" className="visit-fact" onClick={restaurant.onMove}>
            <span className="visit-fact-label">{VISIT_COPY.visitRestaurant}</span>
            <span className="visit-fact-value" dir="auto">
              {restaurant.name}
            </span>
            <OpenIcon />
          </button>
        </li>
      )}
      <li>
        <label className="visit-fact">
          <span className="visit-fact-label">{VISIT_COPY.visitDate}</span>
          <input
            className="visit-fact-value visit-fact-date"
            type="date"
            max={currentDay()}
            value={settings.visitedOn}
            onChange={(event) => changeDate(event.target.value)}
          />
        </label>
      </li>
      <li className="visit-fact">
        <span className="visit-fact-label" aria-hidden="true">
          {VISIT_COPY.visitKind}
        </span>
        <ChoiceGroup
          label={VISIT_COPY.visitKind}
          className="visit-kinds"
          choices={VISIT_KINDS}
          chosen={settings.kind}
          labelOf={(kind) => VISIT_KIND_LABELS[kind]}
          onChoose={(kind) => onChange({ kind })}
        />
      </li>
    </ul>
  )
}
