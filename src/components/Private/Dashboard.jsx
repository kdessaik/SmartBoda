import React, { useEffect, useState } from "react";
import { auth } from "../../../firebase";
import { useNavigate } from "react-router";
import Mapfirst from "../../map/Map";
import RestaurantList from "./RestaurantEntry";
import "../../assets/style/dashboard.css";

function Dashboard() {
  const apiKey = import.meta.env.VITE_Here_MAP_API_KEY;

  const [userPosition, setUserPosition] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [restaurantPosition, setRestaurantPosition] = useState(null);

  const [userData, setUserData] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");

  const navigate = useNavigate();

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

  // Handle user logout
  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Get current user info
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserData(user);
        setDisplayName(user.displayName || "User");
      } else {
        navigate("/register");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Real-time location tracking
  useEffect(() => {
    let watchId;

    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          setUserPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLoadingLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationError(error.message);
          setLoadingLocation(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        },
        // Run once on mount
        
        
      );
    } else {
      setLocationError("Geolocation not supported");
      setLoadingLocation(false);
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  const onClickHandler_ = (location) => {
    setRestaurantPosition(location);
  };

  if (loadingLocation) {
    return <p>Getting your location...</p>;
  }

  if (locationError) {
    return (
      <div>
        <p>Error: {locationError}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }


// Run once on mount

// Run once on mount


  return (
    <>
      <h1>Dashboard</h1>
      <h2>Welcome, {displayName}!</h2>
      <button onClick={handleLogout}>Logout</button>

      <section>
        <div style={{ display: "flex" }}>
          <RestaurantList
            list={restaurantList}
            onClickHandler={onClickHandler_}
          />
        </div>

        <Mapfirst
          apikey={apiKey}
          userPosition={userPosition}
          restaurantPosition={restaurantPosition}
        />
      </section>
    </>
  );
}

export default Dashboard;
