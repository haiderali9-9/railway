import React, { useState, useEffect } from "react";
import axios from "axios";

const TrainSchedule = () => {
  const [scheduleData, setScheduleData] = useState([]);

  useEffect(() => {
    const fetchTrainSchedule = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/train-schedule"
        );
        setScheduleData(response.data);
      } catch (error) {
        console.error("Error fetching train schedule:", error);
      }
    };

    fetchTrainSchedule();
  }, []);

  return (
    <div>
      <h2>Train Schedule</h2>
      <table>
        <thead>
          <tr>
            <th>Schedule ID</th>
            <th>Train Name</th>
            <th>Station Name</th>
            <th>Arrival Time</th>
            <th>Departure Time</th>
          </tr>
        </thead>
        <tbody>
          {scheduleData.map((schedule) => (
            <tr key={schedule.schedule_id}>
              <td>{schedule.schedule_id}</td>
              <td>{schedule.train_name}</td>
              <td>{schedule.station_name}</td>
              <td>{schedule.arrival_time}</td>
              <td>{schedule.departure_time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TrainSchedule;