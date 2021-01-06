import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useAppState } from '../../context/appContext';
import colors from '../../../colors';

interface LocationType {
  latitude: number;
  longitude: number;
}

const Map: React.FC = () => {
  const { tracker } = useAppState();
  const [location, setLocation] = useState<LocationType>({
    latitude: tracker?.startGPS?.coords.latitude || 0,
    longitude: tracker?.startGPS?.coords.longitude || 0,
  });

  const { width, height } = Dimensions.get('window');

  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.0922;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude: location?.latitude,
        longitude: location?.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }}>
      <Marker
        key="initial"
        title="starting point"
        coordinate={{
          latitude: location.latitude,
          longitude: location.longitude,
        }}
        pinColor="blue"
      />
    </MapView>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     justifyContent: 'center',
//     height: '100%',
//     backgroundColor: colors.main,
//   },
//   // heading: {},
//   // button: {
//   //   backgroundColor: colors.orange,
//   //   color: 'white',
//   //   fontWeight: '700',
//   //   textTransform: 'uppercase',
//   //   alignSelf: 'center',
//   //   textAlign: 'center',
//   //   paddingHorizontal: 10,
//   //   borderRadius: 5,
//   //   marginBottom: 20,
//   // },
// });

export default Map;
