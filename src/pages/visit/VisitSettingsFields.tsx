import type { ReactNode } from 'react'
import { ChoiceGroup } from '../../components/ChoiceGroup'
import { useMessageToast } from '../../components/useMessageToast'
import { VISIT_KIND_LABELS } from '../../copy/labels'
import { type Visit, VISIT_KINDS } from '../../domain/types'
import { isAfterToday, isVisitDate, todayVisitDate } from '../../domain/visitDate'
import { VISIT_COPY } from './copy'

export type VisitSettings = Pick<Visit, 'visitedOn' | 'kind'>

type VisitSettingsFieldsProps = {
  settings: VisitSettings
  onChange: (changes: Partial<VisitSettings>) => void
  children?: ReactNode
}

const currentDay = () => todayVisitDate(new Date())

export function VisitSettingsFields({ settings, onChange, children }: VisitSettingsFieldsProps) {
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
    <section className="tile visit-settings">
      {children}
      <label className="visit-settings-date">
        <span className="visit-settings-label">{VISIT_COPY.visitDate}</span>
        <input
          className="field"
          type="date"
          max={currentDay()}
          value={settings.visitedOn}
          onChange={(event) => changeDate(event.target.value)}
        />
      </label>
      <ChoiceGroup
        label={VISIT_COPY.visitKind}
        choices={VISIT_KINDS}
        chosen={settings.kind}
        labelOf={(kind) => VISIT_KIND_LABELS[kind]}
        onChoose={(kind) => onChange({ kind })}
      />
    </section>
  )
}
