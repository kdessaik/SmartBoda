import React, { useEffect, useState } from "react";








const HereMap = () => {
  const [location, setLocation] = useState({ lat: 0, lng: 0 });

   const apiKey=import.meta.env.VITE_Here_MAP_API_KEY


  useEffect(() => {
    // Get User's Location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          loadMap(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const loadMap = (latitude, longitude) => {
    const platform = new window.H.service.Platform({
      apikey: apiKey, // Replace with your HERE API Key
    });

    const defaultLayers = platform.createDefaultLayers();
    const mapContainer = document.getElementById("mapContainer");

    const map = new window.H.Map(
      mapContainer,
      defaultLayers.vector.normal.map,
      {
        center: { lat: latitude, lng: longitude },
        zoom: 14,
      }
    );

    // Add marker
    const marker = new window.H.map.Marker({ lat: latitude, lng: longitude });
    map.addObject(marker);

    // Enable map interactions
    new window.H.mapevents.Behavior(new window.H.mapevents.MapEvents(map));
    window.addEventListener("resize", () => map.getViewPort().resize());
  };

  return (
    <div>
      <h2>Your Location</h2>
      <p>Latitude: {location.lat}</p>
      <p>Longitude: {location.lng}</p>
      <div id="mapContainer" style={{ width: "100%", height: "400px" }}></div>
    </div>
  );
};

export default HereMap;
