import { Link } from 'react-router-dom'
import { CameraPlate } from '../../components/CameraPlate'
import { COMMON_COPY } from '../../copy/common'
import { NEW_VISIT_PATH } from '../../navigation/paths'

export function NewVisitButton() {
  return (
    <Link slot="fixed" className="floating-dock new-visit-button" to={NEW_VISIT_PATH}>
      <span className="new-visit-label">{COMMON_COPY.newVisit}</span>
      <CameraPlate />
    </Link>
  )
}
