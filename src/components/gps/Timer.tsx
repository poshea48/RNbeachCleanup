import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import colors from '../../../colors';
import { useAppState, useAppDispatch } from '../../context/appContext';
import { convertTimeForDisplay } from '../../utils/date-time';
import { handleSuccessfulWatch, WATCH_OPTIONS } from '../../utils/geolocation';
import Button from '../Button';

const Timer: React.FC = () => {
  const { started, finished, stats, tracker } = useAppState();
  const [timeDisplay, setTimeDisplay] = useState(
    stats.totalTime + Math.floor((Date.now() - stats.currentStartTime) / 1000),
  );
  const [timer, setTimer] = useState({
    hours: '00',
    mins: '00',
    secs: '00',
  });
  const dispatch = useAppDispatch();

  useEffect(() => {
    let timerId: NodeJS.Timeout | undefined;
    if (finished) {
      setTimeDisplay(stats.totalTime);
      setTimer(convertTimeForDisplay(stats.totalTime));
      return;
    }
    if (stats.currentStartTime) {
      if (finished && timerId) {
        clearInterval(timerId);
        return;
      }
      timerId = setInterval(() => {
        const newTime = timeDisplay + 1;
        setTimer(convertTimeForDisplay(newTime));
        setTimeDisplay(newTime);
      }, 1000);
    }
    return () => timerId && clearInterval(timerId);
  }, [stats.currentStartTime, timeDisplay, finished, stats.totalTime]);
  return (
    <View style={styles.container}>
      <View style={styles.timerDisplay}>
        <Text style={styles.timerText}>{timer.hours}</Text>
        <Text style={styles.hypenText}>:</Text>
        <Text style={styles.timerText}>{timer.mins}</Text>
        <Text style={styles.hypenText}>:</Text>
        <Text style={styles.timerText}>{timer.secs}</Text>
      </View>
      <View style={styles.buttonContainer}>
        {stats.currentStartTime && !finished ? (
          <Button
            pressCb={handlePause}
            message="Pause"
            styles={{
              container: { backgroundColor: colors.warning },
              text: { color: colors.white },
            }}
          />
        ) : started && !finished ? (
          <Button
            pressCb={handleResume}
            message="Resume"
            styles={{
              container: { backgroundColor: colors.success },
              text: { color: colors.white },
            }}
          />
        ) : !finished ? (
          <Button
            pressCb={() => console.log('resume')}
            message="Start"
            styles={{
              container: { backgroundColor: colors.success },
              text: { color: colors.white },
            }}
          />
        ) : null}
      </View>
    </View>
  );

  /*********** Util Functions *************/

  function handlePause() {
    tracker.watchId != null && Geolocation.clearWatch(tracker?.watchId);
    // tracker.watchId is set to null in reducer
    dispatch({
      type: 'PAUSE_TIMER',
      payload: {
        stats: {
          ...stats,
          currentStartTime: 0,
          totalTime:
            stats.totalTime +
            Math.floor((Date.now() - stats.currentStartTime) / 1000),
        },
      },
    });
  }

  async function handleResume() {
    const watchId = Geolocation.watchPosition(
      (position) =>
        handleSuccessfulWatch(position, tracker.currentCoordinates, dispatch),
      (error) => console.log(error),
      WATCH_OPTIONS,
    );
    dispatch({
      type: 'ADD_WATCH_ID',
      payload: {
        watchId,
      },
    });
    dispatch({
      type: 'RESUME_TIMER',
      payload: {
        stats: {
          ...stats,
          currentStartTime: Date.now(),
        },
      },
    });
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  timerDisplay: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    alignSelf: 'center',
  },
  timerText: {
    width: 30,
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
  hypenText: {
    width: 10,
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
export default Timer;
