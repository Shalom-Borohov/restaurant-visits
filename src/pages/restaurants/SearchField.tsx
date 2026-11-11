import { SearchIcon } from '../../components/icons'
import { RESTAURANTS_COPY } from './copy'

type SearchFieldProps = {
  query: string
  onQueryChange: (query: string) => void
}

export function SearchField({ query, onQueryChange }: SearchFieldProps) {
  return (
    <label className="restaurants-search">
      <SearchIcon />
      <input
        type="search"
        enterKeyHint="search"
        aria-label={RESTAURANTS_COPY.searchPlaceholder}
        placeholder={RESTAURANTS_COPY.searchPlaceholder}
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
      />
    </label>
  )
}
