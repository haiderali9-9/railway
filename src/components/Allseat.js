import React, { useState, useEffect } from 'react';
import { useParams } from'react-router-dom';
import axios from 'axios';
import './Allseat.css';

const Allseat = () => {
  const [seatData, setSeatData] = useState([]);
  const {trainId,routeId} = useParams();
  
  useEffect(() => {
     const getData  = async () => {
        const response = await axios.get(`http://localhost:3000/seat-details/${trainId}/${routeId}`);
        setSeatData(response.data);
        console.log(response.data);
     }
     getData();
     
  }, [trainId,routeId]);
    
  return (
    <div>
      <h2>Seat Booking Details</h2>
      <div>
        <h3>All Seats</h3>
        <ul className="seat-list">
        {seatData?.map((seat) => (
            <li key={seat.seat_id} className={(seat.seat_status === 'booked') ? 'booked' : 'available'}>
                {
                  (seat.seat_status === 'booked') ? `Seat Booked ${seat.seat_number}`: (<a href=""> Book Seat {seat.seat_number}</a>)
                }
          </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Allseat;
