import React from 'react';

const useUserdetail = (location) => {
    const [userData,setUserData] = React.useState({
        "passenger_id": 0,
        "passenger_name": "default",
        "passenger_email": "default",
        "passenger_phone_number": "default",
        "passenger_date_of_birth": "default",
        "passenger_password": "default"
      });
     
      React.useEffect(() => {
        if (location.state !== null){
          setUserData(location.state);
        }
      },[location.state]);

      return userData;
}
export default useUserdetail;