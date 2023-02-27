import { View, Text, TextInput, Button, Image } from 'react-native';
import React, { useState } from 'react';
import styles from '../styles/style';
import SignedCall from 'clevertap-signed-call-react-native';
import type { SignedCallResponse } from 'src/models/SignedCallResponse';
import type { CallEvent } from 'src/models/CallEvents';
import type { MissedCallActionClickResult } from 'src/models/MissedCallAction';
import { Constants } from '../Constants';
import Loader from '../components/Loader';

export default function RegistrationPage() {
  const [cuid, setCuid] = useState('');
  const [loading, setLoading] = useState(false);

  const initSignedCallSdk = () => {
    setLoading(true);

    SignedCall.init({
      accountId: Constants.SC_ACCOUNT_ID,
      apiKey: Constants.SC_API_KEY,
      cuid: cuid,
      missedCallActions: {
        '0': 'call me b ack',
      },
    })
      .then((response: SignedCallResponse) => {
        if (response.isSuccessful) {
          console.log('Signed Call SDK initialized: ', response);

          registerSignedCallEventListeners();
        } else {
          console.log('Signed Call initialization failed: ', response.error);
        }
      })
      .catch((e: any) => {
        console.error(e);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <View style={styles.mainContainer}>
      <Text style={styles.mainHeader}>CUID Registration</Text>
      <Image
        style={styles.image}
        source={require('../../assets/clevertap-logo.png')}
      />
      {loading && <Loader />}
      <View style={styles.mainSection}>
        <Text>Enter CUID</Text>
        <TextInput
          style={styles.inputStyle}
          autoCapitalize="none"
          autoCorrect={false}
          value={cuid}
          onChangeText={(text) => {
            setCuid(text);
          }}
        />
        <View style={styles.buttonContainer}>
          <Button
            title="Register and Continue"
            color="red"
            onPress={() => initSignedCallSdk()}
            disabled={cuid.length === 0}
          />
        </View>
      </View>
    </View>
  );
}

function registerSignedCallEventListeners() {
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
