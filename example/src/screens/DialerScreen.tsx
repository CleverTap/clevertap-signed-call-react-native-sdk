import {
  View,
  Text,
  Image,
  TextInput,
  Button,
  BackHandler,
  Alert,
  Keyboard,
  Platform,
} from 'react-native';
import React from 'react';
import styles from '../styles/style';
import {
  SignedCall,
  SignedCallResponse,
} from '@clevertap/clevertap-signed-call-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { requestPermissions } from '../Helpers';

const DialerScreen = ({ route, navigation }: any) => {
  const { registeredCuid } = route.params;

  const [receiverCuid, setReceiverCuid] = React.useState('');
  const [callContext, setCallContext] = React.useState('');

  React.useEffect(() => {
    //Disables the back button click handling
    BackHandler.addEventListener('hardwareBackPress', () => true);

    // deactivateHandlers gets called on component unmount
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
          <Button
            title="Disconnect Signalling Socket"
            color="blue"
            onPress={() => SignedCall.disconnectSignallingSocket()}
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
