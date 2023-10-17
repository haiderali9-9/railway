import React from "react";
import Header from "./header";
import Aside from "./aside";
import { Outlet } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  return (
      <>
      <div>
      <Header/>
      </div>
      <div style={{display:"flex",height: 'calc(100vh - 64.11px)'}}>
      <Aside/>
      <Outlet />
      </div>
      </>
    );

};

export default Profile;
