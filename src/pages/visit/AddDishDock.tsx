import { useState } from 'react'
import { CameraIcon } from '../../components/icons'
import { PhotoInput } from '../../components/PhotoInputs'
import { useMessageToast } from '../../components/useMessageToast'
import type { ShrunkPhoto } from '../../domain/types'
import { shrinkPhoto } from '../../photo/shrink'
import { VISIT_COPY } from './copy'

type AddDishDockProps = {
  onPhotoTaken: (photo: ShrunkPhoto) => void
  onWithoutPhoto: () => void
}

const DOCK_CAMERA_ICON_SIZE = 26

export function AddDishDock({ onPhotoTaken, onWithoutPhoto }: AddDishDockProps) {
  const [isShrinking, setIsShrinking] = useState(false)
  const toast = useMessageToast()

  async function takePhoto(file: File) {
    setIsShrinking(true)

    try {
      onPhotoTaken(await shrinkPhoto(file))
    } catch {
      onWithoutPhoto()
      void toast(VISIT_COPY.cameraPhotoFailed)
    } finally {
      setIsShrinking(false)
    }
  }

  return (
    <div slot="fixed" className="floating-dock add-dish-dock" aria-busy={isShrinking}>
      <PhotoInput className="primary-button add-dish-camera" opensCamera onPick={(file) => void takePhoto(file)}>
        <CameraIcon size={DOCK_CAMERA_ICON_SIZE} />
        <span>{VISIT_COPY.dishCamera}</span>
      </PhotoInput>
      <button type="button" className="choice add-dish-plain" onClick={onWithoutPhoto}>
        {VISIT_COPY.dishWithoutPhoto}
      </button>
    </div>
  )
}
