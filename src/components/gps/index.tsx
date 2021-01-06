import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import Map from './Map';
import colors from '../../../colors';
import Timer from './Timer';

const GPSTracker: React.FC = () => {
  useEffect(() => {
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization('always');
    }
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.main }}>
      <View style={{ flex: 4 }}>
        <Map />
      </View>
      <View style={{ flex: 1 }}>
        <Timer />
      </View>
    </View>
  );
};

export default GPSTracker;
