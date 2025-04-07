import React, {
    useEffect,
    useRef
} from 'react';
import H from '@here/maps-api-for-javascript';
import { ref, set } from "firebase/database";
import { db } from "../../firebase"; 






export const updateUserLocation = (uid, coords) => {
  set(ref(db, "locations/" + uid), {
    lat: coords.latitude,
    lng: coords.longitude,
    timestamp: Date.now(),
  });
};



















 const Map = ({
    apikey}) => {
    const mapRef = useRef(null);
    const map = useRef(null);
    const platform = useRef(null);

    useEffect(() => {
        // Check if the map object has already been created
        if (!map.current) {
            // Create a platform object with the API key and useCIT option
            platform.current = new H.service.Platform({
                apikey
            });
            // Obtain the default map types from the platform object:
            const defaultLayers = platform.current.createDefaultLayers({
                pois: true
            });
            // Create a new map instance with the Tile layer, center and zoom level
            // Instantiate (and display) a map:
            const newMap = new H.Map(
                mapRef.current,
                defaultLayers.vector.normal.map, {
                    zoom: 14,
                    center: {
                        lat: 3.1155,
                        lng: 35.6041,
                    },
                }
            ); 
            
           

            // Add panning and zooming behavior to the map
            const behavior = new H.mapevents.Behavior(
                new H.mapevents.MapEvents(newMap)
            );

            // Set the map object to the reference
            map.current = newMap; 
            const ui = H.ui.UI.createDefault(newMap, defaultLayers);
        };
       
       

    }, [apikey]);

    // Return a div element to hold the map
    return < div style = {
        {
            width: "95vw",
            height: "50vh"
        }
    }
    ref = {
        mapRef
    }
    ></div>;
}















const Mapfirst = ({ apikey, userPosition, restaurantPosition }) => {
    const mapRef = useRef(null);
    const map = useRef(null);
    const platform = useRef(null);
    const userMarkerRef = useRef(null);
  
    useEffect(() => {
      if (!userPosition) return;
  
      if (!map.current) {
        // Initialize platform and map
        platform.current = new H.service.Platform({ apikey });
        const defaultLayers = platform.current.createDefaultLayers({ pois: true });
  
        const newMap = new H.Map(
          mapRef.current,
          defaultLayers.vector.normal.map,
          {
            zoom: 14,
            center: userPosition,
          }
        );
  
        new H.mapevents.Behavior(new H.mapevents.MapEvents(newMap));
        H.ui.UI.createDefault(newMap, defaultLayers);
  
        map.current = newMap;
  
        // Add user marker initially
        const userMarker = new H.map.Marker(userPosition, {
          icon: getMarkerIcon('blue'),
        });
        userMarkerRef.current = userMarker;
        map.current.addObject(userMarker);
      } else {
        // Update user's position and re-center
        const newCoords = { lat: userPosition.lat, lng: userPosition.lng };
  
        if (userMarkerRef.current) {
          userMarkerRef.current.setGeometry(newCoords);
        } else {
          const userMarker = new H.map.Marker(newCoords, {
            icon: getMarkerIcon('blue'),
          });
          userMarkerRef.current = userMarker;
          map.current.addObject(userMarker);
        }
  
        map.current.setCenter(newCoords);
      }
  
      // Draw route if restaurant selected
      if (restaurantPosition) {
        calculateRoute(platform.current, map.current, userPosition, restaurantPosition);
      }
    }, [apikey, userPosition, restaurantPosition]);
  
    return (
      <div
        style={{ width: '95vw', height: '50vh' }}
        ref={mapRef}
      ></div>
    );
  };
  
  export default Mapfirst;
  
  function getMarkerIcon(color) {
    const svgCircle = `<svg width="20" height="20" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <g id="marker">
          <circle cx="10" cy="10" r="7" fill="${color}" stroke="${color}" stroke-width="4" />
        </g>
      </svg>`;
    return new H.map.Icon(svgCircle, { anchor: { x: 10, y: 10 } });
  }
  
  function calculateRoute(platform, map, start, destination) {
    const router = platform.getRoutingService(null, 8);
    const routingParams = {
      origin: `${start.lat},${start.lng}`,
      destination: `${destination.lat},${destination.lng}`,
      transportMode: 'car',
      return: 'polyline',
    };
  
    router.calculateRoute(routingParams, (response) => {
      const sections = response.routes[0].sections;
      const lineStrings = sections.map((s) =>
        H.geo.LineString.fromFlexiblePolyline(s.polyline)
      );
      const multiLineString = new H.geo.MultiLineString(lineStrings);
      const bounds = multiLineString.getBoundingBox();
  
      map.removeObjects(map.getObjects());
  
      const polyline = new H.map.Polyline(multiLineString, {
        style: { lineWidth: 5 },
      });
  
      map.addObjects([
        polyline,
        new H.map.Marker(start, { icon: getMarkerIcon('red') }),
        new H.map.Marker(destination, { icon: getMarkerIcon('green') }),
      ]);
  
      map.getViewModel().setLookAtData({ bounds });
    }, console.error);
  }

