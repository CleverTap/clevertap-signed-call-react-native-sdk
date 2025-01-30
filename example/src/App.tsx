import {
  LogLevel,
  SignedCall,
} from '@clevertap/clevertap-signed-call-react-native';
import * as React from 'react';
import RegistrationPage from './screens/RegistrationScreen';
import DialerScreen from './screens/DialerScreen';

export default function App() {
  const [activeScreen,setActiveScreen] = React.useState("Registration")
  const cuidRef = React.useRef('')
  React.useEffect(() => {
    //enables Verbose mode logging for Signed Call SDK
    SignedCall.setDebugLevel(LogLevel.Verbose);
  }, []);

  return activeScreen == "Registration" ? <RegistrationPage navigateToDialer={
  (cuid:string) => {
    setActiveScreen("Dialer")
    cuidRef.current = cuid
  }
  }/> : <DialerScreen getCuid={()=>cuidRef.current} navigateToRegistration={ ()=>{setActiveScreen("Registration")}}/>
}
