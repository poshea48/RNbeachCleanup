import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../../colors';
import { useAppState } from '../../context/appContext';
import { convertTimeForDisplay } from '../../utils/date-time';
import Button from '../Button';

const Timer: React.FC = () => {
  const { stats } = useAppState();

  // const handleClick = () => {
  //   if (state.currentAction === 'running') {
  //     pause();
  //   } else if (state.currentAction === 'startup') {
  //     start();
  //   } else if (state.currentAction === 'paused') {
  //     resume();
  //   }
  // };

  const { hours, mins, secs } = convertTimeForDisplay(stats?.totalTime);

  return (
    <View style={styles.container}>
      <View style={styles.timerDisplay}>
        <Text style={styles.timerText}>{hours}</Text>
        <Text style={styles.timerText}>:</Text>
        <Text style={styles.timerText}>{mins}</Text>
        <Text style={styles.timerText}>:</Text>
        <Text style={styles.timerText}>{secs}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          pressCb={() => console.log('start')}
          message="Start"
          styles={{
            container: { backgroundColor: colors.success },
            text: { color: colors.white },
          }}
        />
        <Button
          pressCb={() => console.log('stop')}
          message="Stop"
          styles={{
            container: { backgroundColor: colors.warning },
            text: { color: colors.white },
          }}
        />
      </View>
    </View>
  );
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
  },
  timerText: {
    fontSize: 20,
    fontWeight: '800',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
export default Timer;

// <Container>
//   <Button onClick={handleClick} action={state.currentAction}>
//     {actionDisplay}
//   </Button>
//   <FinishedButton action={state.currentAction} onClick={finish}>
//     Finish
//   </FinishedButton>
// </Container>

// <DurationDisplay>
//   <span>{hours}</span>
//   <span style={{ width: "10px" }}>:</span>
//   <span>{mins}</span>
//   <span style={{ width: "10px" }}>:</span>
//   <span>{secs}</span>
// </DurationDisplay>
