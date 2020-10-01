import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import {
  TextInput,
  Title,
  Button,
  Caption,
  Portal,
  Modal,
  Provider,
} from 'react-native-paper';
import { Picker } from '@react-native-community/picker';

import colors from '../colors';

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
  'DC',
  'FM',
  'FL',
  'GA',
  'GU',
  'HI',
  'ID',
  'IL',
  'IN',
  'IA',
  'KS',
  'KY',
  'LA',
  'ME',
  'MH',
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
  'MP',
  'OH',
  'OK',
  'OR',
  'PW',
  'PA',
  'PR',
  'RI',
  'SC',
  'SD',
  'TN',
  'TX',
  'UT',
  'VT',
  'VI',
  'VA',
  'WA',
  'WV',
  'WI',
  'WY',
];

const LocationForm = () => {
  const [state, setState] = useState(initialState);
  const [suggestedStates, setSuggested] = useState(STATES);
  const [error, setError] = useState(initErrorState);
  const [visible, setVisible] = useState(false);

  const handleSaveLocation = () => {
    if (!state.city) {
      setError({
        isError: true,
        state: 'city',
        message: '*Please enter the city you are in',
      });
    } else if (!state.state) {
      setError({
        isError: true,
        state: 'state',
        message: '*Please enter the state you are in',
      });
    } else if (!state.beachName) {
      setError({
        isError: true,
        state: 'beachName',
        message: '*Please enter the Beach that you are cleaning',
      });
    }
  };

  const handleStateText = (value) => {
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
    const newSuggest = STATES.filter((stateAbbrev, i) => {
      return stateAbbrev.startsWith(value.toUpperCase());
    });
    setVisible(true);
    setSuggested(newSuggest);
  };

  const handleSuggestedClick = (item) => {
    setState({ ...state, state: item });
    setVisible(false);
    setSuggested(STATES);
  };

  const SuggestedState = ({ item }) => {
    return (
      <View style={{ backgroundColor: '#fff' }}>
        <Button
          labelStyle={{ color: 'black', align: 'left' }}
          onPress={handleSuggestedClick}>
          {item}
        </Button>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <Title style={styles.heading}>Add location Details</Title>
      <View style={styles.fieldContainer}>
        <TextInput
          theme={{
            colors: { primary: colors.main, underlineColor: 'transparent' },
          }}
          keyboardType="numeric"
          style={styles.field}
          mode="outlined"
          label="City"
          value={state.city}
          onChangeText={(text) => setState({ ...state, city: text })}
        />
        {error.isError && error.state === 'city' && (
          <Caption style={styles.error}>{error.message}</Caption>
        )}
        <TextInput
          theme={{
            colors: { primary: colors.main, underlineColor: 'transparent' },
          }}
          keyboardType="numeric"
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
            colors: { primary: colors.main, underlineColor: 'transparent' },
          }}
          keyboardType="numeric"
          style={styles.field}
          mode="outlined"
          label="Beach Name"
          value={state.beachName}
          onChangeText={(text) => setState({ ...state, beachName: text })}
        />
        {error.isError && error.state === 'beachName' && (
          <Caption style={styles.error}>{error.message}</Caption>
        )}
        <Button
          style={styles.button}
          mode="contained"
          onPress={handleSaveLocation}>
          Save
        </Button>
      </View>
    </View>
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
    backgroundColor: colors.orange,
  },
  suggestedList: {
    height: 100,
  },
  error: {
    color: colors.warning,
  },
  modal: {
    backgroundColor: '#fff',
    height: 50,
  },
});

export default LocationForm;
