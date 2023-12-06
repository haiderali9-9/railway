import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./TicketReservation.css";

const TicketReservation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { state: seatData = {} } = location;

  const [cnic, setCnic] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form_data = {
      cnic,
      seat_data: seatData,
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/ticket-reservation",
        form_data
      );

      if (response.status === 201) {
        navigate("/profile/ticket-reservation/payment");
      }
    } catch (error) {
      console.error("Error during ticket reservation:", error);
      alert(error.response?.data || "An error occurred");
    }
  };

  return (
    <div>
      <h1>Ticket Reservation</h1>
      <form onSubmit={handleSubmit}>
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
