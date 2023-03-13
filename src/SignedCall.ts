'use strict';

import { NativeEventEmitter, NativeModules } from 'react-native';
import { CallEvent, CallEventUtil } from './models/CallEvents';
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

class SignedCall {
  static SignedCallOnCallStatusChanged =
    CleverTapSignedCall.SignedCallOnCallStatusChanged;
  static SignedCallOnMissedCallActionClicked =
    CleverTapSignedCall.SignedCallOnMissedCallActionClicked;

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
  static init(initProperties: object): Promise<SignedCallResponse> {
    return CleverTapSignedCall.init(initProperties).then((result: any) => {
      return SignedCallResponse.fromDict(result);
    });
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
          handler(CallEventUtil.fromString(response));
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
}

export {
  SignedCall,
  SignedCallResponse,
  CallEvent,
  MissedCallActionClickResult,
};
