import { useState } from 'react'
import { ChatIcon, OpenIcon } from '../../components/icons'
import { SETTINGS_COPY } from './copy'
import { FeedbackSheet } from './FeedbackSheet'

export function FeedbackTile() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <section className="tile settings-panel">
      <h2>{SETTINGS_COPY.feedback}</h2>
      <button type="button" className="feedback-row" onClick={() => setIsOpen(true)}>
        <ChatIcon />
        <span className="feedback-row-label">{SETTINGS_COPY.reportBugOrIdea}</span>
        <span className="feedback-row-open">
          <OpenIcon />
        </span>
      </button>
      <p className="feedback-panel-note">{SETTINGS_COPY.feedbackFooter}</p>
      <FeedbackSheet isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </section>
  )
}
