import React, { useRef, useCallback } from 'react';
import { Dimensions } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import { useAppState } from '../../context/appContext';

const Map: React.FC = () => {
  const { width, height } = Dimensions.get('window');
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.00922;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

  const { tracker } = useAppState();
  const { latitude, longitude } = tracker.currentCoordinates || {
    latitude: 0,
    longitude: 0,
  };

  const { routeCoordinates } = tracker;
  const refMap = useRef<MapView | null>(null);

  const getDeltas = useCallback(() => {
    return {
      longitudeDelta: LONGITUDE_DELTA,
      latitudeDelta: LATITUDE_DELTA,
    };
  }, [LONGITUDE_DELTA]);

  const getInitialRegion = useCallback(() => {
    return {
      latitude: tracker.initialCoordinates?.latitude || 0,
      longitude: tracker.initialCoordinates?.longitude || 0,
      ...getDeltas(),
    };
  }, [
    getDeltas,
    tracker.initialCoordinates?.latitude,
    tracker.initialCoordinates?.longitude,
  ]);
  return (
    <MapView
      style={{ flex: 1 }}
      ref={(ref) => (refMap.current = ref)}
      minZoomLevel={15}
      initialRegion={getInitialRegion()}
      showsUserLocation={true}
      onUserLocationChange={() => {
        console.log('user location changes');
        refMap.current?.animateCamera({
          center: { latitude, longitude },
        });
      }}
      followsUserLocation>
      <Polyline coordinates={routeCoordinates || []} strokeWidth={5} />
    </MapView>
  );
};

export default Map;
