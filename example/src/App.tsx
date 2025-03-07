import {
  LogLevel,
  SignedCall,
  SignedCallResponse,
} from '@clevertap/clevertap-signed-call-react-native';
import * as React from 'react';
import RegistrationPage from './screens/RegistrationScreen';
import DialerScreen from './screens/DialerScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Constants } from './Constants';
import { Alert } from 'react-native';
export default function App() {
  const [activeScreen,setActiveScreen] = React.useState("Registration")
  const cuidRef = React.useRef('')
  React.useEffect(() => {
    //enables Verbose mode logging for Signed Call SDK
    SignedCall.setDebugLevel(LogLevel.Verbose);
    AsyncStorage.getItem(Constants.KEY_SC_DETAILS).then((details)=>{
      if(details == null) {
        return
      }
      const scDetails = JSON.parse(details)
      if(scDetails) {
        SignedCall.initialize(scDetails).then((response: SignedCallResponse)=> {
          if(response.isSuccessful) {
            cuidRef.current = scDetails.cuid;
            setActiveScreen("Dialer")
          } else {
            console.log('Signed Call initialization failed: ', response.error);
            Alert.alert(
              'Signed Call initialization failed!',
              response.error?.errorMessage
            );
          }
        }).catch((e: any) => {
          console.error(e);
        })
      }
    })
  }, []);

  return activeScreen == "Registration" ? <RegistrationPage navigateToDialer={
  (cuid:string) => {
    setActiveScreen("Dialer")
    cuidRef.current = cuid
  }
  }/> : <DialerScreen getCuid={()=>cuidRef.current} navigateToRegistration={ ()=>{setActiveScreen("Registration")}}/>
}
