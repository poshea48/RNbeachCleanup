import React, { useRef, useCallback, useEffect } from 'react';
import { Dimensions } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import { useAppState } from '../../context/appContext';
import { GeolocationType } from '../../customTypes/context';

const Map: React.FC = () => {
  const { width, height } = Dimensions.get('window');
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.00922;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
  const { tracker } = useAppState();

  const routeCoordinates =
    tracker.routeCoordinates || ([] as GeolocationType[]);
  const refMap = useRef<MapView | null>(null);

  const getDeltas = useCallback(() => {
    return {
      longitudeDelta: LONGITUDE_DELTA,
      latitudeDelta: LATITUDE_DELTA,
    };
  }, [LONGITUDE_DELTA]);

  const getCurrentRegion = useCallback(() => {
    return {
      latitude: tracker.currentCoordinates?.latitude || 0,
      longitude: tracker.currentCoordinates?.longitude || 0,
      ...getDeltas(),
    };
  }, [
    getDeltas,
    tracker.currentCoordinates?.latitude,
    tracker.currentCoordinates?.longitude,
  ]);

  // animate to region after intital mount and when tracker.currentCoordinates updates
  useEffect(() => {
    refMap.current && refMap.current.animateToRegion(getCurrentRegion());
  }, [getCurrentRegion, tracker.currentCoordinates]);

  return (
    <MapView
      style={{ flex: 1 }}
      ref={(ref) => (refMap.current = ref)}
      minZoomLevel={15}
      region={getCurrentRegion()}
      showsUserLocation
      onLayout={() => {
        refMap.current &&
          refMap.current.animateCamera({
            center: {
              latitude: tracker.currentCoordinates?.latitude || 0,
              longitude: tracker.currentCoordinates?.longitude || 0,
            },
            heading: 0,
            pitch: 90,
          });
      }}>
      <Polyline coordinates={routeCoordinates} strokeWidth={5} />
    </MapView>
  );
};

export default Map;
