/* eslint-disable react-native/no-raw-text */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DataTable, Headline } from 'react-native-paper';
import { useAppState } from '../context/appContext';
import colors from '../../colors';

const ResultsPage: React.FC = () => {
  const { debris } = useAppState();
  let displayRows;

  if (debris) {
    displayRows = Object.keys(debris).map((item, i) => (
      <DataTable.Row key={`${item}-${i}`}>
        <DataTable.Cell>{item}</DataTable.Cell>
        <DataTable.Cell>{debris[item]}</DataTable.Cell>
      </DataTable.Row>
    ));
  }
  return (
    <View style={styles.container}>
      <Headline style={styles.headline}>Final Results</Headline>
      {debris ? (
        <DataTable style={styles.dataTable}>
          <DataTable.Header>
            <DataTable.Title>
              <Text>Item Collected</Text>
            </DataTable.Title>
            <DataTable.Title numeric>
              <Text>Total</Text>
            </DataTable.Title>
          </DataTable.Header>
          {displayRows}
        </DataTable>
      ) : (
        <Headline>
          <Text style={styles.noResults}>No results yet</Text>
        </Headline>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    justifyContent: 'flex-start',
    height: '100%',
    backgroundColor: colors.white,
  },
  headline: {
    color: colors.main,
    alignSelf: 'center',
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  dataTable: {
    width: '100%',
  },
  noResults: {
    color: colors.orange,
    alignSelf: 'center',
    textAlign: 'center',
  },
  // heading: {},
  // button: {
  //   backgroundColor: colors.orange,
  //   color: 'white',
  //   fontWeight: '700',
  //   textTransform: 'uppercase',
  //   alignSelf: 'center',
  //   textAlign: 'center',
  //   paddingHorizontal: 10,
  //   borderRadius: 5,
  //   marginBottom: 20,
  // },
});

export default ResultsPage;
