import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Chart from "chart.js/auto";
import "./TrainFares.css";
import "./Allroute.css";

const TrainFares = () => {
  const [trainFares, setTrainFares] = useState([]);
  const [routeOptions, setRouteOptions] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/train-fares");
        setTrainFares(response.data);

        const uniqueRouteIds = Array.from(
          new Set(response.data.map((fare) => fare.fare_route_id))
        );
        setRouteOptions(uniqueRouteIds);
      } catch (error) {
        console.error("Error fetching train fares:", error);
      }
    };

    getData();
  }, []);

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext("2d");
      const { labels, data } = getChartData();

      chartInstance.current = new Chart(ctx, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: "Fare Price",
              data,
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        },
      });
    }
  }, [selectedRoute, selectedClass, trainFares]);

  const handleRouteChange = (event) => {
    setSelectedRoute(event.target.value);
  };

  const handleClassChange = (event) => {
    setSelectedClass(event.target.value);
  };

  const getChartData = () => {
    let filteredFares = trainFares;

    if (selectedRoute) {
      filteredFares = filteredFares.filter(
        (fare) => String(fare.fare_route_id) === String(selectedRoute)
      );
    }

    if (selectedClass) {
      filteredFares = filteredFares.filter(
        (fare) => String(fare.fare_class) === String(selectedClass)
      );
    }

    const labels = filteredFares.map((fare) => `ID: ${fare.fare_id}`);
    const data = filteredFares.map((fare) => fare.fare_price);

    return { labels, data, filteredFares };
  };

  return (
    <div className="train-fares-container">
      <h2>Train Fares</h2>

      <label htmlFor="routeFilter">Filter by Route ID:</label>
      <select
        id="routeFilter"
        onChange={handleRouteChange}
        value={selectedRoute}
      >
        <option value="">All Routes</option>
        {routeOptions.map((routeId) => (
          <option key={routeId} value={routeId}>
            {routeId}
          </option>
        ))}
      </select>

      <label htmlFor="classFilter">Filter by Class:</label>
      <select
        id="classFilter"
        onChange={handleClassChange}
        value={selectedClass}
      >
        <option value="">All Classes</option>
        {Array.from(new Set(trainFares.map((fare) => fare.fare_class))).map(
          (fareClass) => (
            <option key={fareClass} value={fareClass}>
              {fareClass}
            </option>
          )
        )}
      </select>

      <div className="flex-container">
        <div className="chart-container">
          <canvas ref={chartRef} width={400} height={200} />
        </div>

        <table className="table-container">
          <thead>
            <tr>
              <th>ID</th>
              <th>Route Id</th>
              <th>Class</th>
              <th>Price</th>
              <th>From Station</th>
              <th>To Station</th>
            </tr>
          </thead>
          <tbody>
            {getChartData().filteredFares.map((fare) => (
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
    </div>
  );
};

export default TrainFares;
