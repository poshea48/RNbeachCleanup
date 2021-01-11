/* eslint-disable react-native/no-raw-text */
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { DataTable, Headline, List, Divider } from 'react-native-paper';
import { useAppState } from '../context/appContext';
import colors from '../../colors';
import { convertTimeForDisplay, getTimeString } from '../utils/date-time';

function wait(timeout: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}

const ResultsPage: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const {
    finished,
    debrisCollected,
    stats: {
      date,
      initialStartTime,
      totalTime,
      endTime,
      totalCollected,
      totalDistance,
    },
  } = useAppState();

  const displayRows = getDebrisRows();
  const { hours, mins, secs } = convertTimeForDisplay(totalTime);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  return (
    <ScrollView
      scrollEnabled={true}
      style={{ backgroundColor: colors.white }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <View style={styles.container}>
        <Headline style={styles.headline}>
          {finished && 'Final'} Results
        </Headline>
        {debrisCollected ? (
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
              <ScrollView>{displayRows}</ScrollView>
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
                <Text style={styles.statData}>
                  {getTimeString(initialStartTime)}
                </Text>
              </View>
              <Divider style={styles.divider} />

              <View style={styles.statField}>
                <Text>Cleanup End Time:</Text>
                <Text style={styles.statData}>{getTimeString(endTime)}</Text>
              </View>
              <Divider style={styles.divider} />

              <View style={styles.statField}>
                <Text>TotalTime:</Text>
                <Text style={styles.statData}>
                  {finished && `${hours}:${mins}:${secs}`}
                </Text>
              </View>
              <Divider style={styles.divider} />

              <View style={styles.statField}>
                <Text>Total Distance Traveled: </Text>
                <Text style={styles.statData}>{totalDistance}</Text>
              </View>
            </List.Accordion>
          </>
        ) : finished ? (
          <Headline>
            <Text style={styles.noResults}>You did not collect anything</Text>
          </Headline>
        ) : (
          <Headline>
            <Text style={styles.noResults}>No results yet</Text>
          </Headline>
        )}
      </View>
    </ScrollView>
  );

  /****************** Util Functions **************************/

  function getDebrisRows() {
    if (!debrisCollected) return null;
    return Object.keys(debrisCollected).map((item, i) => (
      <DataTable.Row key={`${item}-${i}`}>
        <DataTable.Cell style={{ flex: 3 }}>
          <Text style={styles.row}>{item}</Text>
        </DataTable.Cell>
        <DataTable.Cell numeric>
          <Text style={styles.row}>{debrisCollected[item]}</Text>
        </DataTable.Cell>
      </DataTable.Row>
    ));
  }
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
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
    maxHeight: 350,
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
