import React, { useState, useRef } from 'react';
import GoogleMapReact from 'google-map-react';
import GoogleMapSearchBox from '../Components/GoogleMapSearchBox';

const GoogleMap = ({ address, setAddress }) => {
    const [apiReady, setApiReady] = useState(false);
    const [googlemaps, setGooglemaps] = useState(null);
    const [map, setMap] = useState(null);
    const [markers, setMarkers] = useState([]);
    const divStreetView = useRef(null);

    const defaultLocation = {
        lat: 1.2987376,
        lng: 103.8434403
    }

    const clearAllMarkers = () => {
        for (let i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
        setMarkers([]);
    }

    const onPlacesChanged = (data) => {

        console.log(data);

        // Check required field
        if (!data || data.length === 0) return;
        const objectAddress = data[0];
        if (!objectAddress.geometry || !objectAddress.geometry.location) return;
        if (!objectAddress.formatted_address) return;

        // CLear all markets and add newest marker
        clearAllMarkers();
        const marker = new googlemaps.Marker({
            position: { lat: data[0].geometry.location.lat(), lng: data[0].geometry.location.lng() },
            map,
            title: objectAddress.name
        });
        setMarkers([...markers, marker]);

        // In FormCreate
        setAddress({
            name: objectAddress.formatted_address,
            lat: objectAddress.geometry.location.lat(),
            lng: objectAddress.geometry.location.lng()
        })

        // Set location 
        map.setCenter({ lat: objectAddress.geometry.location.lat(), lng: objectAddress.geometry.location.lng() });

        // Set street view
        const panorama = new googlemaps.StreetViewPanorama(
            divStreetView.current,
            {
                position: {
                    lat: objectAddress.geometry.location.lat(),
                    lng: objectAddress.geometry.location.lng()
                },
                pov: {
                    heading: 34,
                    pitch: 10,
                },
            }
        );
        map.setStreetView(panorama);
    }

    const apiHasLoaded = ({ map, maps }) => {
        if (map && maps) {
            setGooglemaps(maps);
            setMap(map);
            setApiReady(true);

            // Add street view by default
            const panorama = new maps.StreetViewPanorama(
                divStreetView.current,
                {
                    position: defaultLocation,
                    pov: {
                        heading: 34,
                        pitch: 10,
                    },
                }
            );
            map.setStreetView(panorama);
        }
    }

    return (
        <div className="col-lg-12 col-md-12">
            <label className="label-for">Address:</label>
            {apiReady && <GoogleMapSearchBox onPlacesChanged={onPlacesChanged} googlemaps={googlemaps} placeholder="Enter your address here" />}
            <div style={{ height: '50vh', width: '100%' }}>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: 'AIzaSyDzFLST4xAWh60rNDeZQoOi2WRNWJak7rA', region: 'SG', libraries: 'places' }}
                    defaultCenter={defaultLocation}
                    defaultZoom={15}
                    yesIWantToUseGoogleMapApiInternals
                    onGoogleApiLoaded={apiHasLoaded}
                >
                </GoogleMapReact>
            </div>

            <div className="text-center">
                <h3>Street View</h3>
            </div>

            <div className="m-3">
                <div style={{ height: '50vh', width: '100%' }} ref={divStreetView} />
            </div>
        </div>
    )
}

export default GoogleMap;