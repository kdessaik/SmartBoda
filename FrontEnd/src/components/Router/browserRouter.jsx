

import { createBrowserRouter } from 'react-router'
import{lazy,Suspense} from 'react'


//Lazy for loading pages

const Home=lazy(()=>import('../Public/Home.jsx'))
const About=lazy(()=>import('../Public/About.jsx'))
const NotFound=lazy(()=>import('../Public/NotFound.jsx'))
const Register=lazy(()=>import('../Auth/Register.jsx'))
const Dashboard=lazy(()=>import('../Private/Dashboard.jsx'))
const Login=lazy(()=>import('../Auth/Login.jsx'))

const router=createBrowserRouter([
    {
        path:'/',
        element:<Suspense fallback={<div>Loading...</div>}>

            <Home/>
        </Suspense>
        
        ,
    },
    {
        path:'/about',
        element:
        <Suspense fallback={<div>Loading...</div>}>
            <About/>
        </Suspense>
        
        ,
    },
    {
        path:'*',// Catch-all route for 404
        element:<Suspense fallback={<div>Loarding...</div>}>
            <NotFound/>
        </Suspense>
        
        ,
    },
    {
        path:'/Register',// Catch-all route for 404
        element:<Suspense fallback={<div>Loarding...</div>}>
            <Register/>
        </Suspense>
        
        ,
    },

    {
        path:'/Dashboard',
        element:<Suspense fallback={<div>Loading...</div>}>
            <Dashboard/>
        </Suspense>
    },
    {
        path:'/Login',
        element:<Suspense fallback={<div>Loading...</div>}>
            <Login/>
        </Suspense>
    }
])
export default router