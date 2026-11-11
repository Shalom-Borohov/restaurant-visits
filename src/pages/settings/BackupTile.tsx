import { useRef } from 'react'
import { ImportIcon, ShareIcon } from '../../components/icons'
import { useRecords } from '../../data/hooks'
import { BACKUP_FILE_ACCEPT } from './backupFile'
import { SETTINGS_COPY } from './copy'
import { useBackupExport } from './useBackupExport'
import { useBackupRestore } from './useBackupRestore'

function BackupCounts() {
  const records = useRecords()

  if (!records) {
    return null
  }

  const { restaurants, visits, dishes } = records
  const photoCount = dishes.filter((dish) => dish.hasPhoto).length

  return <p className="settings-counts">{SETTINGS_COPY.counts(restaurants.length, visits.length, photoCount)}</p>
}

export function BackupTile() {
  const fileInput = useRef<HTMLInputElement>(null)
  const { exportData, fileAwaitingTap, shareAgain } = useBackupExport()
  const restoreFromFile = useBackupRestore()

  return (
    <section className="tile settings-backup">
      <h2>{SETTINGS_COPY.backup}</h2>
      <p className="secondary-text settings-note">{SETTINGS_COPY.storageNote}</p>
      <BackupCounts />
      {fileAwaitingTap ? (
        <div className="settings-ready" role="status">
          <span>{SETTINGS_COPY.backupReady}</span>
          <button type="button" className="primary-button settings-action" onClick={() => void shareAgain(fileAwaitingTap)}>
            <ShareIcon />
            {SETTINGS_COPY.share}
          </button>
        </div>
      ) : (
        <button type="button" className="primary-button settings-action" onClick={() => void exportData()}>
          <ShareIcon />
          {SETTINGS_COPY.exportBackup}
        </button>
      )}
      <button type="button" className="settings-secondary settings-action" onClick={() => fileInput.current?.click()}>
        <ImportIcon />
        {SETTINGS_COPY.restoreBackup}
      </button>
      <input
        ref={fileInput}
        className="visually-hidden"
        type="file"
        accept={BACKUP_FILE_ACCEPT}
        tabIndex={-1}
        aria-label={SETTINGS_COPY.backupFile}
        onChange={(event) => void restoreFromFile(event)}
      />
    </section>
  )
}
