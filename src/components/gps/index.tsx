import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

interface LocationType {
  latitude: number;
  longitude: number;
}

const GPSTracker: React.FC = () => {
  const [location, setLocation] = useState<LocationType | undefined>(undefined);

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

export default GPSTracker;
