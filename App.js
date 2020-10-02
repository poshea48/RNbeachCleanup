import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './screens/Home';
import CleanupPage from './screens/CleanupPage';
import colors from './colors';
import { AppProvider } from './context/appContext';
import { Provider as PaperProvider } from 'react-native-paper';
const Stack = createStackNavigator();

const App = () => {
  return (
    <AppProvider>
      <PaperProvider>
        <NavigationContainer style={styles.container}>
          <Stack.Navigator>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Cleanup" component={CleanupPage} />
            {/* <Stack.Screen name="Results" component={Results} /> */}
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </AppProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.main,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'space-between',
  },
});

// export default () => {
//   return (
//     <AppProvider>
//       <App />
//     </AppProvider>
//   );
// };

export default App;
