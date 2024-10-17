'use strict';

import { NativeEventEmitter, NativeModules } from 'react-native';
import { LogLevel } from './models/LogLevel';
import { MissedCallActionClickResult } from './models/MissedCallAction';
import { SignedCallResponse } from './models/SignedCallResponse';
import { SignedCallLogger } from './utils/SignedCallLogger';
import { Constants } from './Constants';
import { CallDirection, CallStatusDetails } from './models/CallStatusDetails';
import { CallType } from './models/CallType';
import { CallStatus } from './models/CallStatus';
import { M2PCallOptions } from './models/CallOptions';

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

/**
 * Passes the CleverTap Signed Call React Native SDK name and the current version for version tracking
 * @param {string} sdkName - SDK name's literal
 * @param {number} sdkVersion - The updated SDK version. /// If the current version is X.X.X then pass as X0X0X
 */
const sdkName = 'ctscsdkversion-react-native';
const sdkVersion = 5;
CleverTapSignedCall.trackSdkVersion(sdkName, sdkVersion);

class SignedCall {
  static SignedCallOnCallStatusChanged =
    CleverTapSignedCall.SignedCallOnCallStatusChanged;
  static SignedCallOnMissedCallActionClicked =
    CleverTapSignedCall.SignedCallOnMissedCallActionClicked;

  static SignedCallOnM2PNotificationClicked =
    CleverTapSignedCall.SignedCallOnM2PNotificationClicked;

  static SignedCallOnM2PNotificationCancelCtaClicked =
    CleverTapSignedCall.SignedCallOnM2PNotificationCancelCtaClicked;

  /**
   * Enables or disables debugging. If enabled, see debug messages in LogCat utility.
   *
   * @param {LogLevel} logLevel  an enum value from LogLevel class
   */
  static setDebugLevel(logLevel: LogLevel) {
    SignedCallLogger.setLogLevel(logLevel);
    CleverTapSignedCall.setDebugLevel(logLevel);
  }

  /**
   * Initializes the Signed Call SDK in your app's Javascript or Typescript code.
   * @param {object} initProperties - configuration object for the initialization.
   */
  static initialize(initProperties: object): Promise<SignedCallResponse> {
    return CleverTapSignedCall.initialize(initProperties).then(
      (result: any) => {
        return SignedCallResponse.fromDict(result);
      }
    );
  }

  /**
   * Initiates a VoIP call
   * @param {string} receiverCuid - cuid of the person whomsoever call needs to be initiated
   * @param {string} callContext - context(reason) of the call that is displayed on the call screen
   * @param {string} callProperties - configuration(metadata) for a VoIP call
   */
  static call(
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

  /**
   * Logs out the user by invalidating the active Signed Call session
   */
  static logout() {
    CleverTapSignedCall.logout();
  }

  /**
   * Ends the active call, if any.
   */
  static hangupCall() {
    CleverTapSignedCall.hangupCall();
  }

  /**
   * Disconnects the signalling socket.
   *
   * Call this method when all the expected/pending transactions are over
   * and there is no use case of initiating or receiving the VoIP call.
   *
   * Following is the expected behavior:
   * - Calls can not be initiated without the signalling socket connection and
   *   Signed Call returns an exception when call-request is attempted.
   * - Call still be received as Signed Call uses FCM for android platform
   *   and APNs for iOS platform as a Fallback channel.
   *
   * Once this method is called, SDK re-initialization is required to undo its behavior.
   */
  static disconnectSignallingSocket() {
    CleverTapSignedCall.disconnectSignallingSocket();
  }

  /**
   * Adds the event handler to the event name
   * @param {string} eventName - name of the event
   * @param {any} handler - callback handler
   * @returns void
   */
  static addListener(eventName: string, handler: any): void {
    //First, remove the active listeners of the given event to avoid duplicate listeners
    SignedCall.removeListener(eventName);

    //Register another handler to the passed event in order to manipulate the event-payload
    eventEmitter.addListener(eventName, (response: any) => {
      switch (eventName) {
        case SignedCall.SignedCallOnCallStatusChanged:
          handler(CallStatusDetails.fromDict(response));
          break;
        case SignedCall.SignedCallOnMissedCallActionClicked:
          handler(MissedCallActionClickResult.fromDict(response));
          break;
        case SignedCall.SignedCallOnM2PNotificationClicked:
          handler(M2PCallOptions.fromDict(response));
          break;
        case SignedCall.SignedCallOnM2PNotificationCancelCtaClicked:
          handler(M2PCallOptions.fromDict(response));
          break;
      }
    });
  }

  /**
   * Removes the event handler(s) for the event name
   * @param  {string} eventName - name of the event
   * @returns void
   */
  static removeListener(eventName: string): void {
    eventEmitter.removeAllListeners(eventName);
  }
}

export {
  SignedCall,
  SignedCallResponse,
  LogLevel,
  CallStatus,
  CallStatusDetails,
  CallType,
  CallDirection,
  MissedCallActionClickResult,
};
