import { useId } from 'react'
import './TextField.css'

type TextFieldProps = {
  label: string
  name: string
  defaultValue?: string
  suggestions?: string[]
  isLabelHidden?: boolean
  onTextChange?: (text: string) => void
}

export function TextField({ label, name, defaultValue, suggestions, isLabelHidden, onTextChange }: TextFieldProps) {
  const listId = useId()

  return (
    <div className="text-field">
      <label>
        <span className={isLabelHidden ? 'visually-hidden' : 'text-field-label'}>{label}</span>
        <input
          className="field"
          dir="auto"
          name={name}
          defaultValue={defaultValue}
          placeholder={isLabelHidden ? label : undefined}
          list={suggestions && listId}
          onChange={(event) => onTextChange?.(event.target.value)}
        />
      </label>
      {suggestions && (
        <datalist id={listId}>
          {suggestions.map((suggestion) => (
            <option key={suggestion} value={suggestion}>
              {suggestion}
            </option>
          ))}
        </datalist>
      )}
    </div>
  )
}
