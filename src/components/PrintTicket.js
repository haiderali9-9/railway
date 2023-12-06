import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import logo from "./Assests/logo1.png";

const Ticket = ({ ticket }) => {
  const handleExportToPDF = () => {
    const ticketContainer = document.getElementById(
      `ticket-${ticket.ticket_id}`
    );

    if (!ticketContainer) {
      console.error(`Ticket container not found for ID ${ticket.ticket_id}`);
      return;
    }

    const pdf = new jsPDF();

    // Load the logo from the Assets folder and position it in the horizontal center on the top
    const imgData = logo;
    const imgWidth = 40; // Adjust the image width as needed
    const imgHeight = 40; // Adjust the image height as needed
    const centerX = (pdf.internal.pageSize.width - imgWidth) / 2;
    pdf.addImage(imgData, "PNG", centerX, 10, imgWidth, imgHeight);

    // Adjust the y-coordinates to position the text below the logo
    pdf.text(`Ticket ID: ${ticket.ticket_id}`, 20, 60);
    pdf.text(`Passenger ID: ${ticket.passenger_id}`, 20, 80);
    pdf.text(`Wagon ID: ${ticket.wagon_id}`, 20, 100); // Updated to wagon_id
    pdf.text(`Booking Date: ${ticket.booking_date}`, 20, 120);
    pdf.text(`Train Name: ${ticket.train_name}`, 20, 140);
    pdf.text(`Seat Number: ${ticket.seat_number}`, 20, 160); // Updated to seat_number

    pdf.save(`ticket_${ticket.ticket_id}.pdf`);
  };

  return (
    <div
      key={ticket.ticket_id}
      id={`ticket-${ticket.ticket_id}`}
      className="ticket"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 300 170" // Adjusted the viewBox to accommodate additional text
        width="300"
        height="170"
      >
        {/* Ticket border */}
        <rect width="100%" height="100%" fill="#fff" stroke="#000" />

        {/* Ticket header */}
        <rect x="0" y="0" width="100%" height="20" fill="#f2f2f2" />

        {/* Ticket details */}
        <text x="20" y="40" fontSize="12" fill="#000">
          Ticket ID: {ticket.ticket_id}
        </text>
        <text x="20" y="60" fontSize="12" fill="#000">
          Passenger ID: {ticket.passenger_id}
        </text>
        <text x="20" y="80" fontSize="12" fill="#000">
          Wagon ID: {ticket.wagon_id}
        </text>
        <text x="20" y="100" fontSize="12" fill="#000">
          Booking Date: {ticket.booking_date}
        </text>
        <text x="20" y="120" fontSize="12" fill="#000">
          Train Name: {ticket.train_name}
        </text>
        <text x="20" y="140" fontSize="12" fill="#000">
          Seat Number: {ticket.seat_number}
        </text>
      </svg>
      <button onClick={handleExportToPDF}>Export to PDF</button>
    </div>
  );
};

const PrintTickets = ({ passengerId }) => {
  const [ticketData, setTicketData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/print_ticket`);
        const data = await response.json();
        setTicketData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [passengerId]);

  return (
    <div>
      <h2>Ticket Information</h2>
      {ticketData ? (
        <div>
          {ticketData.map((ticket) => (
            <Ticket key={ticket.ticket_id} ticket={ticket} />
          ))}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default PrintTickets;
