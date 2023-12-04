import React from "react";
import Header from "./header";
import Aside from "./aside";
import { Outlet } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  return (
    <div className="profileContainer">
      <div>
        <Header />
      </div>
      <div className="contentWrapper">
        <Aside />
        <Outlet />
      </div>
    </div>
  );
};

export default Profile;
