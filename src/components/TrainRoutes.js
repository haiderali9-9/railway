import React , {useState, useEffect} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Allroute.css'
const Trainroute  = () => {
   const [trainRoutes,setTrainRoutes] = useState([]);

   useEffect(() => {
     const fetchData = async () => {
       const response = await axios.get("http://localhost:3000/train-routes");
       console.log(response.data);
       if (response.status === 200) {
         setTrainRoutes(response.data);
       }
     };
     fetchData();
   },[]);

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
              <tr key={route?.id}>
                <td>{route?.id}</td>
                <td>{route?.source_station}</td>
                <td>{route?.destination_station}</td>
                <td>{route?.distance} km</td>
                <td>{route?.duration} minutes</td>
                <td>{route?.train_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
 
}

export default Trainroute;
    



