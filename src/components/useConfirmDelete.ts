import { useIonAlert } from '@ionic/react'
import { COMMON_COPY } from '../copy/common'
import { useMessageToast } from './useMessageToast'

type DeleteQuestion = {
  header: string
  message: string
  remove: () => Promise<void>
  onDeleted: () => void
}

export function useConfirmDelete() {
  const [presentAlert] = useIonAlert()
  const toast = useMessageToast()

  return ({ header, message, remove, onDeleted }: DeleteQuestion) =>
    void presentAlert({
      header,
      message,
      buttons: [
        { text: COMMON_COPY.cancel, role: 'cancel' },
        {
          text: COMMON_COPY.delete,
          role: 'destructive',
          handler: () => void remove().then(onDeleted, () => toast(COMMON_COPY.actionFailed)),
        },
      ],
    })
}
