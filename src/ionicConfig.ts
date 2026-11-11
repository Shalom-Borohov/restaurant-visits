import type { setupIonicReact } from '@ionic/react'
import { COMMON_COPY } from './copy/common'

export const IONIC_CONFIG: Parameters<typeof setupIonicReact>[0] = {
  mode: 'ios',
  backButtonText: COMMON_COPY.back,
}
