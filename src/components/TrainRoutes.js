import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Allroute.css";

const Trainroute = () => {
  const [trainRoutes, setTrainRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState("");
  const [selectedTrain, setSelectedTrain] = useState("");
  const [shakeIcon, setShakeIcon] = useState(false); // State for animation

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("http://localhost:3000/train-routes");
      if (response.status === 200) {
        setTrainRoutes(response.data);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const shakeTimer = setTimeout(() => {
      setShakeIcon(true);
    }, 5000); // After 5 seconds, the icon will start shaking

    return () => clearTimeout(shakeTimer); // Clear the timeout on unmount
  }, []);

  const handleRouteSelect = (event) => {
    setSelectedRoute(event.target.value);
  };

  const handleTrainSelect = (event) => {
    setSelectedTrain(event.target.value);
  };

  const filteredRoutes = trainRoutes.filter(
    (route) =>
      (!selectedRoute || route.id === parseInt(selectedRoute)) &&
      (!selectedTrain || route.train_name === selectedTrain)
  );

  return (
    <div>
      {/* Select dropdown for route IDs */}
      <label htmlFor="routeSelect">Select Route ID:</label>
      <select
        id="routeSelect"
        onChange={handleRouteSelect}
        value={selectedRoute}
      >
        <option value="">All Routes</option>
        {trainRoutes.map((route) => (
          <option key={route.id} value={route.id}>
            {route.id}
          </option>
        ))}
      </select>

      {/* Select dropdown for train names */}
      <label htmlFor="trainSelect">Select Train Name:</label>
      <select
        id="trainSelect"
        onChange={handleTrainSelect}
        value={selectedTrain}
      >
        <option value="">All Trains</option>
        {Array.from(new Set(trainRoutes.map((route) => route.train_name))).map(
          (trainName) => (
            <option key={trainName} value={trainName}>
              {trainName}
            </option>
          )
        )}
      </select>

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
          {filteredRoutes.map((route) => (
            <tr key={route.id}>
              <td>{route.id}</td>
              <td>{route.source_station}</td>
              <td>{route.destination_station}</td>
              <td>{route.distance} km</td>
              <td>{route.duration} minutes</td>
              <td className={shakeIcon ? "shake" : ""}>{route.train_name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Trainroute;
