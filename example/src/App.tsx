import SignedCall from 'clevertap-signed-call-react-native';
import * as React from 'react';
import { View } from 'react-native';
import { LogLevel } from '../../src/models/LogLevel';
import RegistrationPage from './screens/RegistrationScreen';

export default function App() {
  React.useEffect(() => {
    SignedCall.setDebugLevel(LogLevel.Verbose);
  }, []);

  return (
    <View>
      <RegistrationPage />
    </View>
  );
}

// function initiateCall() {
//   SignedCall.call('test123', 'test')
//     .then((response: SignedCallResponse) => {
//       if (response.isSuccessful) {
//         console.log('VoIP call is placed successfully', response);
//       } else {
//         console.log('VoIP call is failed: ', response.error);
//       }
//     })
//     .catch((e: any) => {
//       console.error(e);
//     });
// }

// function logoutSession() {
//   SignedCall.logout();
// }
