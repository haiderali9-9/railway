import React from 'react';
import Logo from './logo';
import trainlogo from "./Assests/logo.webp";

import'./header.css';
const Header = () => {
  const [userData,setUserData] = React.useState(JSON.parse(localStorage.getItem("user")));

  return (
    <div className="header">
      <div className="left">
        <div className="user-info">
          <Logo firstName={userData?.passenger_name} />
          <div className="user-details">
            <h3>{userData?.passenger_name}</h3>
            <p>@{userData?.passenger_name.toLowerCase()}</p>
          </div>
        </div>
      </div>
      <div className="right">
        <div className="railway-info">
          <img src={trainlogo} alt="Railway Logo" />
          <div className="railway-details">
            <h3>Pakistan Railway</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
