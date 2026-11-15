import { useState } from 'react'
import '../../components/BarAction.css'
import { BarScrim } from '../../components/BarScrim'
import { CameraIcon } from '../../components/icons'
import { PhotoInput } from '../../components/PhotoInputs'
import { useMessageToast } from '../../components/useMessageToast'
import type { ShrunkPhoto } from '../../domain/types'
import { shrinkPhoto } from '../../photo/shrink'
import { VISIT_COPY } from './copy'

type DishCameraPillProps = {
  onPhotoTaken: (photo: ShrunkPhoto) => void
  onUnreadablePhoto: () => void
}

const PILL_CAMERA_ICON_SIZE = 24

export function DishCameraPill({ onPhotoTaken, onUnreadablePhoto }: DishCameraPillProps) {
  const [isShrinking, setIsShrinking] = useState(false)
  const toast = useMessageToast()

  async function takePhoto(file: File) {
    setIsShrinking(true)

    try {
      onPhotoTaken(await shrinkPhoto(file))
    } catch {
      onUnreadablePhoto()
      void toast(VISIT_COPY.cameraPhotoFailed)
    } finally {
      setIsShrinking(false)
    }
  }

  return (
    <>
      <BarScrim />
      <PhotoInput
        slot="fixed"
        aria-busy={isShrinking}
        className="bar-action bar-action-pill"
        opensCamera
        onPick={(file) => void takePhoto(file)}
      >
        <CameraIcon size={PILL_CAMERA_ICON_SIZE} />
        <span>{VISIT_COPY.dishCamera}</span>
      </PhotoInput>
    </>
  )
}
