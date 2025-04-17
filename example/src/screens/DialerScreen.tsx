import {
  View,
  Text,
  Image,
  Button,
  BackHandler,
  Platform,
} from 'react-native';
import React from 'react';
import styles from '../styles/style';
import {
  SignedCall,
} from '@clevertap/clevertap-signed-call-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DialerScreen = ({ route, navigation }: any) => {
  const { registeredCuid, registeredSegment } = route.params;

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

  function logoutSession() {
    SignedCall.logout();
    AsyncStorage.clear();
    //navigates to the Registration Screen
    navigation.replace('Registration', {});
  }

  return (
    <View style={[styles.mainContainer,{justifyContent: 'center', //Centered vertically
      alignItems: 'center', //Centered horizontally
      flex:1}]}>
      <Text style={styles.mainHeader}>CUID: {registeredCuid}</Text>
      <Text style={styles.mainHeader}>Segment: {registeredSegment}</Text>
      <Image
        style={styles.image}
        source={require('../../assets/clevertap-logo.png')}
      />
      <Text>You've been registered to receive M2P campaigns!</Text>
      <Text>Please wait for a campaign to be delivered.</Text>
      <View style={[styles.buttonContainer, {width:"80%"}]}>
          <Button title="Logout" color="red" onPress={() => logoutSession()} />
        </View>
    </View>
  );
};

export default DialerScreen;
