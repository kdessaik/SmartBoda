import { useEffect, useState,useRef } from 'react';
import { auth, db } from '../../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, set, onValue } from 'firebase/database';


const DashboardBoda = () => {
  const [user, setUser] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [allLocations, setAllLocations] = useState({});
  const [activeUsersCount, setActiveUsersCount] = useState(0); // Track active users
  const mapRef = useRef(null);
  const map = useRef(null);
  const platform = useRef(null);

  // Watch and update user location in the database
  useEffect(() => {
    let watchId;
    onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) return;
      setUser(currentUser);

      // Update user's status as online
      set(ref(db, `users/${currentUser.uid}`), {
        status: 'online',
      });

      // Watch position and update in real-time
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(coords);
          set(ref(db, `locations/${currentUser.uid}`), coords);
        },
        (err) => console.error("Geolocation error:", err),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  // Fetch all users' locations and count active users
  useEffect(() => {
    const locationRef = ref(db, 'locations/');
    const usersRef = ref(db, 'users/');

    // Listen to user locations
    const unsubscribeLocations = onValue(locationRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setAllLocations(data);
    });

    // Listen to active user count
    const unsubscribeUsers = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Count users who are online
        const onlineUsers = Object.values(data).filter(user => user.status === 'online');
        setActiveUsersCount(onlineUsers.length);
      }
    });

    return () => {
      unsubscribeLocations();
      unsubscribeUsers();
    };
  }, []);

  // Render map and markers
  useEffect(() => {
    if (!map.current && userLocation) {
      platform.current = new H.service.Platform({
        apikey: import.meta.env.VITE_Here_MAP_API_KEY,
      });
      const defaultLayers = platform.current.createDefaultLayers();

      const newMap = new H.Map(
        mapRef.current,
        defaultLayers.vector.normal.map,
        {
          zoom: 15,
          center: userLocation,
        }
      );

      new H.mapevents.Behavior(new H.mapevents.MapEvents(newMap));
      H.ui.UI.createDefault(newMap, defaultLayers);
      map.current = newMap;
    }

    if (map.current) {
      map.current.removeObjects(map.current.getObjects());

      Object.entries(allLocations).forEach(([uid, loc]) => {
        const marker = new H.map.Marker(loc);
        map.current.addObject(marker);
      });
    }
  }, [userLocation, allLocations]);



  return (
    <div>
      <h2>Motorbike Dashboard</h2>
      <h3>Active Users: {activeUsersCount}</h3>
      <div
        ref={mapRef}
        style={{ width: '100%', height: '70vh', border: '1px solid #ccc' }}
      />
    </div>
  );
};

export default DashboardBoda;
