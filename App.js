import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AsyncStorage, StatusBar } from 'react-native';
import PhoneScreen from './screens/PhoneScreen';
import VerificationScreen from './screens/VerificationScreen';
import GeneralInfoScreen from './screens/GeneralInfoScreen';
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
          initialRouteName={isLoggedIn ? "Dashboard" : "PhoneScreen"}
          screenOptions={{
            header: () => <StatusBar barStyle="dark-content" backgroundColor="#fff" />
          }}>
          <Stack.Screen name="PhoneScreen" component={PhoneScreen} options={{ headerShown: false }} />
          <Stack.Screen name="VerificationScreen" component={VerificationScreen} />
          <Stack.Screen name="GeneralInfoScreen" component={GeneralInfoScreen} />
          <Stack.Screen name="Dashboard" component={Dashboard} />
        </Stack.Navigator>
      </NavigationContainer>
    );
} 