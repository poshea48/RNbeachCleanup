import React from 'react';
import { View, Pressable, Text, StyleSheet, Alert } from 'react-native';
import { useAppDispatch, useAppState } from '../context/appContext';
import colors from '../../colors';

const FinishedButton: React.FC = () => {
  const dispatch = useAppDispatch();
  const { finished } = useAppState();
  return (
    <View style={styles.container}>
      <Pressable
        onPress={finished ? handleResumeAlert : handleCompleteAlert}
        style={({ pressed }) => [
          {
            transform: [
              { translateX: pressed ? 0 : 0 },
              { translateY: pressed ? 5 : 0 },
            ],
            shadowColor: pressed ? 'transparent' : colors.black,
            shadowOffset: pressed
              ? { width: 0, height: 0 }
              : { width: 0, height: 5 },
            shadowOpacity: 1.0,
          },
          finished ? styles.resumeButton : styles.completeButton,
        ]}>
        <Text
          style={
            finished ? styles.resumeButtonText : styles.completeButtonText
          }>
          {finished ? 'Resume Cleanup' : 'Cleanup Complete'}
        </Text>
      </Pressable>
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
    });
  }
  function handleFinishedPress() {
    dispatch({
      type: 'END_CLEANUP',
      payload: {
        stats: {
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
