import { useId } from 'react'
import { ChoiceGroup } from '../../components/ChoiceGroup'
import { VERDICT_LABELS } from '../../copy/labels'
import { dishKey } from '../../domain/restaurantDishes'
import { VERDICTS } from '../../domain/types'
import { DISH_COPY } from './copy'
import { type DishFormState, isPriceValid, NOTE_FIELD } from './dishForm'

type DishFieldsProps = {
  form: DishFormState
  initialNote: string | undefined
  suggestions: string[]
  onChange: (changes: Partial<DishFormState>) => void
}

const MAX_SUGGESTIONS = 6

const NOTE_ROWS = 2

function matchingSuggestions(name: string, suggestions: string[]) {
  const typed = dishKey(name)

  return suggestions
    .filter((suggestion) => dishKey(suggestion) !== typed && dishKey(suggestion).includes(typed))
    .slice(0, MAX_SUGGESTIONS)
}

export function DishFields({ form, initialNote, suggestions, onChange }: DishFieldsProps) {
  const shownSuggestions = matchingSuggestions(form.name, suggestions)
  const isPriceOk = isPriceValid(form.priceText)
  const priceId = useId()

  return (
    <>
      <label className="dish-sheet-field">
        <span className="dish-sheet-label">{DISH_COPY.name}</span>
        <input
          className="field dish-sheet-name"
          dir="auto"
          value={form.name}
          onChange={(event) => onChange({ name: event.target.value })}
        />
      </label>
      {shownSuggestions.length > 0 && (
        <div className="choice-group" role="group" aria-label={DISH_COPY.earlierDishes}>
          {shownSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              className="choice"
              dir="auto"
              onClick={() => onChange({ name: suggestion })}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
      <div className="dish-sheet-field">
        <label className="dish-sheet-label" htmlFor={priceId}>
          {DISH_COPY.price}
        </label>
        <span className="field dish-sheet-price">
          <input
            id={priceId}
            className="dish-sheet-price-input"
            inputMode="decimal"
            dir="ltr"
            value={form.priceText}
            aria-invalid={!isPriceOk}
            onChange={(event) => onChange({ priceText: event.target.value })}
          />
          <span className="dish-sheet-shekel" aria-hidden="true">
            {DISH_COPY.shekelSign}
          </span>
        </span>
        {!isPriceOk && <span className="dish-sheet-problem">{DISH_COPY.invalidPrice}</span>}
      </div>
      <fieldset className="dish-sheet-field dish-sheet-verdicts">
        <legend className="dish-sheet-label">{DISH_COPY.verdict}</legend>
        <ChoiceGroup
          className="verdict-scale"
          choices={VERDICTS}
          classOf={(verdict) => `verdict-scale-${verdict}`}
          chosen={form.verdict}
          labelOf={(verdict) => VERDICT_LABELS[verdict]}
          tapAgainClears
          onChoose={(verdict) => onChange({ verdict })}
        />
      </fieldset>
      <label className="dish-sheet-field">
        <span className="dish-sheet-label">{DISH_COPY.note}</span>
        <textarea
          className="field dish-sheet-note"
          dir="auto"
          rows={NOTE_ROWS}
          name={NOTE_FIELD}
          defaultValue={initialNote}
        />
      </label>
    </>
  )
}
