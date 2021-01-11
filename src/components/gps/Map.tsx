import React from 'react';
import { Dimensions } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';

import { useAppState } from '../../context/appContext';

const Map: React.FC = () => {
  const { tracker } = useAppState();

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

  function getMapRegion() {
    return {
      latitude: tracker.currentCoordinates?.latitude || 0,
      longitude: tracker.currentCoordinates?.longitude || 0,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    };
  }
  return (
    <MapView
      style={{ flex: 1 }}
      region={getMapRegion()}
      showsUserLocation={true}
      followsUserLocation={true}>
      <Polyline coordinates={routeCoordinates || []} strokeWidth={5} />
    </MapView>
  );
};

export default Map;
