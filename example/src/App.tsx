/* eslint-disable react-native/no-inline-styles */
import SignedCall from 'clevertap-signed-call-react-native';
import * as React from 'react';
import type { CallEvent } from '../../src/models/CallEvents';
import type { SignedCallResponse } from 'src/models/SignedCallResponse';
import type { MissedCallActionClickResult } from 'src/models/MissedCallAction';
import { LogLevel } from '../../src/models/LogLevel';
import { StyleSheet, View, Button, Text } from 'react-native';

export default function App() {
  const [initResult, setInitResult] = React.useState<string | undefined>();
  const [isCallButtonDisabled, setCallButtonDisabled] = React.useState(true);

  React.useEffect(() => {
    SignedCall.setDebugLevel(LogLevel.Verbose);

    SignedCall.init({
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
          setCallButtonDisabled(!isCallButtonDisabled);
          setInitResult('Signed Call SDK initialized!');
          console.log('Signed Call SDK initialized: ', response);

          registerEventListeners();
        } else {
          setInitResult(
            'Signed Call SDK init failed:\n' + response.error?.errorMessage
          );
          console.log('Signed Call initialization failed: ', response.error);
        }
      })
      .catch((e: any) => {
        console.error(e);
        setInitResult('Signed Call SDK init failed:' + e);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.container}>
      <Text
        style={{
          textAlign: 'center',
          fontSize: 14,
          padding: 30,
          color: 'blue',
        }}
      >
        {initResult ? initResult : 'Please wait, Initializing the Signed Call!'}
      </Text>

      <Button
        title="Initiate Call"
        color="red"
        onPress={() => initiateCall()}
        disabled={isCallButtonDisabled}
      />

      <View style={{ margin: 10 }} />

      <Button
        title="Log Out"
        color="red"
        onPress={() => logoutSession()}
        disabled={isCallButtonDisabled}
      />
    </View>
  );
}

function registerEventListeners() {
  SignedCall.addListener(
    SignedCall.SignedCallOnCallStatusChanged,
    (event: CallEvent) => {
      console.log('SignedCallOnCallStatusChanged', event);
    }
  );

  SignedCall.addListener(
    SignedCall.SignedCallOnMissedCallActionClicked,
    (event: MissedCallActionClickResult) => {
      console.log('SignedCallOnMissedCallActionClicked', event);
    }
  );
}

function initiateCall() {
  SignedCall.call('test123', 'test')
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

function logoutSession() {
  SignedCall.logout();
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
