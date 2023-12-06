import React, { useEffect, useState } from "react";

const FancyTicket = ({ ticket }) => {
  return (
    <div className="fancy-ticket">
      <svg width="300" height="150">
    
        <rect width="100%" height="100%" fill="#f3f3f3" />
        <rect x="10" y="10" width="280" height="130" fill="#ffffff" />
        <rect x="10" y="10" width="100%" height="20" fill="#3498db" />
        <text x="20" y="30" fill="#ffffff" fontSize="16" fontWeight="bold">
          Ticket Details
        </text>

       
        <text x="20" y="60">
          Ticket ID: {ticket.ticket_id}
        </text>
        <text x="20" y="80">
          Passenger Name: {ticket.passenger_name}
        </text>
        <text x="20" y="100">
          Seat Number: {ticket.seat_number}
        </text>
        <text x="20" y="120">
          Wagon ID: {ticket.wagon_id}
        </text>
        <text x="20" y="140">
          Passenger Phone: {ticket.passenger_phone_number}
        </text>
      </svg>
    </div>
  );
};

const PrintTicket = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    
    fetch("http://localhost:3000/print_ticket")
      .then((response) => response.json())
      .then((data) => setTickets(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="ticket-app">
      <h2>Print Tickets</h2>
      {tickets.map((ticket) => (
        <FancyTicket key={ticket.ticket_id} ticket={ticket} />
      ))}
    </div>
  );
};

export default PrintTicket;
