import type { ReactNode } from 'react'

type LineIconProps = {
  size: number
  children: ReactNode
}

const VIEW_BOX = '0 0 24 24'

function LineIcon({ size, children }: LineIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={VIEW_BOX}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

export const CameraIcon = ({ size = 32 }: { size?: number }) => (
  <LineIcon size={size}>
    <path d="M3.5 8.5h3.5l2-3h6l2 3h3.5v10.5h-17z" />
    <circle cx="12" cy="13.5" r="3.5" />
  </LineIcon>
)

export const LibraryIcon = () => (
  <LineIcon size={22}>
    <rect x="3.5" y="4.5" width="17" height="15" rx="3.5" />
    <circle cx="9" cy="10" r="1.8" />
    <path d="M4.5 17l5-4.5 3.5 3 2.5-2 4 3.5" />
  </LineIcon>
)

export const RestaurantsIcon = () => (
  <LineIcon size={24}>
    <path d="M7 3v18M4.5 3v5a2.5 2.5 0 0 0 5 0V3M17.5 21V3c-2.2 0-3.5 3-3.5 7.5h3.5" />
  </LineIcon>
)

export const VisitsIcon = () => (
  <LineIcon size={24}>
    <rect x="4" y="5" width="16" height="15" rx="3.5" />
    <path d="M4 10h16M9 3v4M15 3v4" />
  </LineIcon>
)

export const SettingsIcon = () => (
  <LineIcon size={24}>
    <path d="M18.69 14.05L20.62 15.48A9.3 9.3 0 0 1 19.33 17.73L17.12 16.77A7 7 0 0 1 13.57 18.82L13.29 21.21A9.3 9.3 0 0 1 10.71 21.21L10.43 18.82A7 7 0 0 1 6.88 16.77L4.67 17.73A9.3 9.3 0 0 1 3.38 15.48L5.31 14.05A7 7 0 0 1 5.31 9.95L3.38 8.52A9.3 9.3 0 0 1 4.67 6.27L6.88 7.23A7 7 0 0 1 10.43 5.18L10.71 2.79A9.3 9.3 0 0 1 13.29 2.79L13.57 5.18A7 7 0 0 1 17.12 7.23L19.33 6.27A9.3 9.3 0 0 1 20.62 8.52L18.69 9.95A7 7 0 0 1 18.69 14.05Z" />
    <circle cx="12" cy="12" r="3" />
  </LineIcon>
)

export const PlusIcon = () => (
  <LineIcon size={22}>
    <path d="M12 5v14M5 12h14" />
  </LineIcon>
)

export const ShareIcon = () => (
  <LineIcon size={22}>
    <path d="M12 14V4M8 7.5 12 4l4 3.5M7 11H6v9h12v-9h-1" />
  </LineIcon>
)

export const SearchIcon = () => (
  <LineIcon size={18}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M20 20l-4.2-4.2" />
  </LineIcon>
)

export const ChatIcon = () => (
  <LineIcon size={22}>
    <path d="M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-8l-4 3.5V16H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" />
  </LineIcon>
)

export const ImportIcon = () => (
  <LineIcon size={22}>
    <path d="M12 4v10M8 10.5l4 3.5 4-3.5M7 11H6v9h12v-9h-1" />
  </LineIcon>
)
