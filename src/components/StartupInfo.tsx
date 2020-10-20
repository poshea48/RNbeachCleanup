import React, { useState } from 'react';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Pressable } from 'react-native';
import { Switch, Text } from 'react-native-paper';
import { useAppDispatch, useAppState } from '../context/appContext';
import { TabParamList } from '../customTypes/navigation';
import colors from '../../colors';

type StartNavProp = BottomTabNavigationProp<TabParamList, 'Debris'>;

const StartupInfo: React.FC<{ navigation: StartNavProp }> = ({
  navigation,
}) => {
  const { started, tracker } = useAppState();
  const [isGpsOn, toggleGPS] = useState(started);
  const dispatch = useAppDispatch();
  const handleStartPress = () => {
    if (isGpsOn) {
      // get initial location data:
    }
    const dateObject = new Date();
    const startTime = dateObject.getTime();
    const date = dateObject.toLocaleDateString();

    /**  context: {
     started: bool,
     finished: bool,
     stats: {date,startTime,endTime,totalCollected,totalDistance,totalTime: 0,},
     debris: {},
     location: {beachName,city,state}
     results: {totalCollected,totalDistance,totalTime,}
     tracker: {inUse, startGPS,positions,watchId]
    }*/
    dispatch({
      type: 'START_CLEANUP',
      payload: {
        started: true,
        stats: {
          date,
          startTime,
        },
        tracker: {
          ...tracker,
          inUse: isGpsOn,
        },
      },
    });
    navigation.navigate('Debris');
  };

  const handleResetPress = () => {
    toggleGPS(false);
    dispatch({
      type: 'RESET',
      payload: {
        tracker: {
          ...tracker,
          inUse: isGpsOn,
        },
      },
    });
  };

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
            Track your GPS and distanced traveled during cleanup?
          </Text>
          <View style={styles.gps}>
            <Text style={{ color: isGpsOn ? colors.orange : colors.gray }}>
              GPS({isGpsOn ? 'on' : 'off'})
            </Text>
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
      <View />
      {!started && (
        <Pressable
          onPress={() => handleStartPress()}
          style={({ pressed }) => [
            {
              transform: [
                { translateX: pressed ? 5 : 0 },
                { translateY: pressed ? 5 : 0 },
              ],
              shadowColor: pressed ? 'transparent' : colors.black,
              shadowOffset: pressed
                ? { width: 0, height: 0 }
                : { width: 5, height: 5 },
              shadowOpacity: 1.0,
            },
            styles.button,
            styles.startButton,
          ]}>
          <Text style={[styles.buttonText, styles.startButtonText]}>
            START!
          </Text>
        </Pressable>
      )}
      {started && (
        <Pressable
          onPress={() => handleResetPress()}
          style={({ pressed }) => [
            {
              transform: [
                { translateX: pressed ? 5 : 0 },
                { translateY: pressed ? 5 : 0 },
              ],
              shadowColor: pressed ? 'transparent' : colors.black,
              shadowOffset: pressed
                ? { width: 0, height: 0 }
                : { width: 5, height: 5 },
              shadowOpacity: 1.0,
            },
            styles.button,
            styles.resetButton,
          ]}>
          <Text style={[styles.buttonText, styles.resetButtonText]}>Reset</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    color: colors.orange,
  },
  info: {
    color: colors.main,
    marginVertical: 20,
    marginHorizontal: 0,
    textAlign: 'center',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 220,
    height: 50,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: colors.orange,
  },
  resetButton: {
    backgroundColor: colors.gray,
  },
  buttonText: {
    color: colors.main,
    fontWeight: '700',
    textTransform: 'uppercase',
    alignSelf: 'center',
    textAlign: 'center',
  },
  resetButtonText: {
    color: colors.black,
  },
  startButtonText: {
    color: colors.main,
  },
});

export default StartupInfo;
