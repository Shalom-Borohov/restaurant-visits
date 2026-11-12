import { IonContent, IonPage } from '@ionic/react'
import { BackupTile } from './BackupTile'
import { SETTINGS_COPY } from './copy'
import { FeedbackTile } from './FeedbackTile'
import './settings.css'

export function SettingsPage() {
  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="page-body">
          <header className="glaze-header">
            <h1 className="glaze-title">{SETTINGS_COPY.title}</h1>
          </header>
          <div className="page-stack">
            <BackupTile />
            <FeedbackTile />
            <p className="secondary-text settings-version">{SETTINGS_COPY.version(__APP_VERSION__, __APP_BUILT_AT__)}</p>
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}
