import React from 'react';
import ticketlogo from './Assests/ticket.png';
import printlogo from './Assests/print.png';
import trainschedule from './Assests/trainschedule.png';
import traintrack from './Assests/traintrack.png';
import trainfare from './Assests/trainfare.png'
import {Link} from 'react-router-dom';
import './Aside.css'; 

const Aside = () => {
  return (
    <aside className="aside">
      <h2>Navigation</h2>
      <ul>
        <li>
          <Link to="/profile/book-ticket">
            <img src={ticketlogo} alt="Book Ticket Logo" />
            Book Ticket
          </Link>
        </li>
        <li>
          <Link to="/profile/print-ticket">
            <img src={printlogo} alt="Print Ticket Logo" />
            Print Ticket
          </Link>
        </li>
        <li>
          <Link to="/profile/train-schedule">
            <img src={trainschedule} alt="Train Schedule Logo" />
            Train Schedule
          </Link>
        </li>
        <li>
          <Link to="/profile/train-routes">
            <img src={traintrack} alt="Train Routes Logo" />
            Train Routes
          </Link>
        </li>
        <li>
          <Link to="/profile/train-fares">
            <img src={trainfare} alt="Train Fares Logo" />
            Train Fares
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Aside;
