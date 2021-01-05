import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useAppDispatch, useAppState } from '../context/appContext';
import colors from '../../colors';
import FinishedButton from './FinishedButton';

const initErrorState = {
  isError: false,
  message: '',
};

const checkIfNotANumber = (num: string) => {
  return num.match(/[A-Za-z]+/);
};

const FlatListItemSeparator = () => {
  return (
    <View
      style={{
        height: 1,
        width: '100%',
        backgroundColor: colors.gray,
      }}
    />
  );
};

// type DebrisNavProp = BottomTabNavigationProp<TabParamList, 'Debris'>;

const DebrisForm: React.FC = () => {
  const [debris, setDebris] = useState('');
  const [otherDebris, setOtherDebris] = useState('');
  const [otherOpen, setOtherOpen] = useState(false);
  const [error, setError] = useState(initErrorState);
  const [success, setSuccess] = useState(false);
  const [count, setCount] = useState('');
  const dispatch = useAppDispatch();
  const context = useAppState();

  useEffect(() => {
    if (context.finished) {
      if (error.isError) setError(initErrorState);
      if (success) setSuccess(false);
      if (otherOpen) setOtherOpen(false);
      if (debris) setDebris('');
      if (otherDebris) setOtherDebris('');
    }
  }, [
    context.finished,
    error.isError,
    success,
    otherOpen,
    debris,
    otherDebris,
  ]);
  useEffect(() => {
    if (success && (!context.started || context.finished || error.isError)) {
      setSuccess(false);
    }
  }, [success, context.started, context.finished, error.isError]);
  return (
    <View style={styles.container}>
      <Text style={styles.text}>What did you collect?</Text>
      <FlatList
        style={styles.debrisList}
        data={context.debrisList}
        keyExtractor={(item) => item}
        renderItem={({ item }) => itemView(item)}
        ItemSeparatorComponent={FlatListItemSeparator}
      />
      {otherOpen && (
        <View style={styles.otherItemView}>
          <TextInput
            mode="outlined"
            error={error.isError}
            underlineColor={colors.main}
            theme={{
              colors: { primary: colors.black },
            }}
            keyboardType="default"
            onChangeText={(text) => {
              setOtherDebris(text);
            }}
            value={otherDebris}
            label="Add an Item"
            style={{
              width: '100%',
              margin: 0,
            }}
          />
        </View>
      )}
      {success && <Text style={styles.successMessage}>✓ Item Collected</Text>}
      {!context.finished && (
        <View style={styles.keypad}>
          <TextInput
            mode="outlined"
            error={error.isError}
            underlineColor={colors.main}
            theme={{
              colors: { primary: colors.black },
            }}
            keyboardType="number-pad"
            returnKeyType="done"
            style={styles.keypadLook}
            value={count}
            onChangeText={handleCountInput}
            label="Count"
          />
          {error.isError && <Text style={styles.error}>{error.message}</Text>}
        </View>
      )}
      {!context.finished && (
        <Pressable
          onPress={() => submitDebris()}
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
            styles.button,
            styles.startButton,
          ]}>
          <Text style={styles.buttonText}>Collect!</Text>
        </Pressable>
      )}
      <FinishedButton />

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

  /**************** Util functions ******************/

  function itemView(item: string) {
    return (
      <View
        style={[
          styles.debrisItemView,
          {
            backgroundColor: item == debris ? colors.success : colors.white,
          },
        ]}>
        <Pressable onPress={() => handleItemSelect(item)}>
          <Text
            style={[
              styles.debrisItemText,
              {
                color: item == debris ? colors.white : colors.black,
              },
            ]}>
            {item}
          </Text>
        </Pressable>
      </View>
    );
  }

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
    // if debris is empty and not other
    if (!debris && debris != 'Other') {
      setError({
        isError: true,
        message: '*Please select an item',
      });
      return;
    }

    // Handle if other was touched
    if (debris == 'Other') {
      // no input
      if (!otherDebris) {
        setError({
          isError: true,
          message: '*Please type in a new item',
        });
        return;
      }
      // if input is already in debris list
      if (
        context.debrisList.find(
          (item) => item.toLowerCase() == otherDebris.toLowerCase(),
        )
      ) {
        setError({
          isError: true,
          message: '*This item is already on the list',
        });
        return;
      }

      dispatch({
        type: 'ADD_OTHER_DEBRIS',
        payload: {
          debris: {
            item: otherDebris,
            count: Number(count),
          },
        },
      });
      setOtherDebris('');
      setOtherOpen(false);
    } else {
      dispatch({
        type: 'ADD_DEBRIS',
        payload: {
          debris: {
            item: debris,
            count: Number(count),
          },
        },
      });
    }
    setSuccess(true);
    setDebris('');
    setCount('');
  }

  function handleItemSelect(value: string) {
    if (value == 'Other') {
      setOtherOpen(true);
    } else if (otherOpen) {
      setOtherOpen(false);
      setOtherDebris('');
    }
    // turn off collected message when user starts new item collection
    if (success) setSuccess(false);
    if (error) setError(initErrorState);
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
    paddingBottom: 20,
  },
  debrisList: {
    backgroundColor: colors.main,
  },
  debrisItemView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  otherItemView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  debrisItemText: {
    color: colors.black,
    fontSize: 20,
    fontWeight: '900',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  successMessage: {
    color: colors.success,
    marginTop: 20,
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
    borderRadius: 10,
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
