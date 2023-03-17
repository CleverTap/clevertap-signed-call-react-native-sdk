import {
  View,
  Text,
  Image,
  TextInput,
  Button,
  BackHandler,
  Alert,
  Keyboard,
} from 'react-native';
import React from 'react';
import styles from '../styles/style';
import {
  SignedCall,
  CallEvent,
  SignedCallResponse,
} from 'clevertap-signed-call-react-native';
import type { MissedCallActionClickResult } from 'src/models/MissedCallAction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { requestPermissions } from '../Helpers';

const DialerScreen = ({ route, navigation }: any) => {
  const { registeredCuid } = route.params;

  const [receiverCuid, setReceiverCuid] = React.useState('');
  const [callContext, setCallContext] = React.useState('');

  React.useEffect(() => {
    //Disables the back button click handling
    BackHandler.addEventListener('hardwareBackPress', () => true);

    //To keep track on changes in the VoIP call's state
    SignedCall.addListener(
      SignedCall.SignedCallOnCallStatusChanged,
      (event: CallEvent) => {
        console.log('SignedCallOnCallStatusChanged', event);
      }
    );

    //To keep track on click over missed call notification
    SignedCall.addListener(
      SignedCall.SignedCallOnMissedCallActionClicked,
      (event: MissedCallActionClickResult) => {
        console.log('SignedCallOnMissedCallActionClicked', event);
        Alert.alert(
          'Missed Call Notification!',
          event.action.actionLabel + ' is clicked'
        );
      }
    );

    // below return function gets called on component unmount
    return () => {
      //cleanup to remove event listeners
      SignedCall.removeListener(SignedCall.SignedCallOnCallStatusChanged);
      SignedCall.removeListener(SignedCall.SignedCallOnMissedCallActionClicked);
    };
  }, []);

  function initiateVoIPCall() {
    /*let callProperties = {
      initiator_image: '<image-url>',
      receiver_image: '<image-url>',
    };*/

    SignedCall.call(receiverCuid, callContext)
      .then((response: SignedCallResponse) => {
        if (response.isSuccessful) {
          console.log('VoIP call is placed successfully', response);
        } else {
          console.log('VoIP call is failed: ', response.error);
          Alert.alert('VoIP call is failed!', response.error?.errorDescription);
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
    navigation.replace('Registration', {});
  }

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.mainHeader}>CUID: {registeredCuid}</Text>
      <Image
        style={styles.image}
        source={require('../../assets/clevertap-logo.png')}
      />

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
        <View style={{ height: 30 }} />
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
          <Button title="Logout" color="red" onPress={() => logoutSession()} />
        </View>
      </View>
    </View>
  );
};

export default DialerScreen;
