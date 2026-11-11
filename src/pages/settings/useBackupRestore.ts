import { useIonAlert } from '@ionic/react'
import type { ChangeEvent } from 'react'
import { takePickedFile } from '../../components/takePickedFile'
import { useMessageToast } from '../../components/useMessageToast'
import { COMMON_COPY } from '../../copy/common'
import { type ParsedBackup, parseBackup, restoreBackup } from '../../data/backup'
import { SETTINGS_COPY } from './copy'

export function useBackupRestore() {
  const [presentAlert] = useIonAlert()
  const toast = useMessageToast()

  async function restore(backup: ParsedBackup) {
    try {
      await restoreBackup(backup)
      void toast(SETTINGS_COPY.backupRestored)
    } catch {
      void toast(SETTINGS_COPY.invalidBackup)
    }
  }

  function confirmRestore(backup: ParsedBackup) {
    void presentAlert({
      header: SETTINGS_COPY.restoreBackup,
      message: SETTINGS_COPY.restoreWarning,
      buttons: [
        { text: COMMON_COPY.cancel, role: 'cancel' },
        { text: SETTINGS_COPY.confirmRestore, role: 'destructive', handler: () => void restore(backup) },
      ],
    })
  }

  async function restoreFromFile(event: ChangeEvent<HTMLInputElement>) {
    const file = takePickedFile(event.currentTarget)

    if (!file) {
      return
    }

    try {
      confirmRestore(parseBackup(new Uint8Array(await file.arrayBuffer())))
    } catch {
      void toast(SETTINGS_COPY.invalidBackup)
    }
  }

  return restoreFromFile
}
