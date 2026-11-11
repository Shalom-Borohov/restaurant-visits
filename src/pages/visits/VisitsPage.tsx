import { IonContent, IonPage } from '@ionic/react'
import { Link } from 'react-router-dom'
import { monthHeading } from '../../copy/labels'
import { useRecords } from '../../data/hooks'
import { RESTAURANTS_PATH } from '../../navigation/paths'
import { VISITS_COPY } from './copy'
import { visitMonths } from './visitMonths'
import { VisitRow } from './VisitRow'
import './visits.css'

function EmptyVisits() {
  return (
    <div className="empty-note">
      <p>{VISITS_COPY.empty}</p>
      <Link className="visits-empty-link" to={RESTAURANTS_PATH}>
        {VISITS_COPY.toRestaurants}
      </Link>
    </div>
  )
}

export function VisitsPage() {
  const records = useRecords()
  const months = records ? visitMonths(records) : []

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="page-body">
          <header className="glaze-header">
            <h1 className="glaze-title">{VISITS_COPY.title}</h1>
          </header>
          {records && months.length === 0 && <EmptyVisits />}
          {months.map(({ month, visits }) => (
            <section key={month} className="visit-month">
              <h2 className="visit-month-heading">{monthHeading(month)}</h2>
              <div className="page-stack">
                {visits.map((summary) => (
                  <VisitRow key={summary.visit.id} summary={summary} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </IonContent>
    </IonPage>
  )
}
