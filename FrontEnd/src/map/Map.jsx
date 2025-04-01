import React, {
    useEffect,
    useRef
} from 'react';
import H from '@here/maps-api-for-javascript';


 const Map = ({
    apikey
}) => {
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
export default Map;
