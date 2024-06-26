/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  Alert,
  Keyboard,
  Platform,
  Switch,
} from 'react-native';
import { useState } from 'react';
import styles from '../styles/style';
import {
  SCSwipeOffBehaviour,
  SCSwipeOffBehaviourUtil,
  SignedCall,
  SignedCallResponse,
} from '@clevertap/clevertap-signed-call-react-native';
import CleverTap from 'clevertap-react-native';
import { Constants } from '../Constants';
import Loader from '../components/Loader';
import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isDeviceVersionTargetsBelow } from '../Helpers';

export default function RegistrationPage({ navigation }: any) {
  const [cuid, setCuid] = useState('');
  const [loading, setLoading] = useState(false);

  const [canHidePoweredBySignedCall, setHidePoweredBySignedCall] =
    useState(false);
  const [notificationPermissionRequired, setNotificationPermissionRequired] =
    useState(true);
  const [swipeOffBehaviour, setSwipeOffBehaviour] = useState(
    SCSwipeOffBehaviour.EndCall
  );

  const checkLoggedInState = async () => {
    try {
      const loggedInCuid = await AsyncStorage.getItem(
        Constants.KEY_LOGGED_IN_CUID
      );
      const storedPoweredBySignedCallPref = await AsyncStorage.getItem(
        Constants.KEY_CAN_HIDE_POWERED_BY_SIGNED_CALL
      );
      const storedNotificationPermissionPref = await AsyncStorage.getItem(
        Constants.KEY_NOTIFICATION_PERMISSION_REQUIRED
      );
      const storedSwipeOffBehaviourPref = await AsyncStorage.getItem(
        Constants.KEY_SWIPE_OFF_BEHAVIOUR
      );

      if (loggedInCuid !== null) {
        setCuid(loggedInCuid);
      }

      if (storedPoweredBySignedCallPref !== null) {
        setHidePoweredBySignedCall(storedPoweredBySignedCallPref === 'true');
      }

      if (storedNotificationPermissionPref !== null) {
        setNotificationPermissionRequired(
          storedNotificationPermissionPref === 'true'
        );
      }

      if (storedSwipeOffBehaviourPref !== null) {
        setSwipeOffBehaviour(
          SCSwipeOffBehaviourUtil.fromString(storedSwipeOffBehaviourPref)
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    activateHandlers();
    checkLoggedInState();

    // below return function gets called on component unmount
    return () => {
      deactivateHandlers();
    };
  });

  const initSignedCallSdk = () => {
    if (
      Constants.SC_ACCOUNT_ID === 'YOUR_ACCOUNT_ID' ||
      Constants.SC_API_KEY === 'YOUR_API_KEY'
    ) {
      Alert.alert(
        'Setup Required for SC SDK initialization!',
        'Replace the AccountId and ApiKey of your Signed Call Account in the example/src/Constants'
      );
      return;
    }

    //For android 13 and onwards, show loading once the notification permission result is received
    //in CleverTap.CleverTapPushPermissionResponseReceived handler
    const shouldShowLoader =
      isDeviceVersionTargetsBelow(33) ||
      Platform.OS === 'ios' ||
      !notificationPermissionRequired;
    if (shouldShowLoader) {
      setLoading(true);
    }

    SignedCall.initialize(getInitProperties())
      .then((response: SignedCallResponse) => {
        if (response.isSuccessful) {
          console.log('Signed Call SDK initialized: ', response);

          AsyncStorage.setItem(Constants.KEY_LOGGED_IN_CUID, cuid);
          AsyncStorage.setItem(
            Constants.KEY_CAN_HIDE_POWERED_BY_SIGNED_CALL,
            cuid
          );
          AsyncStorage.setItem(
            Constants.KEY_CAN_HIDE_POWERED_BY_SIGNED_CALL,
            canHidePoweredBySignedCall.toString()
          );
          AsyncStorage.setItem(
            Constants.KEY_NOTIFICATION_PERMISSION_REQUIRED,
            notificationPermissionRequired.toString()
          );
          AsyncStorage.setItem(
            Constants.KEY_SWIPE_OFF_BEHAVIOUR,
            swipeOffBehaviour.toString()
          );
          //navigates to the Dialer Screen with registered cuid
          navigation.replace('Dialer', { registeredCuid: cuid });
        } else {
          console.log('Signed Call initialization failed: ', response.error);
          Alert.alert(
            'Signed Call initialization failed!',
            response.error?.errorMessage
          );
        }
      })
      .catch((e: any) => {
        console.error(e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  function activateHandlers() {
    CleverTap.addListener(
      CleverTap.CleverTapPushPermissionResponseReceived,
      (result: boolean) => {
        console.log('Push Permission response is received --->', result);
        if (result) {
          setLoading(true);
        } else {
          CleverTap.promptPushPrimer(getPushPrimerJson);
        }
      }
    );
  }

  function deactivateHandlers() {
    CleverTap.removeListener(CleverTap.CleverTapPushPermissionResponseReceived);
  }

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.mainHeader}>CUID Registration</Text>
      <Image
        style={styles.image}
        source={require('../../assets/clevertap-logo.png')}
      />
      <View style={styles.mainSection}>
        <Text>Enter CUID</Text>
        <TextInput
          style={styles.inputStyle}
          autoCapitalize="none"
          autoCorrect={false}
          value={cuid}
          onChangeText={(text) => {
            setCuid(text);
          }}
        />
        <View style={styles.horizontalAlignment}>
          <Text style={{ textAlign: 'center', fontSize: 12 }}>
            Hide Powered By Signed Call
          </Text>
          <Switch
            trackColor={{ false: '#767577', true: '#008000' }}
            thumbColor={canHidePoweredBySignedCall ? '#f4f3f4' : '#FFFFFF'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={(canHide) => setHidePoweredBySignedCall(canHide)}
            value={canHidePoweredBySignedCall}
          />
        </View>

        <View style={styles.horizontalAlignment}>
          <Text style={{ textAlign: 'center', fontSize: 12 }}>
            Required Notification Permission
          </Text>
          <Switch
            trackColor={{ false: '#767577', true: '#008000' }}
            thumbColor={canHidePoweredBySignedCall ? '#f4f3f4' : '#FFFFFF'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={(required) =>
              setNotificationPermissionRequired(required)
            }
            value={notificationPermissionRequired}
          />
        </View>

        <View style={styles.horizontalAlignment}>
          <Text style={{ textAlign: 'center', fontSize: 12 }}>
            Persist Call on Swipe Off in self-managed FG Service?
          </Text>
          <Switch
            trackColor={{ false: '#767577', true: '#008000' }}
            thumbColor={canHidePoweredBySignedCall ? '#f4f3f4' : '#FFFFFF'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={(required) =>
              setSwipeOffBehaviour(
                required
                  ? SCSwipeOffBehaviour.PersistCall
                  : SCSwipeOffBehaviour.EndCall
              )
            }
            value={
              swipeOffBehaviour === SCSwipeOffBehaviour.PersistCall
                ? true
                : false
            }
          />
        </View>
        {loading && <Loader />}
        <View style={styles.buttonContainer}>
          <Button
            title="Register and Continue"
            color="red"
            onPress={() => {
              Keyboard.dismiss();
              initSignedCallSdk();
            }}
            disabled={cuid.length === 0}
          />
        </View>
      </View>
    </View>
  );

  function getInitProperties(): any {
    let callScreenBranding = {
      bgColor: '#000000',
      fontColor: '#ffffff', ///The color of the text displayed on the call screens
      logoUrl:
        'https://sk1-dashboard-staging-21.dashboard.clevertap.com/images/ct-favicon.png', ///The image URL that renders on the call screens.
      buttonTheme: 'light', ///The theme of the control buttons shown on the ongoing call screen(i.e. Mute, Speaker and Bluetooth)
      showPoweredBySignedCall: !canHidePoweredBySignedCall, //optional
    };

    let initProperties: { [k: string]: any } = {
      accountId: Constants.SC_ACCOUNT_ID,
      apiKey: Constants.SC_API_KEY,
      cuid: cuid,
      overrideDefaultBranding: callScreenBranding,
    };

    if (Platform.OS === 'android') {
      initProperties.allowPersistSocketConnection = true;
      initProperties.promptPushPrimer = getPushPrimerJson();
      initProperties.promptReceiverReadPhoneStatePermission = true;
      initProperties.missedCallActions = {
        '123': 'call me back',
      };
      initProperties.notificationPermissionRequired =
        notificationPermissionRequired;

      initProperties.swipeOffBehaviourInForegroundService = swipeOffBehaviour;
    }

    if (Platform.OS === 'ios') {
      initProperties.production = true;
    }
    return initProperties;
  }

  function getPushPrimerJson(): any {
    return {
      inAppType: 'alert',
      titleText: 'Get Notified',
      messageText: 'Enable Notification permission',
      followDeviceOrientation: true,
      positiveBtnText: 'Allow',
      negativeBtnText: 'Cancel',
      fallbackToSettings: true,
    };
  }
}
