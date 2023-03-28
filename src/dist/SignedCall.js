'use strict';
exports.__esModule = true;
exports.MissedCallActionClickResult = exports.CallEvent = exports.SignedCallResponse = exports.SignedCall = void 0;
var react_native_1 = require("react-native");
var CallEvents_1 = require("./models/CallEvents");
exports.CallEvent = CallEvents_1.CallEvent;
var MissedCallAction_1 = require("./models/MissedCallAction");
exports.MissedCallActionClickResult = MissedCallAction_1.MissedCallActionClickResult;
var SignedCallResponse_1 = require("./models/SignedCallResponse");
exports.SignedCallResponse = SignedCallResponse_1.SignedCallResponse;
var SignedCallLogger_1 = require("./utils/SignedCallLogger");
var Constants_1 = require("./Constants");
var CleverTapSignedCall = react_native_1.NativeModules.CleverTapSignedCall
    ? react_native_1.NativeModules.CleverTapSignedCall
    : new Proxy({}, {
        get: function () {
            throw new Error(Constants_1.Constants.LINKING_ERROR);
        }
    });
var eventEmitter = new react_native_1.NativeEventEmitter(CleverTapSignedCall);
var SignedCall = /** @class */ (function () {
    function SignedCall() {
    }
    /**
     * Enables or disables debugging. If enabled, see debug messages in LogCat utility.
     *
     * @param {LogLevel} logLevel  an enum value from LogLevel class
     */
    SignedCall.setDebugLevel = function (logLevel) {
        SignedCallLogger_1.SignedCallLogger.setLogLevel(logLevel);
        CleverTapSignedCall.setDebugLevel(logLevel);
    };
    /**
     * Initializes the Signed Call SDK in your app's Javascript or Typescript code.
     * @param {object} initProperties - configuration object for the initialization.
     */
    SignedCall.initialize = function (initProperties) {
        return CleverTapSignedCall.initialize(initProperties).then(function (result) {
            return SignedCallResponse_1.SignedCallResponse.fromDict(result);
        });
    };
    /**
     * Initiates a VoIP call
     * @param {string} receiverCuid - cuid of the person whomsoever call needs to be initiated
     * @param {string} callContext - context(reason) of the call that is displayed on the call screen
     * @param {string} callProperties - configuration(metadata) for a VoIP call
     */
    SignedCall.call = function (receiverCuid, callContext, callProperties) {
        return CleverTapSignedCall.call(receiverCuid, callContext, callProperties).then(function (result) {
            return SignedCallResponse_1.SignedCallResponse.fromDict(result);
        });
    };
    /**
     * Logs out the user by invalidating the active Signed Call session
     */
    SignedCall.logout = function () {
        CleverTapSignedCall.logout();
    };
    /**
     * Ends the active call, if any.
     */
    SignedCall.hangupCall = function () {
        CleverTapSignedCall.hangupCall();
    };
    /**
     * Adds the event handler to the event name
     * @param {string} eventName - name of the event
     * @param {any} handler - callback handler
     * @returns void
     */
    SignedCall.addListener = function (eventName, handler) {
        //First, remove the active listeners of the given event to avoid duplicate listeners
        SignedCall.removeListener(eventName);
        //Register another handler to the passed event in order to manipulate the event-payload
        eventEmitter.addListener(eventName, function (response) {
            switch (eventName) {
                case SignedCall.SignedCallOnCallStatusChanged:
                    handler(CallEvents_1.CallEventUtil.fromString(response));
                    break;
                case SignedCall.SignedCallOnMissedCallActionClicked:
                    handler(MissedCallAction_1.MissedCallActionClickResult.fromDict(response));
                    break;
            }
        });
    };
    /**
     * Removes the event handler(s) for the event name
     * @param  {string} eventName - name of the event
     * @returns void
     */
    SignedCall.removeListener = function (eventName) {
        eventEmitter.removeAllListeners(eventName);
    };
    SignedCall.SignedCallOnCallStatusChanged = CleverTapSignedCall.SignedCallOnCallStatusChanged;
    SignedCall.SignedCallOnMissedCallActionClicked = CleverTapSignedCall.SignedCallOnMissedCallActionClicked;
    return SignedCall;
}());
exports.SignedCall = SignedCall;
