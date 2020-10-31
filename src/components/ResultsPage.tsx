/* eslint-disable react-native/no-raw-text */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DataTable, Headline, List, Divider } from 'react-native-paper';
import { useAppState } from '../context/appContext';
import colors from '../../colors';

const ResultsPage: React.FC = () => {
  const {
    debris,
    stats: {
      date,
      startTime,
      endTime,
      totalCollected,
      totalDistance,
      totalTime,
    },
  } = useAppState();
  let displayRows;

  if (debris) {
    displayRows = Object.keys(debris).map((item, i) => (
      <DataTable.Row key={`${item}-${i}`}>
        <DataTable.Cell>
          <Text style={styles.row}>{item}</Text>
        </DataTable.Cell>
        <DataTable.Cell numeric>
          <Text style={styles.row}>{debris[item]}</Text>
        </DataTable.Cell>
      </DataTable.Row>
    ));
  }
  return (
    <View style={styles.container}>
      <Headline style={styles.headline}>Final Results</Headline>
      {debris ? (
        <>
          <DataTable style={styles.dataTable}>
            <DataTable.Header style={{ paddingVertical: 0 }}>
              <DataTable.Title>
                <Text style={styles.tableHeader}>Item Collected</Text>
              </DataTable.Title>
              <DataTable.Title numeric>
                <Text style={styles.tableHeader}>Total</Text>
              </DataTable.Title>
            </DataTable.Header>
            {displayRows}
            <DataTable.Header>
              <DataTable.Title>
                <Text style={styles.tableHeader}>Total Collected:</Text>
              </DataTable.Title>
              <DataTable.Title numeric>
                <Text style={styles.total}>{totalCollected}</Text>
              </DataTable.Title>
            </DataTable.Header>
          </DataTable>

          <List.Accordion
            title="Other Stats"
            titleStyle={{ color: colors.main }}
            style={styles.statsContainer}
            left={(props) => (
              <List.Icon {...props} color={colors.main} icon="clipboard" />
            )}>
            <View style={styles.statField}>
              <Text style={styles.statTitle}>Todays Date:</Text>
              <Text style={styles.statData}>{date}</Text>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.statField}>
              <Text>Cleanup Start Time: </Text>
              <Text style={styles.statData}>{startTime}</Text>
            </View>
            <Divider style={styles.divider} />

            <View style={styles.statField}>
              <Text>Cleanup End Time:</Text>
              <Text style={styles.statData}>{endTime}</Text>
            </View>
            <Divider style={styles.divider} />

            <View style={styles.statField}>
              <Text>TotalTime:</Text>
              <Text style={styles.statData}>{totalTime}</Text>
            </View>
            <Divider style={styles.divider} />

            <View style={styles.statField}>
              <Text>Total Distance Traveled: </Text>
              <Text style={styles.statData}>{totalDistance}</Text>
            </View>
          </List.Accordion>
        </>
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
    paddingHorizontal: 30,
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
    marginTop: 20,
    backgroundColor: colors.orange,
    borderRadius: 10,
  },
  tableHeader: {
    fontSize: 20,
    color: colors.black,
  },
  row: {
    color: colors.white,
    fontSize: 18,
  },
  total: {
    color: colors.main,
    fontWeight: '700',
    fontSize: 20,
  },
  noResults: {
    color: colors.orange,
    alignSelf: 'center',
    textAlign: 'center',
  },
  statsContainer: {
    marginTop: 10,
    padding: 20,
  },
  divider: {
    marginVertical: 5,
  },
  statField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    paddingRight: 30,
  },
  statTitle: {
    flex: 2,
  },
  statData: {
    fontWeight: '800',
  },
});

export default ResultsPage;
