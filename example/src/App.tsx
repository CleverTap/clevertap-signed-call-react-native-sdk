import { SignedCall } from 'clevertap-signed-call-react-native';
import * as React from 'react';
import { LogLevel } from '../../src/models/LogLevel';
import RegistrationPage from './screens/RegistrationScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DialerScreen from './screens/DialerScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  React.useEffect(() => {
    //enables Verbose mode logging for Signed Call SDK
    SignedCall.setDebugLevel(LogLevel.Verbose);
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Registration">
        <Stack.Screen
          name="Registration"
          component={RegistrationPage}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Dialer"
          component={DialerScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
