import React, { useEffect, useRef, useCallback } from 'react';
import { Dimensions, Platform } from 'react-native';
import MapView, {
  MarkerAnimated,
  AnimatedRegion,
  Polyline,
} from 'react-native-maps';
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
  const refMarker = useRef<MarkerAnimated | null>(null);
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

  const getAnimatedCoords = useCallback(() => {
    return new AnimatedRegion({
      latitude,
      longitude,
      ...getDeltas(),
    });
  }, [getDeltas, latitude, longitude]);

  const coordinate = getAnimatedCoords();

  useEffect(() => {
    const duration = 500;
    if (Platform.OS === 'android') {
      if (refMarker.current) {
        const coords = {
          latitude,
          longitude,
        };
        refMarker.current.animateMarkerToCoordinate(coords, duration);
      }
    } else {
      coordinate
        .timing({
          latitude,
          longitude,
          ...getDeltas(),
          useNativeDriver: false,
        })
        .start();
    }
    return () => {
      if (refMarker.current) {
        refMarker.current = null;
      }
    };
  }, [coordinate, getDeltas, latitude, longitude, refMarker]);

  return (
    <MapView
      style={{ flex: 1 }}
      minZoomLevel={15}
      initialRegion={getInitialRegion()}
      followsUserLocation>
      <Polyline coordinates={routeCoordinates || []} strokeWidth={5} />
      <MarkerAnimated
        ref={(marker: MarkerAnimated) => (refMarker.current = marker)}
        anchor={{ x: 0.5, y: 0.5 }}
        coordinate={coordinate}
      />
    </MapView>
  );
};

export default Map;
