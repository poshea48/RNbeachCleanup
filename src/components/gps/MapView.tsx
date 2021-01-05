import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { useAppState } from '../../context/appContext';

interface LocationType {
  latitude: number;
  longitude: number;
}

const MapView: React.FC = () => {
  const { tracker } = useAppState();
  const [location, setLocation] = useState<LocationType | undefined>(
    tracker.startGPS?.coords,
  );

  useEffect(() => {
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization('always');
    }
  }, []);

  return (
    <View>
      <Text>GPS Tracker</Text>
    </View>
  );
};

export default MapView;
