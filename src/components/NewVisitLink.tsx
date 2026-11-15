import { Link } from 'react-router-dom'
import { COMMON_COPY } from '../copy/common'
import { BarScrim } from './BarScrim'
import { CameraIcon } from './icons'
import './BarAction.css'

const CAMERA_ICON_SIZE = 26

type NewVisitLinkProps = {
  to: string
  label?: string
}

export function NewVisitLink({ to, label = COMMON_COPY.newVisit }: NewVisitLinkProps) {
  return (
    <>
      <BarScrim />
      <Link slot="fixed" className="bar-action bar-action-round" to={to} aria-label={label}>
        <CameraIcon size={CAMERA_ICON_SIZE} />
      </Link>
    </>
  )
}
