import React from 'react';
import ticketlogo from './Assests/ticket.png';
import printlogo from './Assests/print.png';
import trainschedule from './Assests/trainschedule.png';
import traintrack from './Assests/traintrack.png';
import trainfare from './Assests/trainfare.png'
import { useNavigate, Link } from 'react-router-dom';
import axios from "axios";
import './Aside.css'; 


const Aside = () => {
  const navigate = useNavigate();
  const logoutHandle = () =>{
    const fetchData = async () => {
     const response = await axios.get('http://localhost:3000/logout');
     if(response.status == 200){
        navigate('/login');
     }
    }
    fetchData();
}
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
        <button type="button" onClick={logoutHandle}>Log Out</button>
      </ul>
    </aside>
  );
};

export default Aside;
