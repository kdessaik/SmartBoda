import React, { useEffect, useState } from "react";
import { auth } from "../../../firebase";
import { useNavigate } from "react-router";
import Mapfirst from "../../map/Map";
import RestaurantList from "./RestaurantEntry";
import "../../assets/style/dashboard.css";
import { updateUserLocation } from "../../map/Map";
import '../../assets/style/privateComponent.css';
import underDevImg2 from "../../assets/image/UnderDev3.png";

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
      console.error("Logout failed Now:", error);
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
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
  
          setUserPosition(coords);              // Update map state
          setLoadingLocation(false);            // Mark loading as done
          setLocationError(null);               // Clear any previous errors
  
          // Update Firebase and actual location if user is logged in
          if (auth.currentUser) {
            const uid = auth.currentUser.uid;
            updateUserLocation(uid, position.coords);
           
          }
          
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationError(error.message);
          setLoadingLocation(false);
          // If user denies location, redirect to home after short delay
        setTimeout(() => {
          navigate("/");
        }, 20000);


        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        }
      );
    } else {
      // If geolocation is not supported, redirect immediately
    setLocationError("Geolocation is not supported by this browser.");
    setLoadingLocation(false);
    navigate("/");
  
    }
  
    // Cleanup watcher on component unmount
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [navigate]);



  
  const onClickHandler_ = (location) => {
    setRestaurantPosition(location);
  };

  if (loadingLocation) {
    return <p>Getting your location...</p>;
  }

  if (locationError) {

    const handleRetry = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          window.location.reload();
        },
        () => {
          alert("Please enable location services in your device settings to continue using this feature.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };


    return (
      <div>
      <p>Error: {locationError}</p>
      <button onClick={handleRetry}>Retry</button>
      <p style={{color: "red"}}>Location access is required. Please activate location services in your device settings.</p>
    </div>
    );
  }

  const Profile=()=>{
    navigate("/profile");
  }



  //Get the current user location and store it in the database




// Run once on mount

// Run once on mount


  return (
    <>
      <h1>Dashboard</h1>
      <h2>Welcome, {displayName}!</h2>
      <button onClick={Profile}>Profile</button>
      <button onClick={handleLogout}>Logout</button> 
      <div> <img src={underDevImg2} alt="" className="UnderDevImgP1" /></div>

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
