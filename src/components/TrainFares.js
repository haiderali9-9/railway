import React from 'react';
import axios from "axios";

const TrainFares  = () => {
   const [trainfares, setTrainFares] = React.useState([]);
   React.useEffect(() => {
     const getData  = async () => {
     const response = await axios.get('http://localhost:3000/train-fares');
     setTrainFares(response.data);
     }
     getData();
   }, []);
   
   return (
      <div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Route Id </th>
              <th>Class</th>
              <th>Price</th>
              <th>From Station</th>
              <th>To Station</th>
            </tr>
          </thead>
          <tbody>
            {trainfares.map((fare) => (
              <tr key={fare.fare_id}>
                <td>{fare.fare_id}</td>
                <td>{fare.fare_route_id}</td>
                <td>{fare.fare_class}</td>
                <td>{fare.fare_price}</td>
                <td>{fare.from_station}</td>
                <td>{fare.to_station}</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
 
}

export default TrainFares;
    
