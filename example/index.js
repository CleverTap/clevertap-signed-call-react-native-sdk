import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import {
  SignedCall,
  CallDirection,
} from '@clevertap/clevertap-signed-call-react-native';
import Toast from 'react-native-simple-toast';
import { Platform } from 'react-native';

const activateHandlers = () => {
  //To keep track on changes in the VoIP call's state
  SignedCall.addListener(
    SignedCall.SignedCallOnCallStatusChanged,
    (result: CallEventResult) => {
      Toast.show(result.callEvent + ' is called!', Toast.SHORT);
      console.log('SignedCallOnCallStatusChanged', result);

      if (result.direction === CallDirection.Incoming) {
        console.log('Call direction is Incoming!');
      } else if (result.direction === CallDirection.Outgoing) {
        console.log('Call direction is Outgoing!');
      }
    }
  );

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
