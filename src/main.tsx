import { setupIonicReact } from '@ionic/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '@ionic/react/css/core.css'
import '@ionic/react/css/normalize.css'
import '@ionic/react/css/structure.css'
import '@ionic/react/css/typography.css'
import '@fontsource/rubik/hebrew-400.css'
import '@fontsource/rubik/hebrew-500.css'
import '@fontsource/rubik/hebrew-700.css'
import '@fontsource/rubik/latin-400.css'
import '@fontsource/rubik/latin-500.css'
import '@fontsource/rubik/latin-700.css'
import '@fontsource/suez-one/hebrew-400.css'
import '@fontsource/suez-one/latin-400.css'
import './theme.css'

import { App } from './App'
import { IONIC_CONFIG } from './ionicConfig'

const ROOT_ELEMENT_ID = 'root'

class MissingRootElementError extends Error {
  constructor() {
    super(`index.html has no #${ROOT_ELEMENT_ID} element to render the app into`)
    this.name = 'MissingRootElementError'
  }
}

function rootElement() {
  const element = document.getElementById(ROOT_ELEMENT_ID)

  if (!element) {
    throw new MissingRootElementError()
  }

  return element
}

setupIonicReact(IONIC_CONFIG)

navigator.storage?.persist?.()

createRoot(rootElement()).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
