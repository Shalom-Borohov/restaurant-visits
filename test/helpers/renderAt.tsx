import { IonApp } from '@ionic/react'
import { IonReactMemoryRouter } from '@ionic/react-router'
import { render, screen } from '@testing-library/react'
import { AppRoutes } from '../../src/App'
import { RecordsProvider } from '../../src/data/RecordsProvider'
import { LocationProbe } from './LocationProbe'

export function renderAt(path: string) {
  return render(
    <IonApp>
      <RecordsProvider>
        <IonReactMemoryRouter initialEntries={[path]}>
          <AppRoutes />
          <LocationProbe />
        </IonReactMemoryRouter>
      </RecordsProvider>
    </IonApp>,
  )
}

export function currentPath() {
  return screen.getByTestId('location').textContent
}

export function currentSearch() {
  return screen.getByTestId('search').textContent
}
