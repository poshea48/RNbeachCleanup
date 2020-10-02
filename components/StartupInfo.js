import React from 'react';
import { View, Text } from 'react-native';
import styled from 'react-native-styled-components';
import colors from '../colors';

const Container = styled(View, {
  justifyContent: 'flex-start',
  alignItems: 'center',
  marginBottom: 10,
  marginTop: 10,
  padding: 10,
});

const Welcome = styled(Text, {
  textAlign: 'center',
  fontSize: 22,
  fontWeight: 'bold',
  color: colors.main,
  marginBottom: 5,
});

const InfoField = styled(View, {
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  listStyleImage: 'bullet',
  margin: 0,
});

const Info = styled(Text, {
  color: colors.main,
  marginVertical: 20,
  marginHorizontal: 0,
});

const StartupInfo = () => {
  return (
    <Container>
      <Welcome>Welcome to your Mobile Beach Cleanup Dashboard</Welcome>
      <InfoField>
        <Info>Start the Tracker</Info>
        <Info>Collect the Debris</Info>
        <Info>Tell us where you are collection</Info>
        <Info>Submit the data</Info>
        <Info>THANK YOU!</Info>
      </InfoField>
    </Container>
  );
};

export default StartupInfo;
