/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { Picker } from '@react-native-community/picker';
import { useAppDispatch, useAppState } from '../context/appContext';
import colors from '../colors';

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

const checkIfNotANumber = (num) => {
  return num.match(/[A-Za-z]+/);
};
const DebrisForm = () => {
  const [debris, setDebris] = useState('');
  const [error, setError] = useState(initErrorState);
  const [count, setCount] = useState('');
  const dispatch = useAppDispatch();
  const debrisDisplay = Debris.map((d, i) => (
    <Picker.Item key={d} label={d} value={d} />
  ));
  const handleCountInput = (num) => {
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

  return (
    <View style={styles.container}>
      <Text style={styles.text}>What did you collect?</Text>
      <Picker
        style={styles.picker}
        selectedValue={debris}
        onValueChange={(value) => setDebris(value)}>
        {debrisDisplay}
      </Picker>
      <View style={styles.keypad}>
        <TextInput
          mode="outlined"
          error={error.isError}
          theme={{
            colors: { primary: colors.main, underlineColor: 'transparent' },
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
        labelStyle={{ fontWeight: '800', color: '#fff' }}
        style={styles.button}
        mode="contained"
        onPress={submitDebris}>
        Collect it!
      </Button>
      <Button
        style={styles.link}
        labelStyle={{ color: colors.orange, fontWeight: '800' }}
        onPress={submitDebris}>
        Show Collected List
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  text: {
    color: 'black',
    fontSize: 30,
    textAlign: 'center',
  },
  picker: {},
  keypad: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keypadText: {
    color: 'black',
    marginRight: 5,
    marginTop: 6,
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
    backgroundColor: colors.main,
    alignSelf: 'center',
    fontWeight: '800',
  },
  link: {
    color: colors.orange,
  },
  error: {
    color: colors.warning,
    fontSize: 12,
  },
});

export default DebrisForm;
