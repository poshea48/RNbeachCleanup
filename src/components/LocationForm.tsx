import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text, Pressable } from 'react-native';
import { TextInput, Title, Button, Caption } from 'react-native-paper';

import colors from '../../colors';
import { useAppDispatch, useAppState } from '../context/appContext';

const initialState = {
  beachName: '',
  city: '',
  state: '',
};
const initErrorState = {
  isError: false,
  state: '',
  message: '',
};

const STATES = [
  'AL',
  'AK',
  'AS',
  'AZ',
  'AR',
  'CA',
  'CO',
  'CT',
  'DE',
  'FL',
  'GA',
  'HI',
  'ID',
  'IL',
  'IN',
  'IA',
  'KS',
  'KY',
  'LA',
  'ME',
  'MD',
  'MA',
  'MI',
  'MN',
  'MS',
  'MO',
  'MT',
  'NE',
  'NV',
  'NH',
  'NJ',
  'NM',
  'NY',
  'NC',
  'ND',
  'OH',
  'OK',
  'OR',
  'PA',
  'RI',
  'SC',
  'SD',
  'TN',
  'TX',
  'UT',
  'VT',
  'VA',
  'WA',
  'WV',
  'WI',
  'WY',
];

function isValidState(state: string) {
  return STATES.includes(state);
}

const LocationForm: React.FC = () => {
  const [location, setLocation] = useState(initialState);
  const [suggestedStates, setSuggested] = useState(STATES);
  const [updated, setUpdated] = useState(false);
  const [error, setError] = useState(initErrorState);
  const [visible, setVisible] = useState(false);
  const dispatch = useAppDispatch();
  const context = useAppState();

  useEffect(() => {
    if (context.location.city) {
      setLocation({
        ...context.location,
      });
    }
  }, [context.location]);

  const handleSaveLocation = () => {
    if (updated) {
      setUpdated(false);
    } else {
      if (!location.city) {
        setError({
          isError: true,
          state: 'city',
          message: '*Please enter the city you are in',
        });
      } else if (!location.state) {
        setError({
          isError: true,
          state: 'state',
          message: '*Please enter the state you are in',
        });
      } else if (!isValidState(location.state)) {
        setError({
          isError: true,
          state: 'state',
          message: '*Please enter a valid state',
        });
      } else if (!location.beachName) {
        setError({
          isError: true,
          state: 'beachName',
          message: '*Please enter the Beach that you are cleaning',
        });
      } else {
        dispatch({
          type: 'ADD_LOCATION',
          payload: {
            location: {
              city: location.city,
              state: location.state,
              beachName: location.beachName,
            },
          },
        });
        setError(initErrorState);
        setUpdated(true);
      }
    }
  };

  const handleStateText = (value: string) => {
    value = value.toUpperCase();
    if (value.length > 2) {
      return;
    }

    if (value.match(/\d/)) {
      return;
    }
    setLocation({
      ...location,
      state: value,
    });

    // if user types in a valid state, then no need to show suggestions
    if (isValidState(value)) {
      console.log('we have a valid state, dont show suggestions');
      setVisible(false);
      if (error.isError) setError(initErrorState);
    } else {
      const newSuggest = STATES.filter((stateAbbrev) => {
        return stateAbbrev.startsWith(value);
      });
      setSuggested(newSuggest);

      if (newSuggest.length) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    }
  };

  // autocomplete state
  const handleSuggestedClick = (item: string) => {
    setLocation({ ...location, state: item });
    if (error.isError) {
      setError(initErrorState);
    }
    setVisible(false);
    setSuggested(STATES);
  };

  const handleCloseSuggested = () => {
    if (visible) setVisible(false);
  };

  const SuggestedState = ({ item }: { item: string }) => {
    return (
      <View
        style={{
          backgroundColor: colors.white,
          borderBottomWidth: 1,
          borderBottomColor: colors.gray,
          zIndex: 25,
        }}>
        <Button
          labelStyle={{ color: colors.black, alignSelf: 'flex-start' }}
          contentStyle={{ alignSelf: 'flex-start', padding: 0, zIndex: 25 }}
          onPress={() => {
            handleSuggestedClick(item);
          }}>
          <Text>{item}</Text>
        </Button>
      </View>
    );
  };

  const closeDropdown = () => {
    if (visible) {
      setVisible(false);
    }
  };
  console.log(`current state is ${location.state}`);
  const saveButtonBackground = updated
    ? { backgroundColor: colors.success }
    : { backgroundColor: colors.orange };
  return (
    <Pressable style={styles.container} onPress={handleCloseSuggested}>
      <Title style={styles.heading}>
        <Text>Add location Details</Text>
      </Title>
      <View style={styles.fieldContainer}>
        <TextInput
          theme={{
            colors: { primary: colors.main },
          }}
          underlineColor="transparent"
          disabled={updated}
          keyboardType="default"
          style={styles.field}
          mode="outlined"
          label="City"
          value={location.city}
          onChangeText={(text) => setLocation({ ...location, city: text })}
          onFocus={closeDropdown}
        />
        {error.isError && error.state === 'city' && (
          <Caption style={styles.error}>{error.message}</Caption>
        )}
        <View>
          <TextInput
            theme={{
              colors: { primary: colors.main },
            }}
            underlineColor="transparent"
            disabled={updated}
            keyboardType="default"
            style={styles.field}
            mode="outlined"
            label="State"
            value={location.state}
            onChangeText={handleStateText}
          />
          {visible && (
            <FlatList
              data={suggestedStates}
              renderItem={({ item }) => <SuggestedState item={item} />}
              keyExtractor={(item) => item}
              style={styles.suggestedList}
            />
          )}
          {error.isError && error.state === 'state' && (
            <Caption style={styles.error}>{error.message}</Caption>
          )}

          <TextInput
            theme={{
              colors: { primary: colors.main },
            }}
            underlineColor="transparent"
            keyboardType="default"
            disabled={updated}
            style={styles.field}
            mode="outlined"
            label="Beach Name"
            value={location.beachName}
            onChangeText={(text) =>
              setLocation({ ...location, beachName: text })
            }
            onFocus={closeDropdown}
          />
          {error.isError && error.state === 'beachName' && (
            <Caption style={styles.error}>{error.message}</Caption>
          )}

          <Button
            style={[styles.button, saveButtonBackground]}
            mode="contained"
            onPress={handleSaveLocation}>
            <Text>{updated ? 'Edit' : 'Save'}</Text>
          </Button>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    alignSelf: 'center',
    color: colors.main,
    textTransform: 'uppercase',
    fontWeight: '800',
    marginBottom: 20,
  },
  fieldContainer: {},
  field: {
    marginBottom: 10,
  },

  button: {
    marginTop: 10,
  },
  suggestedList: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: colors.main,
    top: 50,
    left: 0,
    width: '100%',
    zIndex: 20,
    minHeight: 20,
    maxHeight: 200,
  },
  error: {
    color: colors.warning,
  },
});

export default LocationForm;
