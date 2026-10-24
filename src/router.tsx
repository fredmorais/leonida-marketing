import { createBrowserRouter, Navigate } from 'react-router-dom'
import { App } from './App'
import { cities } from './data/cities'
import { AboutRoute } from './routes/AboutRoute'
import { MapRoute } from './routes/MapRoute'
import { PrivacyRoute } from './routes/PrivacyRoute'
import { TermsRoute } from './routes/TermsRoute'

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
        element: <MapRoute />,
        children: [
          ...cityRoutes,
          { path: 'action/:actionId', element: null },
        ],
      },
      { path: 'about', element: <AboutRoute /> },
      { path: 'privacy', element: <PrivacyRoute /> },
      { path: 'terms', element: <TermsRoute /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])
