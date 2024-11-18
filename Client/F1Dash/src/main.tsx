import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Schedule from './Pages/Schedule.tsx'

const router = createBrowserRouter([
  {
  path: '/',
  element: <App />,
  }, 
  {
    path: '/schedule',
    element: <Schedule />,
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
