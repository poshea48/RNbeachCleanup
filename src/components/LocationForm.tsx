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

const LocationForm: React.FC = () => {
  const [state, setState] = useState(initialState);
  const [suggestedStates, setSuggested] = useState(STATES);
  const [updated, setUpdated] = useState(false);
  const [error, setError] = useState(initErrorState);
  const [visible, setVisible] = useState(false);
  const dispatch = useAppDispatch();
  const context = useAppState();

  useEffect(() => {
    if (context.location.city) {
      setState({
        ...context.location,
      });
    }
  }, [context.location]);

  const handleButtonClick = () => {
    if (updated) {
      setUpdated(false);
    } else {
      if (!state.city) {
        setError({
          isError: true,
          state: 'city',
          message: '*Please enter the city you are in',
        });
      } else if (!state.state || STATES.includes(state.state)) {
        setError({
          isError: true,
          state: 'state',
          message: '*Please enter the state you are in',
        });
      } else if (!STATES.includes(state.state)) {
        setError({
          isError: true,
          state: 'state',
          message: '*Please enter a valid state',
        });
      } else if (!state.beachName) {
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
              city: state.city,
              state: state.state,
              beachName: state.beachName,
            },
          },
        });
        setUpdated(true);
      }
    }
  };

  const handleStateText = (value: string) => {
    if (value.length > 2) {
      return;
    }

    if (value.match(/\d/)) {
      return;
    }
    setState({
      ...state,
      state: value.toUpperCase(),
    });
    const newSuggest = STATES.filter((stateAbbrev) => {
      return stateAbbrev.startsWith(value.toUpperCase());
    });
    setSuggested(newSuggest);
    if (newSuggest.length) {
      setVisible(true);
    }
  };

  const handleSuggestedClick = (item: string) => {
    setState({ ...state, state: item });
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
          value={state.city}
          onChangeText={(text) => setState({ ...state, city: text })}
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
            value={state.state}
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
            value={state.beachName}
            onChangeText={(text) => setState({ ...state, beachName: text })}
            onFocus={closeDropdown}
          />
          {error.isError && error.state === 'beachName' && (
            <Caption style={styles.error}>{error.message}</Caption>
          )}

          <Button
            style={[styles.button, saveButtonBackground]}
            mode="contained"
            onPress={handleButtonClick}>
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
