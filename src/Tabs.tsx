import { IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react'
import { Navigate, Route } from 'react-router-dom'
import { RestaurantsIcon, SettingsIcon, VisitsIcon } from './components/icons'
import { COMMON_COPY } from './copy/common'
import { RESTAURANTS_PATH, SETTINGS_PATH, VISITS_PATH } from './navigation/paths'
import { RestaurantPage } from './pages/restaurant/RestaurantPage'
import { RestaurantsPage } from './pages/restaurants/RestaurantsPage'
import { SettingsPage } from './pages/settings/SettingsPage'
import { VisitPage } from './pages/visit/VisitPage'
import { VisitsPage } from './pages/visits/VisitsPage'

export function Tabs() {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route path="restaurants" element={<RestaurantsPage />} />
        <Route path="restaurants/:restaurantId" element={<RestaurantPage />} />
        <Route path="restaurants/visits/new" element={<VisitPage />} />
        <Route path="restaurants/visits/:visitId" element={<VisitPage />} />
        <Route path="visits" element={<VisitsPage />} />
        <Route path="visits/:visitId" element={<VisitPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route index element={<Navigate to="restaurants" replace />} />
      </IonRouterOutlet>
      <IonTabBar slot="bottom" className="floating-tab-bar">
        <IonTabButton tab="restaurants" href={RESTAURANTS_PATH}>
          <RestaurantsIcon />
          <IonLabel>{COMMON_COPY.restaurants}</IonLabel>
        </IonTabButton>
        <IonTabButton tab="visits" href={VISITS_PATH}>
          <VisitsIcon />
          <IonLabel>{COMMON_COPY.visits}</IonLabel>
        </IonTabButton>
        <IonTabButton tab="settings" href={SETTINGS_PATH}>
          <SettingsIcon />
          <IonLabel>{COMMON_COPY.settings}</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  )
}
