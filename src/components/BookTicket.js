import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import './BookTicket.css'

const BookTicket = () => {
  const [stations, setStations] = useState([]);
  const [fromStation, setFromStation] = useState("");
  const [toStation, setToStation] = useState("");
  const [date, setDate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStations = async () => {
      const response = await axios.get("http://localhost:3000/station");
      setStations(response.data);
      
    };
   fetchStations();
  
  }, []);

  const handleSelect = (event) => {
    const selectedStation = event.target.value;
    if (event.target.name === "fromStation") {
      setFromStation(selectedStation);
    } else if (event.target.name === "toStation") {
      setToStation(selectedStation);
    }
  };

  const handleDateSelect = (event) => {
    setDate(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = {
      fromStation,
      toStation,
      date
    }
    const fetchroutes = async () => {
    const response = await axios.post("http://localhost:3000/routes-detail",formData);
    localStorage.setItem('trainroutes', JSON.stringify(response.data));
    navigate('/profile/allroutes');
    }
    fetchroutes();
    
  };
  return (
    <div>
      <h1>Station Selector</h1>

      <form className="station-selector" onSubmit={handleSubmit}>
        <select name="fromStation" onChange={handleSelect}>
          <option value="">Select From Station</option>
          {stations.map((station) => (
            <option key={station.id} value={station.name}>
              {station.name}
            </option>
          ))}
        </select>

        <select name="toStation" onChange={handleSelect}>
          <option value="">Select To Station</option>
          {stations.map((station) => (
            <option key={station.id} value={station.name}>
              {station.name}
            </option>
          ))}
        </select>

        <input type="date" name="date" onChange={handleDateSelect} />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default BookTicket;
