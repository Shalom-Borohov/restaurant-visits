type ChoiceGroupBase<Choice extends string> = {
  label?: string
  className?: string
  choices: readonly Choice[]
  chosen: Choice | undefined
  labelOf: (choice: Choice) => string
  classOf?: (choice: Choice) => string
}

type ClearableChoiceGroupProps<Choice extends string> = ChoiceGroupBase<Choice> & {
  tapAgainClears: true
  onChoose: (choice: Choice | undefined) => void
}

type FixedChoiceGroupProps<Choice extends string> = ChoiceGroupBase<Choice> & {
  tapAgainClears?: false
  onChoose: (choice: Choice) => void
}

type ChoiceGroupProps<Choice extends string> = ClearableChoiceGroupProps<Choice> | FixedChoiceGroupProps<Choice>

export function ChoiceGroup<Choice extends string>(props: ChoiceGroupProps<Choice>) {
  const { label, className, choices, chosen, labelOf, classOf } = props

  function choose(choice: Choice) {
    if (props.tapAgainClears && choice === chosen) {
      props.onChoose(undefined)

      return
    }

    props.onChoose(choice)
  }

  return (
    <div
      className={className ? `choice-group ${className}` : 'choice-group'}
      role={label ? 'group' : undefined}
      aria-label={label}
    >
      {choices.map((choice) => (
        <button
          key={choice}
          type="button"
          className={classOf ? `choice ${classOf(choice)}` : 'choice'}
          aria-pressed={choice === chosen}
          onClick={() => choose(choice)}
        >
          {labelOf(choice)}
        </button>
      ))}
    </div>
  )
}
