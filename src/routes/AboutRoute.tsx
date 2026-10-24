import { useAppContext } from '../app-context'
import { AboutPage } from '../components/AboutPage'

export function AboutRoute() {
  const { t } = useAppContext()
  return <AboutPage t={t} />
}
