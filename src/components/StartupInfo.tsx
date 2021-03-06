import React, { useEffect, useState } from 'react';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Pressable, Modal, Platform } from 'react-native';
import { Switch, Text } from 'react-native-paper';
import Geolocation from 'react-native-geolocation-service';

import { useAppDispatch, useAppState } from '../context/appContext';
import { TabParamList } from '../customTypes/navigation';
import colors from '../../colors';
import Button from './Button';
import {
  getInitialPosition,
  handleSuccessfulWatch,
  WATCH_OPTIONS,
} from '../utils/geolocation';

type StartNavProp = BottomTabNavigationProp<TabParamList, 'Debris'>;

const StartupInfo: React.FC<{ navigation: StartNavProp }> = ({
  navigation,
}) => {
  const { started, stats, gpsEnabled, tracker } = useAppState();
  const [open, setOpen] = useState(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization('always');
    }
    return () => {
      if (tracker.watchId != null) {
        console.log('clearing watchId');
        Geolocation.clearWatch(tracker.watchId);
        dispatch({
          type: 'REMOVE_WATCH_ID',
        });
      }
    };
  }, [dispatch, tracker.watchId]);
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
            <Text
              style={{ color: tracker.inUse ? colors.orange : colors.gray }}>
              GPS({gpsEnabled ? 'on' : 'off'})
            </Text>
            <Switch
              style={styles.switch}
              color={colors.main}
              value={gpsEnabled}
              onValueChange={toggleGps}
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
        <Button
          pressCb={handleStartPress}
          message="START!"
          styles={{
            container: { ...styles.button, ...styles.startButton },
            text: styles.buttonText,
          }}
        />
      )}
      {started && (
        <Button
          pressCb={handleResetPress}
          message="Reset"
          styles={{
            container: { ...styles.button, ...styles.resetButton },
            text: { ...styles.buttonText, ...styles.resetButtonText },
          }}
        />
      )}
      <Modal animationType="slide" transparent={true} visible={open}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <View style={styles.modalTitleContainer}>
              <Text style={styles.modalText}>Are you sure?</Text>
              <Text style={styles.modalText}>You will lose all your data</Text>
            </View>
            <View style={styles.modalResetButtonsContainer}>
              <Pressable
                style={styles.modalResetButton}
                onPress={handleModalReset}>
                <Text style={styles.modalResetButtonText}>Yes, Reset</Text>
              </Pressable>
              <Pressable
                style={[styles.modalResetButton, styles.modalResetButtonNo]}
                onPress={() => setOpen(false)}>
                <Text style={styles.modalResetButtonText}>No, Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );

  /*********** Util Functions *************/

  //TODO: Handle Geolocation.watchPostion when GPS is toggled on after cleanup has started
  function toggleGps() {
    dispatch({
      type: 'TOGGLE_GPS',
    });
  }

  function handleStartPress() {
    if (gpsEnabled) {
      // get initial location data:
      getInitialPosition(dispatch);

      // watch position and add new coordinates to context
      const watchId = Geolocation.watchPosition(
        (position) => handleSuccessfulWatch(position, dispatch),
        (error) => console.log(error),
        WATCH_OPTIONS,
      );

      // add watchId to context in order to dismount when resetting
      dispatch({
        type: 'ADD_WATCH_ID',
        payload: {
          watchId,
        },
      });
    }
    const dateObject = new Date();
    const initialStartTime = dateObject.getTime();
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
          ...stats,
          date,
          initialStartTime,
          currentStartTime: initialStartTime,
        },
      },
    });
    navigation.navigate('Debris');
  }

  function handleResetPress() {
    setOpen(true);
  }

  function handleModalReset() {
    dispatch({
      type: 'RESET',
    });
    setOpen(false);
  }
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
    width: 200,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 140,
  },
  modalView: {
    width: 300,
    height: 200,
    backgroundColor: colors.orange,
    borderRadius: 20,
    padding: 15,
    paddingBottom: 25,
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: {
    color: colors.black,
    fontWeight: '900',
    fontSize: 18,
    textAlign: 'center',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  modalTitleContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  modalResetButtonsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modalResetButton: {
    width: 100,
    padding: 10,
    borderRadius: 10,
    backgroundColor: colors.gray,
  },
  modalResetButtonNo: {
    backgroundColor: colors.main,
  },
  modalResetButtonText: {
    color: colors.white,
    fontWeight: '800',
    textAlign: 'center',
  },
});

export default StartupInfo;
