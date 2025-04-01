import React, { useEffect, useState } from "react";
import { auth } from "../../../firebase";
import { useNavigate } from "react-router"; // Fix import path
import Map from "../../map/Map";


const containeStyle={
  width:'85vw',
  height:'85vh',
}
const center={
  lat:3.7166638 ,
  lng:34.8666632,
};

const origin = { lat: 3.7166638, lng: 34.8666632 }; //Motorbike location (Kakuma)
const destination = { lat: 3.11911, lng: 35.59727 }; // Customer location(Lodwar)



const apiKey=import.meta.env.VITE_Here_MAP_API_KEY



function Dashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [displayName, setDisplayName] = useState("");


  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");



















  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserData(user);
        setDisplayName(user.displayName || "User"); // Set display name
      } else {
        navigate("/register"); // Redirect if not authenticated
      }
    });

    return () => unsubscribe(); // Cleanup listener
  }, [navigate]);



  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login"); // Redirect to login page after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
 

  const handleDirectionsCallback = (response) => {
    if (response !== null && response.status === "OK") {
      setDirectionsResponse(response);
      setDistance(response.routes[0].legs[0].distance.text);
      setDuration(response.routes[0].legs[0].duration.text);
    }
  };
  

  return (
    <>
      <h1>Dashboard</h1>
      <h2>Welcome, {displayName}!</h2>
      <button onClick={handleLogout}>Logout</button>

      <section >
        <Map apikey={apiKey}/>

      </section>
     
    </>
  );
}

export default Dashboard;
