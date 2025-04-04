import React, {
    useEffect,
    useRef
} from 'react';
import H from '@here/maps-api-for-javascript';


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















const Mapfirst = (props) => {
    const mapRef = useRef(null);
    const map = useRef(null);
    const platform = useRef(null);
    const { apikey, userPosition, restaurantPosition } = props;

    useEffect(() => {
        if (!map.current && userPosition) {
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
      
          // Add default UI and behavior
          new H.mapevents.Behavior(new H.mapevents.MapEvents(newMap));
          H.ui.UI.createDefault(newMap, defaultLayers);
      
          // Add marker for user's location
          const userMarker = new H.map.Marker(userPosition, {
            icon: getMarkerIcon("blue"),
          });
          newMap.addObject(userMarker);
      
          map.current = newMap;
        }
      
        // If restaurant is selected, draw route
        if (restaurantPosition && userPosition) {
          calculateRoute(platform.current, map.current, userPosition, restaurantPosition);
        }
      }, [apikey, userPosition, restaurantPosition]);




    useEffect(() => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
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
            { enableHighAccuracy: true, timeout: 30000, maximumAge: 0 }
          );
        } else {
          setLocationError("Geolocation is not supported by this browser.");
          setLoadingLocation(false);
        }
      }, []);



















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

export default Mapfirst;








function getMarkerIcon(color) {
    const svgCircle = `<svg width="20" height="20" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <g id="marker">
                <circle cx="10" cy="10" r="7" fill="${color}" stroke="${color}" stroke-width="4" />
                </g></svg>`;
    return new H.map.Icon(svgCircle, {
        anchor: {
            x: 10,
            y: 10
        }
    });
}

function calculateRoute(platform, map, start, destination) {
    function routeResponseHandler(response) {
        const sections = response.routes[0].sections;
        const lineStrings = [];
        sections.forEach((section) => {
            // convert Flexible Polyline encoded string to geometry
            lineStrings.push(H.geo.LineString.fromFlexiblePolyline(section.polyline));
        });
        const multiLineString = new H.geo.MultiLineString(lineStrings);
        const bounds = multiLineString.getBoundingBox();

        // Create the polyline for the route
        const routePolyline = new H.map.Polyline(multiLineString, {
            style: {
                lineWidth: 5
            }
        });

        // Remove all the previous map objects, if any
        map.removeObjects(map.getObjects());
        // Add the polyline to the map
        map.addObject(routePolyline);
        map.addObjects([
            // Add a marker for the user
            new H.map.Marker(start, {
                icon: getMarkerIcon('red')
            }),
            // Add a marker for the selected restaurant
            new H.map.Marker(destination, {
                icon: getMarkerIcon('green')
            })
        ]);
        // Configure the map view to automatically zoom into the bounds 
        // encompassing markers and route polyline:
        map.getViewModel().setLookAtData({ bounds });
    }

    // Get an instance of the H.service.RoutingService8 service
    const router = platform.getRoutingService(null, 8);

    // Define the routing service parameters
    const routingParams = {
        'origin': `${start.lat},${start.lng}`,
        'destination': `${destination.lat},${destination.lng}`,
        'transportMode': 'car',
        'return': 'polyline'
    };
    // Call the routing service with the defined parameters
    router.calculateRoute(routingParams, routeResponseHandler, console.error);
}
