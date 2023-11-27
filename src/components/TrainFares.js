import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactEcharts from "echarts-for-react";

const TrainFares = () => {
  const [trainFares, setTrainFares] = useState([]);
  const [routeOptions, setRouteOptions] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState("");

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/train-fares");
        setTrainFares(response.data);

        // Extract unique route_ids for filter options
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

  const handleRouteChange = (event) => {
    setSelectedRoute(event.target.value);
  };

  // Filter fares based on the selected route
  const filteredFares = selectedRoute
    ? trainFares.filter(
        (fare) => String(fare.fare_route_id) === String(selectedRoute)
      )
    : trainFares;

  // Prepare data for ECharts
  const chartData = filteredFares.map((fare) => ({
    name: `ID: ${fare.fare_id}`,
    value: fare.fare_price,
  }));

  const option = {
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b} : {c} ({d}%)",
    },
    series: [
      {
        name: "Fare Price",
        type: "pie",
        radius: "55%",
        center: ["50%", "50%"],
        data: chartData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };

  return (
    <div>
      <h2>Train Fares</h2>

      {/* Route Filter Dropdown */}
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

      {/* ECharts Pie Chart */}
      <ReactEcharts option={option} style={{ height: "400px" }} />
    </div>
  );
};

export default TrainFares;