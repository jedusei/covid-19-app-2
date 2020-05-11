import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AsyncStorage, StatusBar } from 'react-native';
import Landing from './screens/Landing';
import Verification from './screens/Verification'
import GeneralInfo from './screens/GeneralInfo';
import Dashboard from './screens/Dashboard';

const Stack = createStackNavigator();
export default function App() {
  const [isLoggedIn, setLoggedIn] = React.useState(null);
  React.useEffect(() => {
    //AsyncStorage.removeItem('logged_in');
    AsyncStorage.getItem('logged_in', (err, result) => {
      setLoggedIn(result === "true");
    });
  }, []);
  if (isLoggedIn === null)
    return null;
  else
    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={isLoggedIn ? "Dashboard" : "Landing"}
          screenOptions={{
            header: () => <StatusBar barStyle="dark-content" backgroundColor="#fff" />
          }}>
          <Stack.Screen name="Landing" component={Landing} options={{ headerShown: false }} />
          <Stack.Screen name="Verification" component={Verification} />
          <Stack.Screen name="GeneralInfo" component={GeneralInfo} />
          <Stack.Screen name="Dashboard" component={Dashboard} />
        </Stack.Navigator>
      </NavigationContainer>
    );
} 