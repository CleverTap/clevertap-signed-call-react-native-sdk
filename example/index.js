import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import {
  CallDirection,
  CallEvent,
  SCCallState,
  SignedCall,
} from '@clevertap/clevertap-signed-call-react-native';
import Toast from 'react-native-simple-toast';
import { Platform } from 'react-native';

const activateHandlers = () => {
  //To keep track on changes in the VoIP call's state
  SignedCall.addListener(SignedCall.SignedCallOnCallStatusChanged, (result) => {
    console.log('SignedCallOnCallStatusChanged', result);

    SignedCall.getCallState()
      .then((response) => {
        console.log('CallState is: ' + response);
      })
      .catch((e) => {
        console.error(e);
      });

    if (result.direction === CallDirection.Incoming) {
      console.log('Call direction is Incoming!');
    } else if (result.direction === CallDirection.Outgoing) {
      console.log('Call direction is Outgoing!');
    }

    if (result.callEvent === CallEvent.CallIsPlaced) {
      // Indicates that the call is successfully placed
    } else if (result.callEvent === CallEvent.Cancelled) {
      // Indicates that the call is cancelled from the initiator's end
    } else if (result.callEvent === CallEvent.Declined) {
      // Indicates that the call is declined from the receiver's end
    } else if (result.callEvent === CallEvent.Missed) {
      // Indicates that the call is missed at the receiver's end
    } else if (result.callEvent === CallEvent.Answered) {
      // Indicates that the call is picked up by the receiver
    } else if (result.callEvent === CallEvent.CallInProgress) {
      // Indicates that the connection to the receiver is established, and the audio transfer begins at this stateaa
    } else if (result.callEvent === CallEvent.Ended) {
      // Indicates that the call has been ended
    } else if (result.callEvent === CallEvent.ReceiverBusyOnAnotherCall) {
      // Indicates that the receiver is already busy on another call
    } else if (result.callEvent === CallEvent.DeclinedDueToLoggedOutCuid) {
      // Indicates that the call is declined due to the receiver being logged out with the specific CUID
    } else if (
      result.callEvent === CallEvent.DeclinedDueToNotificationsDisabled
    ) {
      // [Specific to Android-Platform]
      // Indicates that the call is declined due to notifications being disabled at the receiver's end
    } else if (
      result.callEvent ===
      CallEvent.DeclinedDueToMicrophonePermissionsNotGranted
    ) {
      // Indicates that the microphone permission is not granted for the call
    }
  });

  if (Platform.OS === 'android') {
    //To keep track on click over missed call notification
    SignedCall.addListener(
      SignedCall.SignedCallOnMissedCallActionClicked,
      (result: MissedCallActionClickResult) => {
        Toast.show(result.action.actionLabel + ' is clicked!', Toast.SHORT);

        console.log('SignedCallOnMissedCallActionClicked', result);
      }
    );
  }
};

activateHandlers();

AppRegistry.registerComponent(appName, () => App);
