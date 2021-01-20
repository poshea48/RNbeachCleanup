import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import Map from './Map';
import colors from '../../../colors';
import Timer from './Timer';
import { useAppState } from '../../context/appContext';

const GPSTracker: React.FC = () => {
  const { gpsEnabled } = useAppState();
  useEffect(() => {
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization('always');
    }
  }, []);

  if (!gpsEnabled) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 20, textAlign: 'center' }}>
          Enable GPS in Startup Page to see your progress
        </Text>
      </View>
    );
  }

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
