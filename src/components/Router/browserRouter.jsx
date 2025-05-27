

import { createBrowserRouter } from 'react-router'
import{lazy,Suspense} from 'react'


//Lazy for loading pages

const Home=lazy(()=>import('../Public/Home.jsx'))
const About=lazy(()=>import('../Public/About.jsx'))
const NotFound=lazy(()=>import('../Public/NotFound.jsx'))
const Help=lazy(()=>import('../Public/Help.jsx'))
const Register=lazy(()=>import('../Auth/Register.jsx'))
const Dashboard=lazy(()=>import('../Private/Dashboard.jsx'))
const Login=lazy(()=>import('../Auth/Login.jsx'))
const DashboardBoda=lazy(()=>import('../Private/DashboardBoda.jsx'))
const BodaDashboard=lazy(()=>import('../Private/BodaDashboard.jsx'))
const Admin=lazy(()=>import('../Admin/AdminDashboard.jsx'))
const Profile=lazy(()=>import('../Private/Profile.jsx'))
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
        path:'/help',
        element:
        <Suspense fallback={<div>Loading...</div>}>
            <Help/>
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
    },
    {
        path:'/Dashboardboda',
        element:<Suspense fallback={<div>Loarding...</div>}>
            <DashboardBoda/>
        </Suspense>
    },
    {
        path:'/BodaDashboard',
        element:<Suspense fallback={<div>Loarding...</div>}>
            <BodaDashboard/>
        </Suspense>

    },
    {
        path:'/Admin',
        element:<Suspense fallback={<div>Loarding...</div>}>
            <Admin/>
        </Suspense>
    },
    {
        path:'/Profile',
        element:<Suspense fallback={<div>Loarding...</div>}>
            <Profile/> </Suspense>
    }
])
export default router