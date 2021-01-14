import React, { useEffect, useState } from 'react';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Pressable, Modal, Platform } from 'react-native';
import { Switch, Text } from 'react-native-paper';
import Geolocation from 'react-native-geolocation-service';

import { useAppDispatch, useAppState } from '../context/appContext';
import { TabParamList } from '../customTypes/navigation';
import colors from '../../colors';
import Button from './Button';
import { GeolocationType } from '../customTypes/context';

type StartNavProp = BottomTabNavigationProp<TabParamList, 'Debris'>;

const StartupInfo: React.FC<{ navigation: StartNavProp }> = ({
  navigation,
}) => {
  const { started, stats, tracker } = useAppState();
  const [open, setOpen] = useState(false);
  const [watchId, setWatchId] = useState<number | null>(null);

  const dispatch = useAppDispatch();
  useEffect(() => {
    console.log('watchId, ', watchId);
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization('always');
    }
    return () => {
      if (watchId) {
        Geolocation.clearWatch(watchId);
        setWatchId(null);
      }
    };
  }, [watchId]);

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
              GPS({tracker.inUse ? 'on' : 'off'})
            </Text>
            <Switch
              style={styles.switch}
              color={colors.main}
              value={tracker.inUse}
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

  function toggleGps() {
    dispatch({
      type: 'TOGGLE_GPS',
      payload: {
        tracker: {
          ...tracker,
          inUse: !tracker.inUse,
        },
      },
    });
  }

  function handleStartPress() {
    if (tracker.inUse) {
      // get initial location data:
      Geolocation.getCurrentPosition(
        (position) => {
          if (!position.coords)
            return console.log('no coordinates were passed');
          dispatch({
            type: 'ADD_INITIAL_GPS',
            payload: {
              coords: position.coords,
            },
          });
        },
        (error) => {
          // See error code charts below.
          console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
      const newWatch = Geolocation.watchPosition(
        handleWatchCallback,
        (error) => console.log(error),
        {
          enableHighAccuracy: true,
          distanceFilter: 10,
        },
      );
      setWatchId(newWatch);
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

  function handleWatchCallback(position: { coords: GeolocationType }) {
    dispatch({
      type: 'UPDATE_COORDS',
      payload: {
        coords: position.coords,
      },
    });
  }

  // this.watchID = navigator.geolocation.watchPosition(
  //   (position) => {
  //     const { routeCoordinates, distanceTravelled } = this.state;
  //     const { latitude, longitude } = position.coords;

  //     const newCoordinate = {
  //       latitude,
  //       longitude,
  //     };
  //     console.log({ newCoordinate });

  //     this.setState({
  //       latitude,
  //       longitude,
  //       routeCoordinates: routeCoordinates.concat([newCoordinate]),
  //       distanceTravelled: distanceTravelled + this.calcDistance(newCoordinate),
  //       prevLatLng: newCoordinate,
  //     });
  //   },
  //   (error) => console.log(error),
  //   {
  //     enableHighAccuracy: true,
  //     timeout: 20000,
  //     maximumAge: 1000,
  //     distanceFilter: 10,
  //   },
  // );

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
