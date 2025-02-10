'use strict';

import { NativeEventEmitter, Platform } from 'react-native';
import { LogLevel } from './models/LogLevel';
import { MissedCallActionClickResult } from './models/MissedCallAction';
import { SignedCallResponse } from './models/SignedCallResponse';
import { SignedCallLogger } from './utils/SignedCallLogger';
import { CallDirection, CallEventResult } from './models/CallEventResult';
import { CallEvent } from './models/CallEvent';
import { SCCallState, SCCallStateUtil } from './models/SCCallState';
import {
  SCSwipeOffBehaviour,
  SCSwipeOffBehaviourUtil,
} from './models/SCSwipeOffBehaviour';
import {
  FcmProcessingMode,
  FcmProcessingModeUtil,
} from './models/FcmProcessingMode';
import {
  SignalingChannel,
  SignalingChannelUtil,
} from './models/SignalingChannel';

const CleverTapSignedCall = require('./NativeCleverTapSignedCallModule').default;

const eventEmitter = new NativeEventEmitter(CleverTapSignedCall);

/**
 * Passes the CleverTap Signed Call React Native SDK name and the current version for version tracking
 * @param {string} sdkName - SDK name's literal
 * @param {number} sdkVersion - The updated SDK version. /// If the current version is X.X.X then pass as X0X0X
 */
const sdkName = 'ctscsdkversion-react-native';
const sdkVersion = 77;
CleverTapSignedCall.trackSdkVersion(sdkName, sdkVersion);

class SignedCall {
  static SignedCallOnCallStatusChanged =
    CleverTapSignedCall.getConstants().SignedCallOnCallStatusChanged;
  static SignedCallOnMissedCallActionClicked =
    CleverTapSignedCall.getConstants().SignedCallOnMissedCallActionClicked;

  /**
   * Enables or disables debugging. If enabled, see debug messages in LogCat utility.
   *
   * @param {LogLevel} logLevel  an enum value from LogLevel class
   */
  static async setDebugLevel(logLevel: LogLevel):Promise<void> {
    SignedCallLogger.setLogLevel(logLevel);
    await CleverTapSignedCall.setDebugLevel(logLevel);
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
   * Attempts to return to the active call screen. Available only on Android
   *
   * This method checks if there is an active call and if the client is on VoIP call.
   * If both conditions are met, it starts the call screen activity.
   *
   */
  static async getBackToCall(): Promise<boolean> {
    if (Platform.OS == "android") {
      return await CleverTapSignedCall.getBackToCall();
    } else {
      throw new Error("getBackToCall function is available only on android")
    }
  }

  /**
   * Retrieves the current call state. Available only on Android
   * @return The current call state.
   */
  static async getCallState(): Promise<SCCallState | null> {
    if (Platform.OS == "android") {
      const callState = await CleverTapSignedCall.getCallState();
      return SCCallStateUtil.fromString(callState);
    } else {
      throw new Error ("getCallState function is available only on android")
    }
  }

  /**
   * Logs out the user by invalidating the active Signed Call session
   */
  static async logout(): Promise<void> {
    await CleverTapSignedCall.logout();
  }

  /**
   * Ends the active call, if any.
   */
  static async hangupCall(): Promise<void> {
    await CleverTapSignedCall.hangupCall();
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
  static async disconnectSignallingSocket(): Promise<void> {
    await CleverTapSignedCall.disconnectSignallingSocket();
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
          handler(CallEventResult.fromDict(response));
          break;
        case SignedCall.SignedCallOnMissedCallActionClicked:
          handler(MissedCallActionClickResult.fromDict(response));
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


  /**
   * Checks if the Signed Call SDK is initialized. Available only on Android
   *
   * @return {@code true} if the SDK is enabled and the session config is available, otherwise {@code false}.
   */
  static async isInitialized(): Promise<boolean> {
    if (Platform.OS == "android") {
      return await CleverTapSignedCall.isInitialized();
    } 
    throw new Error("isInitialized is available only on android")
  }

  /**
   * Dismisses the missed call notification. Available only on Android
   *
   * This method is intended to be called after a VoIP call use case is completed
   *
   */
  static async dismissMissedCallNotification(): Promise<boolean> {
    if (Platform.OS == "android") {
      return await CleverTapSignedCall.dismissMissedCallNotification();
    }
    throw new Error("dismissMissedCallNotification is available only on android")
  }

}

export {
  SignedCall,
  SignedCallResponse,
  LogLevel,
  CallEvent,
  SCCallState,
  SCSwipeOffBehaviour,
  SCSwipeOffBehaviourUtil,
  FcmProcessingMode,
  FcmProcessingModeUtil,
  SignalingChannel,
  SignalingChannelUtil,
  CallEventResult,
  CallDirection,
  MissedCallActionClickResult,
};
