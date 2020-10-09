import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import DebrisForm from '../components/DebrisForm';
import TrackerPage from '../components/TrackerPage';
import ResultsPage from '../components/ResultsPage';
import LocationForm from '../components/LocationForm';
import StartupInfo from '../components/StartupInfo';
import Icon from '../components/Icon';
import colors from '../colors';
import {
  CleanupTabParamList,
  RootStackParamList,
} from '../customTypes/navigation';

const Tab = createBottomTabNavigator<CleanupTabParamList>();

type CleanupScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Cleanup'
>;

const CleanupPage: React.FC = () => {
  // const { started, location } = useAppState();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let iconName;

          if (route.name === 'Start') {
            iconName = focused
              ? 'information-circle'
              : 'information-circle-outline';
          } else if (route.name === 'Debris') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Location') {
            iconName = focused ? 'pin' : 'pin-outline';
          } else if (route.name === 'Results') {
            iconName = focused ? 'checkmark-done' : 'checkmark-done-outline';
          } else if (route.name === 'Tracker') {
            iconName = focused ? 'locate' : 'locate-outline';
          }
          const newSize = 30;
          // You can return any component that you like here!
          return <Icon name={iconName} size={newSize} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: colors.success,
        inactiveTintColor: colors.black,
        style: { backgroundColor: colors.white },
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

export default CleanupPage;
