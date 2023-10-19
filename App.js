import React from "react"
import ReactDOM from "react-dom/client"
import Login from './src/components/Login'
import SignUp from './src/components/SignUp'
import Profile from './src/components/Profile'
import Userdetail from './src/components/Userdetail';
import BookTicket from './src/components/BookTicket'
import PrintTicket from './src/components/PrintTicket'
import TrainSchedule from './src/components/TrainSchedule'
import TrainRoutes from './src/components/TrainRoutes'
import TrainFares from './src/components/TrainFares'
import Allroute from './src/components/Allroute'
import Allseat from './src/components/Allseat'
import TicketReservation from "./src/components/TicketReservation"
import { createBrowserRouter, RouterProvider} from "react-router-dom" 

const router = createBrowserRouter([
    { 
     path: "/login",
     element: <Login/>
    },
    { 
     path: "/signup",
     element: <SignUp/>
    },
    { 
    path: "/profile",
    element: <Profile/>,
    children:[
     {
       path:"/profile",
       element:<Userdetail/>
     },
     {
       path:"/profile/book-ticket",
       element:<BookTicket/>,
     },
     {
       path:"/profile/print-ticket",
       element:<PrintTicket/>
     },
     {
       path:"/profile/train-schedule",
       element:<TrainSchedule/>
     },
     {
       path:"/profile/train-routes",
       element:<TrainRoutes/>
     },
     {
       path:"/profile/train-fares",
       element:<TrainFares/>
     },
     {
      path:"/profile/allroutes",
      element:<Allroute/>
     },
     {
      path:"/profile/selectseat/:trainId/:routeId",
      element:<Allseat/>
     },
     {path:"/profile/ticket-reservation",
      element:<TicketReservation/>}]
    }
    ]);

const AppLayout = () =>{
    return(
      <Login/>
    )
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<RouterProvider router={router}></RouterProvider>) 