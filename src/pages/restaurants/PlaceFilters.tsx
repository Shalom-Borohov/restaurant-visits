import { ChoiceGroup } from '../../components/ChoiceGroup'
import { COMMON_COPY } from '../../copy/common'
import type { PlaceSuggestions } from '../../domain/places'
import type { PlaceFilter } from './placeFilter'

type PlaceFiltersProps = {
  places: PlaceSuggestions
  filter: PlaceFilter
  onFilterChange: (filter: PlaceFilter) => void
}

const asWritten = (place: string) => place

export function PlaceFilters({ places, filter, onFilterChange }: PlaceFiltersProps) {
  const { cities, cuisines } = places

  if (!cities.length && !cuisines.length) {
    return null
  }

  return (
    <div className="place-filters">
      {cities.length > 0 && (
        <ChoiceGroup
          label={COMMON_COPY.city}
          choices={cities}
          chosen={filter.city}
          labelOf={asWritten}
          tapAgainClears
          onChoose={(city) => onFilterChange({ ...filter, city })}
        />
      )}
      {cuisines.length > 0 && (
        <ChoiceGroup
          label={COMMON_COPY.cuisine}
          choices={cuisines}
          chosen={filter.cuisine}
          labelOf={asWritten}
          tapAgainClears
          onChoose={(cuisine) => onFilterChange({ ...filter, cuisine })}
        />
      )}
    </div>
  )
}
