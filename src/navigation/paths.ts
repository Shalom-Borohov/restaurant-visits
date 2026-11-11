const TABS_PATH = '/tabs'

export const RESTAURANTS_PATH = `${TABS_PATH}/restaurants`

export const VISITS_PATH = `${TABS_PATH}/visits`

export const SETTINGS_PATH = `${TABS_PATH}/settings`

const RESTAURANTS_STACK_VISITS_PATH = `${RESTAURANTS_PATH}/visits`

export const NEW_VISIT_PATH = `${RESTAURANTS_STACK_VISITS_PATH}/new`

export const restaurantPath = (restaurantId: string) => `${RESTAURANTS_PATH}/${restaurantId}`

export const restaurantsStackVisitPath = (visitId: string) => `${RESTAURANTS_STACK_VISITS_PATH}/${visitId}`

export const visitsStackVisitPath = (visitId: string) => `${VISITS_PATH}/${visitId}`

export const newVisitAtPath = (restaurantId: string) => `${NEW_VISIT_PATH}?restaurant=${restaurantId}`

export const isInVisitsStack = (pathname: string) => pathname.startsWith(`${VISITS_PATH}/`)
