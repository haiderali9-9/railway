import React from 'react';
import { Link } from 'react-router-dom';
import './Allroute.css'
const Allroute  = () => {
   const [trainRoutes,setTrainRoutes] = React.useState(JSON.parse(localStorage.getItem("trainroutes")));
   return (
     <div>
       <table>
         <thead>
           <tr>
             <th>ID</th>
             <th>Source Station</th>
             <th>Destination Station</th>
             <th>Distance</th>
             <th>Duration</th>
             <th>Train Name</th>
           </tr>
         </thead>
         <tbody>
           {trainRoutes.map((route) => (
             <tr key={route.id}>
               <td>{route.id}</td>
               <td>{route.source_station}</td>
               <td>{route.destination_station}</td>
               <td>{route.distance} km</td>
               <td>{route.duration} minutes</td>
               <td>{route.train_name}</td>
               <td>
                 <Link
                   state = {route}
                   to={`/profile/selectseat/${route.train_name
                     .split(" ")
                     .join("")}/${route.id}`}
                 >
                   Book Ticket
                 </Link>
               </td>
             </tr>
           ))}
         </tbody>
       </table>
     </div>
   );
 
}

export default Allroute;
    



