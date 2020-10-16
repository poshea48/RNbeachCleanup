import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './src/screens/Home';
import CleanupPage from './src/screens/CleanupPage';
import colors from './colors';
import { AppProvider } from './src/context/appContext';
import { Provider as PaperProvider } from 'react-native-paper';
import { RootStackParamList } from './src/customTypes/navigation';

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
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
