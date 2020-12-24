import React, { useState, useEffect } from 'react';
import GoogleMapReact from 'google-map-react';
import GoogleMapSearchBox from '../Components/GoogleMapSearchBox';

const GoogleMap = ({ googleMap }) => {
    const [apiReady, setApiReady] = useState(false);
    const [googlemaps, setGooglemaps] = useState(null);

    const onPlacesChanged = (data) => {
        console.log(data);
        console.log('Addess');
        console.log(data[0].geometry.location.lat());
        console.log(data[0].geometry.location.lng());
    }

    const apiHasLoaded = ({ map, maps }) => {
        if (map && maps) {
            setGooglemaps(maps);
            setApiReady(true);
        }
    }

    return (
        <div id="google-map-preview" style={{ height: '100vh', width: '100%' }}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: 'AIzaSyDzFLST4xAWh60rNDeZQoOi2WRNWJak7rA', libraries: 'places' }}
                defaultCenter={{
                    lat: 1.3010111504664552,
                    lng: 103.85514811535603
                }}
                defaultZoom={15}
                yesIWantToUseGoogleMapApiInternals
                onGoogleApiLoaded={ apiHasLoaded }
            >
                {apiReady && <GoogleMapSearchBox onPlacesChanged={onPlacesChanged} googlemaps={googlemaps} placeholder="Enter your address here" />}
            </GoogleMapReact>
        </div>
    )
}

export default GoogleMap;