import React, { useEffect, useState } from "react";
import { auth } from "../../../firebase";
import { useNavigate } from "react-router"; // Fix import path
import {GoogleMap, LoadScript,DirectionsService, DirectionsRenderer} from '@react-google-maps/api'

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



const apiKey=import.meta.env.VITE_GOOGLE_MAP_API_KEY

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
      <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap mapContainerStyle={containeStyle} center={center} zoom={10}>
        <DirectionsService
          options={{
            destination: destination,
            origin: origin,
            travelMode: "DRIVING",
          }}
          callback={handleDirectionsCallback}
        />

{directionsResponse && (
          <DirectionsRenderer options={{ directions: directionsResponse }} />
        )}

        </GoogleMap>

        <div style={{ padding: "10px", background: "#fff", marginTop: "10px" }}>
        <h3>Delivery Details</h3>
        <p><strong>Distance:</strong> {distance}</p>
        <p><strong>Estimated Time:</strong> {duration}</p>
      </div>





      </LoadScript>
    </>
  );
}

export default Dashboard;
