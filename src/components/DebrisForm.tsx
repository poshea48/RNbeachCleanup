import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Picker } from '@react-native-community/picker';
import { useAppDispatch, useAppState } from '../context/appContext';
import colors from '../../colors';

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

// type DebrisNavProp = BottomTabNavigationProp<TabParamList, 'Debris'>;

const DebrisForm: React.FC = () => {
  const [debris, setDebris] = useState('');
  const [error, setError] = useState(initErrorState);
  const [success, setSuccess] = useState(false);
  const [count, setCount] = useState('');
  const dispatch = useAppDispatch();
  const context = useAppState();
  const pickerItemsDisplay = Debris.map((d) => (
    <Picker.Item key={d} label={d} value={d} />
  ));

  useEffect(() => {
    if (success && (!context.started || context.finished)) {
      setSuccess(false);
    }
    return () => setSuccess(false);
  }, [success, context.started, context.finished]);
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
        onValueChange={handlePickerItemChange}>
        {pickerItemsDisplay}
      </Picker>
      {success && <Text style={styles.successMessage}>✓ Item Collected</Text>}
      <View style={styles.keypad}>
        <TextInput
          mode="outlined"
          error={error.isError}
          underlineColor={colors.main}
          theme={{
            colors: { primary: colors.black },
          }}
          keyboardType="number-pad"
          style={styles.keypadLook}
          value={count}
          onChangeText={handleCountInput}
          label="Count"
        />
        {error.isError && <Text style={styles.error}>{error.message}</Text>}
      </View>
      <Pressable
        onPress={() => submitDebris()}
        style={({ pressed }) => [
          {
            transform: [
              { translateX: pressed ? 5 : 0 },
              { translateY: pressed ? 5 : 0 },
            ],
            shadowColor: pressed ? 'transparent' : colors.black,
            shadowOffset: pressed
              ? { width: 0, height: 0 }
              : { width: 5, height: 5 },
            shadowOpacity: 1.0,
          },
          styles.button,
          styles.startButton,
        ]}>
        <Text style={styles.buttonText}>Collect!</Text>
      </Pressable>

      <View style={styles.locationInfoContainer}>
        {context.location.city ? (
          <View style={styles.locationBeachInfoContainer}>
            <Text style={styles.locationInfoText}>
              Beach: {context.location.beachName}
            </Text>
            <Text style={styles.locationInfoText}>
              Location: {context.location.city}, {context.location.state}
            </Text>
          </View>
        ) : (
          <Text style={styles.locationInfoText}>No location set</Text>
        )}
      </View>
    </View>
  );

  /************************ Util functions ********************************/

  function handleCountInput(num: string) {
    // turn off collected message when user starts new item collection
    if (success) setSuccess(false);

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
  }

  function submitDebris() {
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

    // debris will always be a string
    // eslint-disable-next-line eqeqeq
    if (!debris || debris == 'Select an Item') {
      setError({
        isError: true,
        message: '*Please select an item',
      });
      return;
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
    setSuccess(true);
    setDebris('');
    setCount('');
  }

  function handlePickerItemChange(value: React.ReactText) {
    // turn off collected message when user starts new item collection
    if (success) setSuccess(false);
    value = String(value);
    setDebris(value);
  }
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    backgroundColor: colors.white,
    height: '100%',
  },
  text: {
    color: colors.main,
    fontSize: 30,
    textAlign: 'center',
    fontWeight: '800',
  },
  picker: {
    height: '40%',
    color: colors.white,
    marginTop: 20,
  },
  successMessage: {
    color: colors.success,
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: '800',
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
    justifyContent: 'center',
    marginVertical: 10,
    // paddingVertical: 10,
    borderRadius: 5,
    width: 200,
    height: 50,
    backgroundColor: colors.main,
    alignSelf: 'center',
    fontWeight: '800',
  },
  buttonText: {
    color: colors.main,
    fontWeight: '700',
    textTransform: 'uppercase',
    alignSelf: 'center',
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: colors.orange,
  },

  error: {
    color: colors.warning,
    fontSize: 12,
    textTransform: 'uppercase',
    fontWeight: '800',
  },
  locationInfoContainer: {
    padding: 20,
    marginTop: 10,
    color: colors.warning,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationInfoText: {
    color: colors.black,
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  locationBeachInfoContainer: {
    justifyContent: 'center',
  },
});

export default DebrisForm;
