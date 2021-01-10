import React, { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import MapView from 'react-native-maps';
import { useAppState } from '../../context/appContext';

const Map: React.FC = () => {
  const { tracker } = useAppState();
  const {
    latitude: initLat,
    longitude: initLong,
  } = tracker?.currentCoordinates || {
    latitude: 0,
    longitude: 0,
  };
  const [region, setRegion] = useState({
    longitude: initLong,
    latitude: initLat,
  });
  const { width, height } = Dimensions.get('window');

  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.00922;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

  return (
    <MapView
      style={{ flex: 1 }}
      region={{
        latitude: region.latitude,
        longitude: region.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }}
      onRegionChange={() => console.log('my new region')}
      onUserLocationChange={({ nativeEvent }) =>
        console.log('onUserLocationChange, ', nativeEvent.coordinate)
      }
      showsUserLocation={true}
      followsUserLocation={true}
    />
  );
};

export default Map;
