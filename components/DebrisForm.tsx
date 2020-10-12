/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { Picker } from '@react-native-community/picker';
import { useAppDispatch } from '../context/appContext';
import colors from '../colors';
import { TabParamList } from '../customTypes/navigation';

const Debris = [
  'Select an Item',
  'Batteries',
  'Beverage containers-Metal',
  'Beverage containers-Glass',
  'Bottle caps',
  'Cigarette butts',
  'Clothes/Fabrics',
  'Fishing gear - Line/nets/rope',
  'Fishing gear - Floats/buoys',
  'Flip-flops',
  'Food wrappers',
  'Items/pieces - Glass',
  'Items/pieces - Metal',
  'Items/pieces - Plastic',
  'Paper/cardboard',
  'Plastic bags',
  'Six-pack rings',
  'Styrofoam',
  'Other',
];

const initErrorState = {
  isError: false,
  message: '',
};

const checkIfNotANumber = (num: string) => {
  return num.match(/[A-Za-z]+/);
};

type DebrisNavProp = BottomTabNavigationProp<TabParamList, 'Debris'>;

const DebrisForm: React.FC<{ navigation: DebrisNavProp }> = ({
  navigation,
}) => {
  const [debris, setDebris] = useState('');
  const [error, setError] = useState(initErrorState);
  const [count, setCount] = useState('');
  const dispatch = useAppDispatch();
  const debrisDisplay = Debris.map((d) => (
    <Picker.Item key={d} label={d} value={d} />
  ));
  const handleCountInput = (num: string) => {
    if (checkIfNotANumber(num)) {
      setError({
        isError: true,
        message: 'Count must be a number',
      });
      setCount('');
      return;
    }
    setError(initErrorState);
    setCount(num);
  };
  const submitDebris = () => {
    if (!count) {
      setError({
        isError: true,
        message: '*Please add a count for this item collected',
      });
      return;
    }
    if (checkIfNotANumber(count)) {
      setError({
        isError: true,
        message: '*Count must be a number',
      });
      return;
    }
    if (!debris || debris === 'Select an Item') {
      setError({
        isError: true,
        message: '*Please select an item',
      });
    }
    dispatch({
      type: 'ADD_DEBRIS',
      payload: {
        debris: {
          item: debris,
          count: Number(count),
        },
      },
    });
    setDebris('');
    setCount('');
  };

  const handleValueChange = (value: React.ReactText) => {
    value = String(value);
    setDebris(value);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>What did you collect?</Text>
      <Picker
        style={styles.picker}
        itemStyle={{
          paddingVertical: 80,
          color: colors.black,
          fontSize: 30,
          fontWeight: '800',
          lineHeight: 100,
          textTransform: 'uppercase',
        }}
        selectedValue={debris}
        onValueChange={handleValueChange}>
        {debrisDisplay}
      </Picker>
      <View style={styles.keypad}>
        <TextInput
          mode="outlined"
          error={error.isError}
          underlineColor={colors.main}
          theme={{
            colors: { primary: colors.black },
          }}
          keyboardType="numeric"
          style={styles.keypadLook}
          value={count}
          onChangeText={handleCountInput}
          label="Count"
        />
        {error.isError && <Text style={styles.error}>{error.message}</Text>}
      </View>

      <Button
        labelStyle={{
          fontWeight: '800',
          color: colors.white,
        }}
        style={styles.button}
        mode="contained"
        onPress={submitDebris}>
        <Text>Collect it!</Text>
      </Button>
      <Button
        labelStyle={{ color: colors.gray, fontWeight: '800' }}
        onPress={() => navigation.navigate('Results')}>
        <Text style={styles.link}>Show Collected List</Text>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    backgroundColor: colors.main,
    height: '100%',
  },
  text: {
    color: colors.orange,
    fontSize: 30,
    textAlign: 'center',
    fontWeight: '800',
  },
  picker: {
    height: '40%',
    color: colors.warning,
    marginTop: 20,
  },
  keypad: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keypadLook: {
    height: 40,
    width: 100,
    padding: 10,
    borderColor: colors.main,
  },
  button: {
    marginVertical: 10,
    paddingVertical: 5,
    width: 150,
    backgroundColor: colors.orange,
    alignSelf: 'center',
    fontWeight: '800',
    shadowColor: colors.black,
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 1.0,
  },
  link: {
    color: colors.orange,
  },
  error: {
    color: colors.warning,
    fontSize: 12,
    textTransform: 'uppercase',
    fontWeight: '800',
  },
});

export default DebrisForm;
