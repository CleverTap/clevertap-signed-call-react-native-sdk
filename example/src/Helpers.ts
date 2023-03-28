import { Alert, PermissionsAndroid, Platform } from 'react-native';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

export type Callback = () => void;

export async function requestPermissions(callback: Callback) {
  if (Platform.OS === 'ios') {
    const microphoneGranted = await request(PERMISSIONS.IOS.MICROPHONE);

    if (microphoneGranted === RESULTS.GRANTED) {
      console.log('Microphone permission granted');
      callback();
    } else {
      console.log('Microphone permission not granted');
      Alert.alert('Microphone permission is required to initiate a VoIP call!');
    }
  }
  if (Platform.OS === 'android') {
    try {
      const microphoneGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO!!,
        {
          title: 'Microphone Permission',
          message: 'App needs access to your microphone',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE!!,
        {
          title: 'Read Phone State Permission',
          message: 'App needs access to your phone state',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      if (microphoneGranted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Microphone permission granted');
        callback();
      } else if (microphoneGranted === PermissionsAndroid.RESULTS.DENIED) {
        console.log('Microphone permission not granted');
        Alert.alert(
          'Microphone permission is required to initiate a VoIP call!'
        );
      }
    } catch (err) {
      console.warn(err);
    }
  }
}
