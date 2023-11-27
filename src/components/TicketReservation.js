import React,{useState} from "react";
import {useLocation, useNavigate} from 'react-router-dom';
import axios from 'axios';
import './TicketReservation.css'
const TicketReservation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  console.log(location);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [cnic, setCnic] = useState("");
  
  const handleSubmit = (event) => {
    event.preventDefault();
    const form_data = {
        name,
        phoneNumber,
        cnic,
        seat_data:location.state
    }
    const postdata = async () => {
    const response = await axios.post("http://localhost:3000/ticket-reservation", form_data);
    console.log(response);
    if(response.status === 201){
        navigate("/profile/ticket-reservation/payment");
    }
    
    }
   postdata();
  };

  return (
    <div>
      <h1>Ticket Reservation</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <input
          max="100"
          type="tel"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(event) => setPhoneNumber(event.target.value)}
        />
        <input
          type="text"
          placeholder="CNIC"
          value={cnic}
          onChange={(event) => setCnic(event.target.value)}
        />
        <button type="submit">Proceed To Payment</button>
      </form>
    </div>
  );
};

export default TicketReservation;
