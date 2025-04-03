import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import router from './components/Router/browserRouter.jsx'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'




import './index.css'

import {AuthProvider} from './components/Others/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>

    <AuthProvider>
      <RouterProvider router={router}/>
       
     
    </AuthProvider>
    
   
   
   
  </StrictMode>,
)
