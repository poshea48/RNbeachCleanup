import React from 'react';
import { Dimensions } from 'react-native';
import MapView from 'react-native-maps';
import { useAppState } from '../../context/appContext';

const Map: React.FC = () => {
  const { tracker } = useAppState();
  const { latitude: initLat, longitude: initLong } = tracker?.startGPS
    ?.coords || {
    latitude: 0,
    longitude: 0,
  };

  const { width, height } = Dimensions.get('window');

  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.00922;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

  return (
    <MapView
      style={{ flex: 1 }}
      region={{
        latitude: initLat,
        longitude: initLong,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }}
      zoomEnabled={true}
      scrollEnabled={true}
      showsScale={true}
      showsUserLocation={true}
    />
  );
};

export default Map;
