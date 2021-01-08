import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useAppDispatch, useAppState } from '../context/appContext';
import Button from './Button';
import colors from '../../colors';

const FinishedButton: React.FC = () => {
  const dispatch = useAppDispatch();
  const { finished, stats } = useAppState();
  return (
    <View style={styles.container}>
      {finished ? (
        <Button
          pressCb={handleResumeAlert}
          message="Resume Cleanup"
          styles={{
            container: styles.resumeButton,
            text: styles.resumeButtonText,
          }}
        />
      ) : (
        <Button
          pressCb={handleCompleteAlert}
          message="Cleanup Complete"
          styles={{
            container: styles.completeButton,
            text: styles.completeButtonText,
          }}
        />
      )}
    </View>
  );

  function handleCompleteAlert() {
    return Alert.alert('Cleanup Complete', 'Is your cleanup complete?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Ok',
        onPress: () => handleFinishedPress(),
      },
    ]);
  }

  function handleResumeAlert() {
    return Alert.alert('Resume Complete', 'Resume your cleanup?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Ok',
        onPress: () => handleResumePress(),
      },
    ]);
  }

  function handleResumePress() {
    dispatch({
      type: 'RESUME_CLEANUP',
      payload: {
        stats: {
          ...stats,
          currentStartTime: Date.now(),
        },
      },
    });
  }
  function handleFinishedPress() {
    dispatch({
      type: 'END_CLEANUP',
      payload: {
        stats: {
          ...stats,
          endTime: Date.now(),
        },
      },
    });
  }
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  completeButton: {
    width: 200,
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.finished,
    borderRadius: 10,
  },
  resumeButton: {
    width: 200,
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.main,
    borderRadius: 10,
  },
  completeButtonText: {
    color: colors.buttonText,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  resumeButtonText: {
    color: colors.white,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
});

export default FinishedButton;
