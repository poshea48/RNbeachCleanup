import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import colors from '../colors';
import { useAppState, useAppDispatch } from '../context/appContext';
import { RootStackParamList } from '../customTypes/navigation';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const Home: React.FC<{ navigation: HomeScreenNavigationProp }> = ({
  navigation,
}) => {
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
          <Text>Continue Cleanup</Text>
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
    color: colors.white,
    marginBottom: 40,
    alignSelf: 'center',
  },
  button: {
    backgroundColor: colors.orange,
    color: colors.white,
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
