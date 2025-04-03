import React, { useEffect, useState } from "react";
import { auth } from "../../../firebase";
import { useNavigate } from "react-router"; // Fix import path
import Mapfirst from '../../map/Map'
import RestaurantList from "./RestaurantEntry";
import '../../assets/style/dashboard.css'
import HereMap from "./MyLocation";


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

const userPosition = { lat: 3.1195, lng: 35.5973 };


const restaurantList = [
  {
    name: "The Lounge",
    location: { lat: 3.1195, lng: 35.5973 },
  },
  {
    name: "White Sand Lodwar",
    location: { lat: 3.1200, lng: 35.6000 },
  },
  {
    name: "Ato's Bar and Lounge",
    location: { lat: 3.1180, lng: 35.5950 },
  },
  {
    name: "Antidote Bar and Grill",
    location: { lat: 3.1155, lng: 35.5925 },
  },
];



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
      navigate("/"); // Redirect to login page after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
 





  const [restaurantPosition, setRestaurantPosition] = useState(null);

  const onClickHandler_ = (location) => {
    setRestaurantPosition(location);
};
  

  return (
    <>
      <h1>Dashboard</h1>
      <h2>Welcome, {displayName}!</h2>
      <button onClick={handleLogout}>Logout</button>

      <section >
        <div  style = {
            {
                display: 'flex'
            }
        } >
        <RestaurantList list = {
            restaurantList
        }
        onClickHandler = {onClickHandler_}
        /> 
        </div>



        <Mapfirst apikey={apiKey}

        userPosition = {
          userPosition
      }
      restaurantPosition = {
          restaurantPosition
      }
        
        />

        <HereMap/>

      </section>
     
    </>
  );
}

export default Dashboard;
