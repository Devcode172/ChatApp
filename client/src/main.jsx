// import {StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Home from './pages/home/Home.jsx'
import Login from './pages/authentication/Login.jsx'
import Signup from './pages/authentication/Signup.jsx'
import { createBrowserRouter , RouterProvider } from 'react-router-dom'
import { store } from './store/store.js'
import {Provider} from 'react-redux'
import ProtectedRoute from './componenets/ProtectedRoute.jsx'
const router = createBrowserRouter([
  {
    path : '/',
    element : <App/>,
  children :[
    {
      path : '/',
      element : <ProtectedRoute> <Home/> </ProtectedRoute>
    },
    {
      path : '/signup',
      element: <Signup/>
    },
    {
      path : '/login',
      element : <Login/>
    }
  ]
}
])

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
   </Provider>
)
