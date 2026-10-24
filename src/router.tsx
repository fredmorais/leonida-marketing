import { createBrowserRouter, Navigate } from 'react-router-dom'
import { App } from './app'
import { cities } from './data/cities'
import { AboutPage } from './pages/about-page'
import { MapPage } from './pages/map-page'
import { PrivacyPage } from './pages/privacy-page'
import { TermsPage } from './pages/terms-page'

const cityRoutes = cities.map(city => ({
  index: city.route === '/' ? true as const : undefined,
  path: city.route === '/' ? undefined : city.route.slice(1),
  element: null,
}))

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        element: <MapPage />,
        children: [
          ...cityRoutes,
          { path: 'action/:actionId', element: null },
        ],
      },
      { path: 'about', element: <AboutPage /> },
      { path: 'privacy', element: <PrivacyPage /> },
      { path: 'terms', element: <TermsPage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])
