import React from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import colors from '../colors';
import { useAppState, useAppDispatch } from '../context/appContext';

const Home = ({ navigation }) => {
  const { started } = useAppState();
  const dispatch = useAppDispatch();
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Beach Cleanup App</Text>
      <Button
        contentStyle={contentStyle}
        mode="contained"
        style={styles.button}
        onPress={() => {
          dispatch({ type: 'RESET' });
          navigation.navigate('Cleanup');
        }}>
        <Text style={styles.button}>New Cleanup</Text>
      </Button>
      {started && (
        <Button
          contentStyle={contentStyle}
          mode="contained"
          style={styles.button}>
          Continue Cleanup
        </Button>
      )}
    </SafeAreaView>
  );
};

const contentStyle = {
  width: 220,
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    justifyContent: 'center',
    height: '100%',
    backgroundColor: colors.main,
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#fff',
    marginBottom: 40,
    alignSelf: 'center',
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

export default Home;
