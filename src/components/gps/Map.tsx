import React, { useEffect, useState } from 'react';
import { Dimensions, Platform } from 'react-native';
import MapView, { AnimatedRegion, Marker, Polyline } from 'react-native-maps';

import { useAppState } from '../../context/appContext';

const Map: React.FC = () => {
  const { tracker } = useAppState();
  const [refMarker, setMarker] = useState(null);
  const [coordinate, setCoordinate] = useState(
    new AnimatedRegion({
      latitude: tracker?.currentCoordinates?.latitude || 0,
      longitude: tracker?.currentCoordinates?.longitude || 0,
      latitudeDelta: 0,
      longitudeDelta: 0,
    }),
  );

  const { routeCoordinates } = tracker;
  // const [markerCoords, setMarkerCoords] = useState(
  //   new AnimatedRegion({
  //     ...tracker.currentCoordinates,
  //     latitude: tracker.currentCoordinates?.latitude || 0,
  //     longitude: tracker.currentCoordinates?.longitude || 0,
  //     latitudeDelta: 0,
  //     longitudeDelta: 0,
  //   }),
  // );

  const { width, height } = Dimensions.get('window');

  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.00922;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

  //TODO fix this
  // useEffect(() => {
  //   const duration = 500;
  //   if (Platform.OS === 'android') {
  //     if (refMarker) {
  //       refMarker.animateMarkerToCoordinate(getCurrentMapRegion(), duration);
  //     }
  //   } else {
  //     // const coords = getCurrentMapRegion();
  //     // coordinate
  //     //   .timing({
  //     //     ...coords,
  //     //     duration,
  //     //   })
  //     //   .start();
  //   }
  // }, [coordinate]);

  function getCurrentMapRegion(): AnimatedRegion {
    return new AnimatedRegion({
      latitude: tracker.currentCoordinates?.latitude || 0,
      longitude: tracker.currentCoordinates?.longitude || 0,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    });
  }

  function getInitialRegion() {
    return {
      latitude: tracker.initialCoordinates?.latitude || 0,
      longitude: tracker.initialCoordinates?.longitude || 0,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    };
  }

  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={getInitialRegion()}
      followsUserLocation={true}>
      <Polyline coordinates={routeCoordinates || []} strokeWidth={5} />
      {/* <Marker.Animated
        ref={(marker) => setMarker(marker)}
        coordinate={coordinate}
      /> */}
    </MapView>
  );
};

export default Map;
