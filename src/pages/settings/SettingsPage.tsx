import { IonContent, IonPage } from '@ionic/react'
import { NewVisitLink } from '../../components/NewVisitLink'
import { NEW_VISIT_PATH } from '../../navigation/paths'
import { BackupTile } from './BackupTile'
import { SETTINGS_COPY } from './copy'
import { FeedbackTile } from './FeedbackTile'
import './settings.css'

export function SettingsPage() {
  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="page-body">
          <h1 className="page-title">{SETTINGS_COPY.title}</h1>
          <div className="page-stack">
            <BackupTile />
            <FeedbackTile />
            <p className="settings-version">{SETTINGS_COPY.version(__APP_VERSION__, __APP_BUILT_AT__)}</p>
          </div>
        </div>
        <NewVisitLink to={NEW_VISIT_PATH} />
      </IonContent>
    </IonPage>
  )
}
