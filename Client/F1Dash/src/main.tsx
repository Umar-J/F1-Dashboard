import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Schedule from './Pages/Schedule.tsx'
import Dashboard from './Pages/Dashboard.tsx'

const router = createBrowserRouter([
  {
  path: '/',
  element: <App />,
  }, 
  {
    path: '/schedule',
    element: <Schedule />,
  },
  {
    path: '/dashboard',
    element: <Dashboard/>
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
