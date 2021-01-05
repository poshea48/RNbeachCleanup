import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';

import colors from '../../colors';

const TrackerPage: React.FC = () => {
  return (
    <View style={styles.container}>
      <MapView style={{ flex: 1 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    justifyContent: 'center',
    height: '100%',
    backgroundColor: colors.main,
  },
  // heading: {},
  // button: {
  //   backgroundColor: colors.orange,
  //   color: 'white',
  //   fontWeight: '700',
  //   textTransform: 'uppercase',
  //   alignSelf: 'center',
  //   textAlign: 'center',
  //   paddingHorizontal: 10,
  //   borderRadius: 5,
  //   marginBottom: 20,
  // },
});

export default TrackerPage;
