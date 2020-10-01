import React from 'react';
import { View, Text } from 'react-native';
import styled from 'react-native-styled-components';
import colors from '../colors';

const Container = styled(View, {
  flex: 2,
  justifyContent: 'flex-start',
  alignItems: 'center',
  marginBottom: 10,
});

const Welcome = styled(Text, {
  flex: 1,
  textAlign: 'center',
  fontSize: 22,
  fontWeight: 'bold',
  color: colors.main,
  marginBottom: 5,
});

const InfoField = styled(View, {
  flex: 3,
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  listStyleImage: 'bullet',
  margin: 0,
});

const Info = styled(Text, {
  color: colors.main,
  marginVertical: 1,
  marginHorizontal: 0,
});

const StartupInfo = () => {
  return (
    <Container>
      <Welcome>Welcome to your Mobile Beach Cleanup Dashboard</Welcome>
      <InfoField>
        <Info>Add whatever info about cleanup</Info>
        <Info>Add your location for better data collection</Info>
        <Info>Turn on GPS to track your distance covered</Info>
        <Info>When you are ready hit the Start Cleanup Button</Info>
        <Info>THANK YOU!</Info>
      </InfoField>
    </Container>
  );
};

export default StartupInfo;
