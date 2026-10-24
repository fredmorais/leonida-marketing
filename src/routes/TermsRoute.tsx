import { useAppContext } from '../app-context'
import { TermsPage } from '../components/TermsPage'

export function TermsRoute() {
  const { t } = useAppContext()
  return <TermsPage t={t} />
}
