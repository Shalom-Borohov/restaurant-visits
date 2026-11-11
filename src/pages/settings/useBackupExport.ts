import { useIonViewWillLeave } from '@ionic/react'
import { useEffect, useState } from 'react'
import { useMessageToast } from '../../components/useMessageToast'
import { COMMON_COPY } from '../../copy/common'
import { exportBackup } from '../../data/backup'
import { backupFile, type DeliveryOutcome, deliverFile, shareFile } from './backupFile'

const FILE_KEPT_FOR_SECOND_TAP_MS = 60_000

async function freshBackupFile() {
  const now = Date.now()

  return backupFile(await exportBackup(now), now)
}

export function useBackupExport() {
  const [fileAwaitingTap, setFileAwaitingTap] = useState<File>()
  const toast = useMessageToast()
  const forgetFile = () => setFileAwaitingTap(undefined)

  useIonViewWillLeave(forgetFile)

  useEffect(() => {
    if (!fileAwaitingTap) {
      return
    }

    const timer = setTimeout(() => setFileAwaitingTap(undefined), FILE_KEPT_FOR_SECOND_TAP_MS)

    return () => clearTimeout(timer)
  }, [fileAwaitingTap])

  async function deliver(prepareFile: () => Promise<File>, delivery: (file: File) => Promise<DeliveryOutcome>) {
    try {
      const file = await prepareFile()
      const outcome = await delivery(file)

      setFileAwaitingTap(outcome === 'needsAnotherTap' ? file : undefined)
    } catch {
      forgetFile()
      void toast(COMMON_COPY.actionFailed)
    }
  }

  const exportData = () => deliver(freshBackupFile, deliverFile)

  const shareAgain = (file: File) => deliver(async () => file, shareFile)

  return { exportData, fileAwaitingTap, shareAgain }
}
