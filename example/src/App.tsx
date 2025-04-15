import {
  LogLevel,
  SignedCall,
} from '@clevertap/clevertap-signed-call-react-native';
import * as React from 'react';
import RegistrationPage from './screens/RegistrationScreen';
import { createNavigationContainerRef, NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DialerScreen from './screens/DialerScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Constants } from './Constants';
import { Alert } from 'react-native';

const navigationRef = createNavigationContainerRef();
const Stack = createNativeStackNavigator();

export default function App() {

  React.useEffect(() => {
    //enables Verbose mode logging for Signed Call SDK
    SignedCall.setDebugLevel(LogLevel.Verbose);
    Promise.all([AsyncStorage.getItem(
      Constants.KEY_LOGGED_IN_CUID
    ), AsyncStorage.getItem(
      Constants.KEY_SEGMENT
    )]).then((saveDetails) => {
      if (navigationRef.isReady() && saveDetails[0] != null && saveDetails[1] != null) {
        AsyncStorage.getItem(Constants.KEY_SC_DETAILS).then((details) => {
          if (details == null) {
            return;
          }
          const scDetails = JSON.parse(details);
          if (scDetails) {
            SignedCall.initialize(scDetails).then((response: SignedCallResponse) => {
              if (response.isSuccessful) {
                navigationRef.navigate('Dialer', { registeredCuid: saveDetails[0], registeredSegment: saveDetails[1] });
              } else {
                console.log('Signed Call initialization failed: ', response.error);
                Alert.alert(
                  'Signed Call initialization failed!',
                  response.error?.errorMessage
                );
              }
            }).catch((e: any) => {
              console.error(e);
            })
          }
        })

      }
    })
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
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
