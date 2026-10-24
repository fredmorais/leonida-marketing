import { useAppContext } from '../app-context'
import { PrivacyPage } from '../components/PrivacyPage'

export function PrivacyRoute() {
  const { t } = useAppContext()
  return <PrivacyPage t={t} />
}
