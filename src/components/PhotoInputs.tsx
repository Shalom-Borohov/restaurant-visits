import type { ChangeEvent, ReactNode } from 'react'
import { CameraIcon, LibraryIcon } from './icons'
import './PhotoInputs.css'
import { takePickedFile } from './takePickedFile'

type PhotoInputProps = {
  className: string
  opensCamera: boolean
  onPick: (file: File) => void
  children: ReactNode
}

type PhotoInputsProps = {
  cameraLabel: string
  libraryLabel: string
  onPick: (file: File) => void
}

const IMAGES_ONLY = 'image/*'

const REAR_CAMERA = 'environment'

const CAMERA_ICON_SIZE = 28

export function PhotoInput({ className, opensCamera, onPick, children }: PhotoInputProps) {
  function pickFirst(event: ChangeEvent<HTMLInputElement>) {
    const file = takePickedFile(event.currentTarget)

    if (file) {
      onPick(file)
    }
  }

  return (
    <label className={className}>
      <input
        className="visually-hidden"
        type="file"
        accept={IMAGES_ONLY}
        capture={opensCamera ? REAR_CAMERA : undefined}
        onChange={pickFirst}
      />
      {children}
    </label>
  )
}

export function PhotoInputs({ cameraLabel, libraryLabel, onPick }: PhotoInputsProps) {
  return (
    <div className="photo-inputs">
      <PhotoInput className="photo-input photo-input-camera" opensCamera onPick={onPick}>
        <CameraIcon size={CAMERA_ICON_SIZE} />
        <span>{cameraLabel}</span>
      </PhotoInput>
      <PhotoInput className="photo-input photo-input-library" opensCamera={false} onPick={onPick}>
        <LibraryIcon />
        <span>{libraryLabel}</span>
      </PhotoInput>
    </div>
  )
}
