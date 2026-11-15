import { IonContent, IonPage } from '@ionic/react'
import { Link } from 'react-router-dom'
import { NewVisitLink } from '../../components/NewVisitLink'
import { monthHeading } from '../../copy/labels'
import { useRecords } from '../../data/hooks'
import { NEW_VISIT_IN_VISITS_PATH, RESTAURANTS_PATH } from '../../navigation/paths'
import { VISITS_COPY } from './copy'
import { visitMonths } from './visitMonths'
import { VisitRow } from './VisitRow'
import './visits.css'

function EmptyVisits() {
  return (
    <div className="empty-note visits-empty">
      <p>{VISITS_COPY.empty}</p>
      <Link className="quiet-button" to={RESTAURANTS_PATH}>
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
          <h1 className="page-title">{VISITS_COPY.title}</h1>
          {records && months.length === 0 && <EmptyVisits />}
          {months.map(({ month, visits }) => (
            <section key={month}>
              <h2 className="visits-month-heading">{monthHeading(month)}</h2>
              <ul className="list-panel">
                {visits.map((summary) => (
                  <li key={summary.visit.id}>
                    <VisitRow summary={summary} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <NewVisitLink to={NEW_VISIT_IN_VISITS_PATH} />
      </IonContent>
    </IonPage>
  )
}
