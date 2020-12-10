import React, { useState } from 'react';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Pressable, Modal } from 'react-native';
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
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();

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
          <Text style={styles.buttonText}>START!</Text>
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

  function handleStartPress() {
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
  }

  function handleResetPress() {
    setOpen(true);
  }

  function handleModalReset() {
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
