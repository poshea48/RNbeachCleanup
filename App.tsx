import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './screens/Home';
import CleanupPage from './screens/CleanupPage';
import colors from './colors';
import { AppProvider } from './context/appContext';
import { Provider as PaperProvider } from 'react-native-paper';
import { RootStackParamList } from './customTypes/navigation';

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <AppProvider>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerStyle: {
                backgroundColor: colors.white,
              },
              headerTintColor: colors.black,
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Cleanup" component={CleanupPage} />
            {/* <Stack.Screen name="Results" component={Results} /> */}
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </AppProvider>
  );
};

export default App;
