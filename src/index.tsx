import { NativeEventEmitter, NativeModules } from 'react-native';
import { CallEvent } from './models/CallEvents';
import type { LogLevel } from './models/LogLevel';
import { MissedCallActionClickResult } from './models/MissedCallAction';
import { SignedCallResponse } from './models/SignedCallResponse';
import { SignedCallLogger } from './utils/SignedCallLogger';
import { Constants } from './Constants';

const CleverTapSignedCall = NativeModules.CleverTapSignedCall
  ? NativeModules.CleverTapSignedCall
  : new Proxy(
      {},
      {
        get() {
          throw new Error(Constants.LINKING_ERROR);
        },
      }
    );

const eventEmitter = new NativeEventEmitter(CleverTapSignedCall);

const SignedCall = {
  SignedCallOnCallStatusChanged:
    CleverTapSignedCall.SignedCallOnCallStatusChanged,
  SignedCallOnMissedCallActionClicked:
    CleverTapSignedCall.SignedCallOnMissedCallActionClicked,

  setDebugLevel(logLevel: LogLevel) {
    SignedCallLogger.setLogLevel(logLevel);
    CleverTapSignedCall.setDebugLevel(logLevel);
  },

  init(initProperties: object): Promise<SignedCallResponse> {
    return CleverTapSignedCall.init(initProperties).then((result: any) => {
      return SignedCallResponse.fromDict(result);
    });
  },

  call(
    receiverCuid: string,
    callContext: string,
    callProperties?: object | undefined
  ): Promise<SignedCallResponse> {
    return CleverTapSignedCall.call(
      receiverCuid,
      callContext,
      callProperties
    ).then((result: any) => {
      return SignedCallResponse.fromDict(result);
    });
  },

  logout() {
    CleverTapSignedCall.logout();
  },

  hangupCall() {
    CleverTapSignedCall.hangupCall();
  },

  addListener(eventName: string, handler: any): void {
    //Removes the active listeners of the given event to avoid duplicate listeners
    SignedCall.removeListener(eventName);

    if (eventEmitter) {
      eventEmitter.addListener(eventName, (response: any) => {
        switch (eventName) {
          case SignedCall.SignedCallOnCallStatusChanged:
            handler(CallEvent.fromString(response));
            break;
          case SignedCall.SignedCallOnMissedCallActionClicked:
            handler(MissedCallActionClickResult.fromDict(response));
            break;
        }
      });
    }
  },

  removeListener(eventName: string): void {
    if (eventEmitter) {
      eventEmitter.removeAllListeners(eventName);
    }
  },
};

export default SignedCall;
