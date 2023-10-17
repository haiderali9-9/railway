import React from 'react';

const UserInformation = () => {
  const [userData,setUserData] = React.useState(JSON.parse(localStorage.getItem("user")));

  return (
    <div className="user-info">
      <ul>
      <h2>User Information</h2>
        <li>
          <strong>User ID:</strong> {userData.passenger_id}
        </li>
        <li>
          <strong>User Name:</strong> {userData.passenger_name}
        </li>
        <li>
          <strong>User Phone Number:</strong> {userData.passenger_phone_number}
        </li>
        <li>
          <strong>User Email:</strong> {userData.passenger_email}
        </li>
      </ul>
    </div>
  );
};

export default UserInformation;
