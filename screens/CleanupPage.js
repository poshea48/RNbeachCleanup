import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Title, Button } from 'react-native-paper';
import DebrisForm from '../components/DebrisForm';
import { useAppState } from '../context/appContext';

const CleanupPage = ({ navigation }) => {
  const { started, location } = useAppState();

  return (
    <View style={styles.container}>
      {started ? (
        <Title>{location.beachName}</Title>
      ) : (
        <Button onPress={() => navigation.navigate('Location')}>
          Add Location Details
        </Button>
      )}
      <DebrisForm />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    alignItems: 'center',
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'center',
  },
});

export default CleanupPage;
