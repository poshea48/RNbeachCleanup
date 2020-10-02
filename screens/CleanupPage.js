import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAppState } from '../context/appContext';
import DebrisForm from '../components/DebrisForm';
import TrackerPage from '../components/TrackerPage';
import ResultsPage from '../components/ResultsPage';
import LocationForm from '../components/LocationForm';
import StartupInfo from '../components/StartupInfo';

const Tab = createBottomTabNavigator();

const CleanupPage = ({ navigation }) => {
  const { started, location } = useAppState();

  return (
    <Tab.Navigator
      // screenOptions={({ route }) => ({
      //   tabBarIcon: ({ focused, color, size }) => {
      //     let iconName;

      //     if (route.name === 'Home') {
      //       iconName = focused
      //         ? 'ios-information-circle'
      //         : 'ios-information-circle-outline';
      //     } else if (route.name === 'Settings') {
      //       iconName = focused ? 'ios-list-box' : 'ios-list';
      //     }

      //     // You can return any component that you like here!
      //     return <Ionicons name={iconName} size={size} color={color} />;
      //   },
      // })}
      tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
      }}>
      <Tab.Screen name="Start" component={StartupInfo} />
      <Tab.Screen
        name="Debris"
        component={DebrisForm}
        options={{ title: 'Debris Form' }}
      />
      <Tab.Screen name="Tracker" component={TrackerPage} />
      <Tab.Screen name="Results" component={ResultsPage} />
      <Tab.Screen name="Location" component={LocationForm} />
    </Tab.Navigator>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     paddingHorizontal: 10,
//     paddingVertical: 20,
//     alignItems: 'center',
//   },
//   heading: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     alignSelf: 'center',
//   },
// });

export default CleanupPage;
