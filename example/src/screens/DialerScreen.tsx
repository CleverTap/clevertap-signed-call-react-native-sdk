/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  Image,
  TextInput,
  Button,
  Alert,
  Keyboard,
  Platform,
  Switch,
} from 'react-native';
import React from 'react';
import styles from '../styles/style';
import {
  SignedCall,
  SignedCallResponse,
} from '@clevertap/clevertap-signed-call-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { requestPermissions } from '../Helpers';
import VIForegroundService from '@voximplant/react-native-foreground-service';

type DialerScreenProps = {
  getCuid:()=>string,
  navigateToRegistration: ()=>void
}
const DialerScreen = (dialerScreenProps:DialerScreenProps) => {

  const [initiatorCuid,setInitiatorCuid] = React.useState('');
  const [receiverCuid, setReceiverCuid] = React.useState('');
  const [callContext, setCallContext] = React.useState('');
  const [remoteCallContext, setRemoteCallContext] = React.useState(null);

  const [isForegroundServiceRunning, setForegroundServiceRunning] =
    React.useState(false);

  React.useEffect(() => {
    // deactivateHandlers gets called on component unmount
    console.log("TEST CUID",dialerScreenProps.getCuid())
    setInitiatorCuid(dialerScreenProps.getCuid())
    return () => {
      deactivateHandlers();
    };
  }, []);

  function deactivateHandlers() {
    //cleanup to remove event listeners
    SignedCall.removeListener(SignedCall.SignedCallOnCallStatusChanged);
    if (Platform.OS === 'android') {
      SignedCall.removeListener(SignedCall.SignedCallOnMissedCallActionClicked);
    }
  }

  function initiateVoIPCall() {
    let callProperties: { [k: string]: any } = {};

    if (remoteCallContext) {
      callProperties.remote_context = remoteCallContext;
    }

    SignedCall.call(receiverCuid, callContext, callProperties)
      .then((response: SignedCallResponse) => {
        if (response.isSuccessful) {
          console.log('VoIP call is placed successfully', response);
        } else {
          console.log('VoIP call is failed: ', response.error);
          Alert.alert('VoIP call is failed!', response.error?.errorMessage);
        }
      })
      .catch((e: any) => {
        console.error(e);
      });
  }

  function logoutSession() {
    SignedCall.logout();
    AsyncStorage.clear();
    //navigates to the Registration Screen
   dialerScreenProps.navigateToRegistration()
  }

  function startForegroundService() {
    const notificationConfig = {
      channelId: 'channelId',
      id: 3456,
      title: 'Title',
      text: 'Some text',
      icon: 'ic_icon',
      button: 'Some text',
    };
    try {
      VIForegroundService.startService(notificationConfig)
        .then(() => console.log('Service started'))
        .catch((err: any) => console.error(err));
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.mainHeader}>CUID: {initiatorCuid}</Text>
      <View style={{ height: 20 }} />

      <View style={styles.mainSection}>
        <Text>Enter receiver's cuid</Text>
        <TextInput
          style={styles.inputStyle}
          autoCapitalize="none"
          autoCorrect={false}
          value={receiverCuid}
          onChangeText={(text) => {
            setReceiverCuid(text);
          }}
        />
        <View style={{ height: 10 }} />
        <Text>Enter context of call</Text>
        <TextInput
          style={styles.inputStyle}
          autoCapitalize="none"
          autoCorrect={false}
          value={callContext}
          onChangeText={(text) => {
            setCallContext(text);
          }}
        />
        <View style={{ height: 10 }} />
        <Text>Enter remote context of call</Text>
        <TextInput
          style={styles.inputStyle}
          autoCapitalize="none"
          autoCorrect={false}
          value={remoteCallContext}
          onChangeText={(text) => {
            setRemoteCallContext(text);
          }}
        />
        {Platform.OS === 'android' && (
          <View style={styles.horizontalAlignment}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 12,
                fontWeight: 'bold',
                color: isForegroundServiceRunning ? '#249c50' : '#000000',
              }}
            >
              {isForegroundServiceRunning
                ? 'Stop self-managed FG service'
                : 'Start self-managed FG service'}
            </Text>
            <Switch
              trackColor={{ false: '#767577', true: '#008000' }}
              thumbColor={isForegroundServiceRunning ? '#f4f3f4' : '#FFFFFF'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={async (canStart) => {
                if (canStart) {
                  startForegroundService();
                } else {
                  VIForegroundService.stopService()
                    .then(() => console.log('Service stopped'))
                    .catch((err: any) => console.error(err));
                }
                setForegroundServiceRunning(canStart);
              }}
              value={isForegroundServiceRunning}
            />
          </View>
        )}

        <View style={styles.buttonContainer}>
          <Button
            title="Initiate VoIP Call"
            color="red"
            onPress={() => {
              Keyboard.dismiss();
              requestPermissions(() => {
                //permissions are granted
                initiateVoIPCall();
              });
            }}
            disabled={receiverCuid.length === 0 || callContext.length === 0}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="Disconnect Signalling Socket"
            color="blue"
            onPress={() => SignedCall.disconnectSignallingSocket()}
          />
        </View>
        {Platform.OS === 'android' && (
          <View style={styles.buttonContainer}>
            <Button
              title="Get Back to Call"
              color="green"
              onPress={async () => {
                const result = await SignedCall.getBackToCall();
                if (!result) {
                  console.log(
                    'VoIP call is failed: ',
                    'Invalid operation to get back to call'
                  );
                  Alert.alert(
                    'No active call!',
                    'Invalid operation to get back to call'
                  );
                }
              }}
            />
          </View>
        )}
        <View style={styles.buttonContainer}>
          <Button title="Logout" color="red" onPress={() => logoutSession()} />
        </View>
      </View>
    </View>
  );
};

export default DialerScreen;
