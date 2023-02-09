import {
  setDebugLevel,
  init,
  call,
  addListener,
  removeListener,
  SignedCallOnCallStatusChanged,
  SignedCallOnMissedCallActionClicked,
} from 'clevertap-signed-call-react-native';
import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import type { CallEvent } from '../../src/models/CallEvents';
import type { SignedCallResponse } from 'src/models/SignedCallResponse';
import type { MissedCallActionClickResult } from 'src/models/MissedCallAction';
import { LogLevel } from '../../src/models/LogLevel';

export default function App() {
  const [result] = React.useState<string | null>();

  React.useEffect(() => {
    setDebugLevel(LogLevel.Off);

    init({
      accountId: '61a52046f56a14cb19a1e9cc',
      apiKey:
        '9dcced09dae16c5e3606c22346d92361b77efdb360425913850bea4f22d812dd',
      cuid: 'shivam',
      missedCallActions: {
        '0': 'call me back',
      },
    })
      .then((response: SignedCallResponse) => {
        if (response.isSuccessful) {
          console.log('Signed Call SDK initialized: ', response);
          addListener(SignedCallOnCallStatusChanged, (event: CallEvent) => {
            console.log('SignedCallOnCallStatusChanged', event);
          });

          addListener(
            SignedCallOnMissedCallActionClicked,
            (event: MissedCallActionClickResult) => {
              console.log('SignedCallOnMissedCallActionClicked', event);
            }
          );

          //initiating a VoIP call
          initiateCall();
        } else {
          console.log('Signed Call initialization failed: ', response.error);
        }
      })
      .catch((e: any) => {
        console.error(e);
        removeListener(SignedCallOnCallStatusChanged);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text>Result: {result ?? 'Signed Call Initialized'}</Text>
    </View>
  );
}

function initiateCall() {
  call('test1234', 'test')
    .then((response: SignedCallResponse) => {
      if (response.isSuccessful) {
        console.log('VoIP call is placed successfully', response);
      } else {
        console.log('VoIP call is failed: ', response.error);
      }
    })
    .catch((e: any) => {
      console.error(e);
    });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
