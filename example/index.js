import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import {
  CallDirection,
  CallStatus,
  SignedCall,
  CallType,
} from '@clevertap/clevertap-signed-call-react-native';
import Toast from 'react-native-simple-toast';
import { Platform } from 'react-native';

const activateHandlers = () => {
  //To keep track on changes in the VoIP call's state
  SignedCall.addListener(SignedCall.SignedCallOnCallStatusChanged, (result) => {
    console.log('SignedCallOnCallStatusChanged', result);

    if (result.direction === CallDirection.Incoming) {
      console.log('Call direction is Incoming!');
    } else if (result.direction === CallDirection.Outgoing) {
      console.log('Call direction is Outgoing!');
    }

    if (result.callType === CallType.M2P) {
      if (result.callStatus === CallStatus.DTMFInputReceived) {
        const dtmfInput = result.callOptions.getDtmfInput();
        if (dtmfInput) {
          Toast.show(`${dtmfInput.inputKey} is pressed!`, Toast.SHORT);
        }
      } else if (result.callStatus === CallStatus.CallOver) {
        const dtmfInputList = result.callOptions.dtmfInputList;
        if (dtmfInputList) {
          Toast.show(
            `Size of DTMF inputs list: ${dtmfInputList.length}`,
            Toast.SHORT
          );
        }
      }
      Toast.show(
        `${result.callStatus}, ${result.callOptions.campaignId}`,
        Toast.SHORT
      );
    }

    switch (result.callStatus) {
      case CallStatus.CallIsPlaced:
        // Indicates that the call is successfully placed
        break;

      case CallStatus.Cancelled:
        // Indicates that the call is cancelled from the initiator's end
        break;

      case CallStatus.Declined:
        // Indicates that the call is declined from the receiver's end
        break;

      case CallStatus.Missed:
        // Indicates that the call is missed at the receiver's end
        break;

      case CallStatus.Answered:
        // Indicates that the call is picked up by the receiver
        break;

      case CallStatus.CallInProgress:
        // Indicates that the connection to the receiver is established, and the audio transfer begins at this state
        break;

      case CallStatus.CallOver:
        // Indicates that the call is over
        break;

      case CallStatus.CalleeBusyOnAnotherCall:
        // Indicates that the receiver is already busy on another call
        break;

      case CallStatus.DeclinedDueToLoggedOutCuid:
        // Indicates that the call is declined due to the receiver being logged out with the specific CUID
        break;

      case CallStatus.DeclinedDueToNotificationsDisabled:
        // [Specific to Android-Platform]
        // Indicates that the call is declined due to notifications being disabled at the receiver's end
        break;

      case CallStatus.DeclinedDueToMicrophonePermissionsNotGranted:
        // Indicates that the microphone permission is not granted for the call
        break;

      case CallStatus.CallCancelledDueToTtlExpired:
        // Indicates that the campaign call is cancelled due to TTL being expired
        break;

      case CallStatus.CallCancelledDueToRingTimeout:
        // Indicates that the call is cancelled due to ring-timeout at initiator's end
        break;

      case CallStatus.CallCancelledDueToCampaignNotificationCancelled:
        // Indicates that the M2P call is cancelled by clicking on cancel CTA from campaign's notification
        break;

      case CallStatus.DTMFInputReceived:
        // Indicates that a DTMF input is received from M2P keypad screen
        break;

      default:
        // Handle any unexpected or unhandled statuses
        break;
    }
  });

  if (Platform.OS === 'android') {
    //To keep track on click over missed call notification
    SignedCall.addListener(
      SignedCall.SignedCallOnMissedCallActionClicked,
      (result) => {
        Toast.show(result.action.actionLabel + ' is clicked!', Toast.SHORT);

        console.log('SignedCallOnMissedCallActionClicked', result);
      }
    );
  }
};

activateHandlers();

AppRegistry.registerComponent(appName, () => App);
