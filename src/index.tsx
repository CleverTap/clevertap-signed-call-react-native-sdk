import { NativeEventEmitter, NativeModules, Platform } from 'react-native';
import { CallEvent } from './models/CallEvents';
import type { LogLevel } from './models/LogLevel';
import { MissedCallActionClickResult } from './models/MissedCallAction';
import { SignedCallResponse } from './models/SignedCallResponse';
import { SignedCallLogger } from './utils/SignedCallLogger';

const LINKING_ERROR =
  `The package 'clevertap-signed-call-react-native' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const eventEmitter = new NativeEventEmitter(NativeModules.CleverTapSignedCall);

const CleverTapSignedCall = NativeModules.CleverTapSignedCall
  ? NativeModules.CleverTapSignedCall
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export function setDebugLevel(logLevel: LogLevel) {
  SignedCallLogger.setLogLevel(logLevel);
  CleverTapSignedCall.setDebugLevel(logLevel);
}

export function init(initProperties: object): Promise<SignedCallResponse> {
  return CleverTapSignedCall.init(initProperties).then((result: any) => {
    return SignedCallResponse.fromDict(result);
  });
}

export function call(
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
}

export function logout() {
  CleverTapSignedCall.logout();
}

export function hangupCall() {
  CleverTapSignedCall.hangupCall();
}

export function addListener(eventName: string, handler: any): void {
  //Removes the active listeners of the given event to avoid duplicate listeners
  removeListener(eventName);

  if (eventEmitter) {
    SignedCallLogger.debug({ message: 'this is msg1' });
    SignedCallLogger.debug({ message: 'this is msg2', tag: 'tag1' });

    eventEmitter.addListener(eventName, (response: any) => {
      switch (eventName) {
        case SignedCallOnCallStatusChanged:
          handler(CallEvent.fromString(response));
          break;
        case SignedCallOnMissedCallActionClicked:
          handler(MissedCallActionClickResult.fromDict(response));
          break;
      }
    });
  }
}

export function removeListener(eventName: string): void {
  if (eventEmitter) {
    eventEmitter.removeAllListeners(eventName);
  }
}

export const SignedCallOnCallStatusChanged: string =
  CleverTapSignedCall.SignedCallOnCallStatusChanged;

export const SignedCallOnMissedCallActionClicked: string =
  CleverTapSignedCall.SignedCallOnMissedCallActionClicked;
