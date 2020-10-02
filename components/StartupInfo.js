import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Switch, Text, Button } from 'react-native-paper';
import colors from '../colors';

const StartupInfo = ({ navigation }) => {
  const [isGpsOn, toggleGPS] = useState(false);
  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        Welcome to your Mobile Beach Cleanup Dashboard
      </Text>
      <View style={styles.infoWrapper}>
        <View style={styles.infoField}>
          <Text style={styles.info}>Please take proper PPE precautions</Text>
        </View>
        <View style={styles.infoField}>
          <Text style={styles.info}>
            Please add location information prior to submitting data
          </Text>
        </View>
        <View style={styles.gpsField}>
          <Text style={styles.gpsInfo}>
            Would you like to track your GPS and distanced traveled during this
            collection?
          </Text>
          <View style={styles.gps}>
            <Text>GPS({isGpsOn ? 'on' : 'off'})</Text>
            <Switch
              style={styles.switch}
              color={colors.main}
              value={isGpsOn}
              onValueChange={toggleGPS}
            />
          </View>
        </View>
        <View style={styles.infoField}>
          <Text style={styles.info}>
            Please fill out location details prior to submitting data
          </Text>
        </View>
        <View style={styles.infoField}>
          <Text style={styles.info}>
            Once you begin your cleanup use the bottom tabs to navigate between
            pages
          </Text>
        </View>
      </View>
      <Button
        contentStyle={contentStyle}
        mode="contained"
        style={styles.button}
        onPress={() => {
          // dispatch({ type: 'STARTCLEANUP' });
          navigation.navigate('Debris');
        }}>
        <Text style={styles.button}>GO!</Text>
      </Button>
    </View>
  );
};

const contentStyle = {
  width: 220,
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: '100%',
    padding: 20,
    backgroundColor: colors.white,
  },
  header: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.main,
    marginBottom: 5,
  },
  infoWrapper: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    margin: 0,
    marginBottom: 20,
  },
  infoField: {},
  gpsField: {
    justifyContent: 'flex-start',
  },
  gps: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  gpsInfo: {
    color: colors.main,
    marginTop: 20,
    marginHorizontal: 0,
    textAlign: 'center',
  },
  switch: {
    alignSelf: 'center',
  },
  info: {
    color: colors.main,
    marginVertical: 20,
    marginHorizontal: 0,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.orange,
    color: 'white',
    fontWeight: '700',
    textTransform: 'uppercase',
    alignSelf: 'center',
    textAlign: 'center',
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
});

export default StartupInfo;
