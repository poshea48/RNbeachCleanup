import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../../colors';
import { useAppState, useAppDispatch } from '../../context/appContext';
import { convertTimeForDisplay } from '../../utils/date-time';
import Button from '../Button';

const Timer: React.FC = () => {
  const { stats } = useAppState();
  const [timeDisplay, setTimeDisplay] = useState(
    stats.totalTime + Math.floor((Date.now() - stats.startTime) / 1000),
  );
  const [timer, setTimer] = useState({
    hours: '00',
    mins: '00',
    secs: '00',
  });
  const dispatch = useAppDispatch();

  useEffect(() => {
    let timerId: NodeJS.Timeout | undefined;
    if (stats.startTime) {
      timerId = setInterval(() => {
        const newTime = timeDisplay + 1;
        setTimer(convertTimeForDisplay(newTime));
        setTimeDisplay(newTime);
      }, 1000);
    } else if (timerId) {
      clearInterval(timerId);
    }
    return () => timerId && clearInterval(timerId);
  }, [stats.startTime, timeDisplay]);
  console.log(stats);
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
        {stats.startTime ? (
          <Button
            pressCb={pause}
            message="Pause"
            styles={{
              container: { backgroundColor: colors.warning },
              text: { color: colors.white },
            }}
          />
        ) : stats.started ? (
          <Button
            pressCb={resume}
            message="Resume"
            styles={{
              container: { backgroundColor: colors.success },
              text: { color: colors.white },
            }}
          />
        ) : (
          <Button
            pressCb={() => console.log('resume')}
            message="Start"
            styles={{
              container: { backgroundColor: colors.success },
              text: { color: colors.white },
            }}
          />
        )}
      </View>
    </View>
  );

  /*********** Util Functions *************/

  function pause() {
    dispatch({
      type: 'PAUSE_TIMER',
      payload: {
        stats: {
          ...stats,
          startTime: 0,
          totalTime:
            stats.totalTime + Math.floor((Date.now() - stats.startTime) / 1000),
        },
      },
    });
  }

  function resume() {
    dispatch({
      type: 'RESUME_TIMER',
      payload: {
        stats: {
          ...stats,
          startTime: Date.now(),
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
    paddingVertical: 20,
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
