# Change Log

### Version 0.7.6 (June 06, 2025)

---
**What's new**
* **[Android Platform]**
  * Supports Signed Call Android SDK [v0.0.7.6](https://repo1.maven.org/maven2/com/clevertap/android/clevertap-signedcall-sdk/0.0.7.6/) which is compatible with CleverTap Android SDK [v6.2.1](https://github.com/CleverTap/clevertap-android-sdk/blob/master/docs/CTCORECHANGELOG.md#version-620-april-3-2024).
  * **CallStyle Notifications on Android 12 and Onwards**:
    * Replaced regular call notifications with the CallStyle notifications for incoming, outgoing and ongoing calls. This update adheres to the new standards for non-dismissible notifications as outlined in the [Android 14 behavior changes](https://developer.android.com/about/versions/14/behavior-changes-all#non-dismissable-notifications). These notifications are given top priority in the notification shade or tray.
  * **Call Quality Control Enhancements**: Introduced network quality checks at both the initiator and receiver ends to ensure optimal call quality.
  - At the **Initiator Side**, the SDK checks network latency before processing a call request. If the network latency exceeds the benchmark, set by the SDK, an error with `5004` error-code within the `SignedCallResponse` promise object is returned.
  - At the **Receiver Side**, the SDK evaluates network quality before showing the incoming call screen. The network quality score (ranging from -1 to 100) is provided via the `onNetworkQualityResponse(int score)` callback, allowing the app to decide whether to proceed with or decline the call. Refer to the [SDK documentation](https://developer.clevertap.com/docs/signed-call-react-native-sdk#receiver-side) for detailed usage.
  * **Support new parameters in the `initProperties` object which gets passed to the ` SignedCall.initialize(initProperties)` method**:
    * `fcmProcessingMode` and `fcmProcessingNotification`: SDK supports the two modes for processing FCM calls: `FcmProcessingMode.foreground` and `FCMProcessingMode.background`. These modes determine how the SDK handles incoming calls whether in background or in a foreground service depending on whether the app is actively running or is running in the background. The `FcmProcessingMode.background` is default mode. If choosing the `FcmProcessingMode.foreground`, the `fcmProcessingNotification` parameter is mandatory. Refer to the [SDK documentation](https://developer.clevertap.com/docs/signed-call-react-native-sdk#configure-fcm-processing-mode) for more details on overriding the default mode.
    * `callScreenOnSignalling` : A `Boolean` property to control when the outgoing call screen appears relative to the signaling process. By default, the SDK immediately displays the outgoing call screen upon a call request and performs the validations in background. Please refer to [SDK documentation](https://developer.clevertap.com/docs/signed-call-react-native-sdk#control-call-screen-display-timing) for detailed usage.
  * **Support new call events in the `SignedCall.SignedCallOnCallStatusChanged` handler**:
    * `CallEvent.AppInitiatedDeclinedDueToNetworkQuality`: Allows to determine the cases where app initiates the call-decline based on the network quality score provided within `onNetworkQualityResponse(int score)` callback.
    * `CallEvent.EndedDueToLocalNetworkLoss`: Allows to determine when the call disconnects due to network loss at the local end.
    * `CallEvent.EndedDueToRemoteNetworkLoss`: Allows to determine when the call disconnects due to network loss at the remote end.
    **NOTE:** The `CallEvent.EndedDueToLocalNetworkLoss` and `CallEvent.EndedDueToRemoteNetworkLoss` events are reported alongside the existing `CallEvent.Ended` event to maintain backward compatibility.

* **[iOS Platform]**
  * Supports [Signed Call iOS SDK v0.0.9](https://github.com/CleverTap/clevertap-signedcall-ios-sdk/blob/main/CHANGELOG.md#version-009-november-19-2024) which is compatible with [CleverTap iOS SDK v7.0.2](https://github.com/CleverTap/clevertap-ios-sdk/blob/master/CHANGELOG.md#version-702-october-10-2024) and higher.

* **[Android and iOS Platform]**
* **Remote Context Configuration for Call Screens:**
  * Added support for setting a *remoteContext* parameter within `callProperties` object during call initiation, allowing to pass custom context for receiver's call screens.

**Bug Fixes**
* **[iOS Platform]**
  * Resolved **sa_family_t** declaration issue to ensure compatibility with Xcode 16.
  * Resolves `EXC_BAD_ACCESS` error that occurred when clicking the mute button on the CallKit screen. This exception was only observed in debugging mode.
  * Fixes synchronization issues regarding the Mute and Speaker controllers between the CallKit and native screens.

**Behaviour Changes**
* **[Android Platform]**
  * Optimized screen launch delay when initiating a call. The SDK now launches the outgoing call screen immediately, without waiting for signaling confirmation. A countdown ProgressBar is displayed around the cancel button until signaling is completed. You can use the `cancelCountdownColor` parameter within the `overrideDefaultBranding` initProperty to customize the countdown ProgressBar's color. The default color is *yellow (#F5FA55)*. Please refer to [SDK documentation](https://staging.docs.dev.clevertap.net/docs/signed-call-react-native-sdk#overridedefaultbranding-all-platforms) for the details on usage.

**Enhancements**
* **[Android Platform]**
  * Optimized delay in the heads-up behavior of the call notification when the user exits from the call screen.
  * Added fallback to the regular notification template for call notifications when using the CallStyle template, in case the full-screen intent permission is not granted.
  * Prevented the call notification popup when the SDK requests microphone permissions after the call is accepted.
  * Local branding configured during SDK initialization is now interoperable with the remote branding configured via the CleverTap dashboard, allows to override the specific branding properties without requiring all properties to be set at once.

### Version 0.5.5 (June 24, 2024)

---

**What's new**

- **[Android Platform]**

  - Supports [Signed Call Android SDK v0.0.5.5](https://repo1.maven.org/maven2/com/clevertap/android/clevertap-signedcall-sdk/0.0.5.5) which is compatible with [CleverTap Android SDK v6.2.0](https://github.com/CleverTap/clevertap-android-sdk/blob/master/docs/CTCORECHANGELOG.md#version-620-april-3-2024).
  - Enables back button functionality across call screens (incoming, outgoing, and ongoing) to allow users to navigate to other parts of the application while staying on a call.
  - Adds new public API `SignedCall.getBackToCall()` to navigate the user to the active call.
  - Adds new public API `SignedCall.getCallState()` to retrieve the current call state.
  - Supports following new properties to the `initProperties` object which gets passed to the `SignedCall.initialize(initProperties)` method:
    - The `notificationPermissionRequired` of `boolean` type to make notification permission as optional during the Signed Call initialization on Android 13 and onwards.
    - The `swipeOffBehaviourInForegroundService` property of custom `SCSwipeOffBehaviour` enum type to define the swipe off behavior for an active call within the foreground service managed by host application. 
    Please ensure to check the SDK documentation for detailed information on usage of initProperties listed above.
  - Introduces the following events to the `SignedCall.SignedCallOnCallStatusChanged` listener:
    - The `CancelledDueToRingTimeout` event which allows to handle the SDK-initiated cancellations due to ring-timeout. This event is reported when the SDK fails to establish communication with the receiver, often due to an offline device or a device with low bandwidth.
    - The `DeclinedDueToBusyOnVoIP` and `DeclinedDueToBusyOnPSTN`, to differentiate calls declined due to another Signed Call(VoIP) or declined due to a PSTN call respectively.
  - Exposes `callId` (call-specific identifier) parameter via `CallDetails` object provided in the result of the `SignedCall.SignedCallOnCallStatusChanged` listener. 

- **[iOS Platform]**

  - Supports [Signed Call iOS SDK v0.0.7](https://github.com/CleverTap/clevertap-signedcall-ios-sdk/blob/main/CHANGELOG.md#version-007-march-15-2024) which is compatible with [CleverTap iOS SDK v6.1.0](https://github.com/CleverTap/clevertap-ios-sdk/blob/master/CHANGELOG.md#version-610-february-22-2024).
  - Supports [Socket.io v16.1.0](https://github.com/socketio/socket.io-client-swift/releases/tag/v16.1.0) and [Starscream v4.0.8](https://github.com/daltoniam/Starscream/releases/tag/4.0.8) dependency.
  - Adds privacy manifest.
  - Expose socket usage logging for debugging purpose.  

**Behaviour Changes**

- **[Android Platform]**

  - Adds heads up behaviour to the call-notifications to prompt the user every time the call-screen goes invisible, triggered by either a back button press or putting the app in the background. The heads up notifications allow users to return to the call interface by tapping on the notification.
  - Improved Bluetooth audio experience during calls. Dial tone of an outgoing call will now play through the connected Bluetooth headset instead of the internal speaker.
  Note: The SDK requires the runtime [BLUETOOTH_CONNECT](https://developer.android.com/reference/android/Manifest.permission#BLUETOOTH_CONNECT) permission for Android 12 and onwards to enable the Bluetooth management during calls.

**Bug Fixes**

- **[Android Platform]**

  - Resolves an intermittent issue where the dialing tone at the initiator's side of the call plays on the loudspeaker instead of the internal speaker.
  - Resolves NPE crash occurring when calls are simultaneously initiated to each other, which disrupts the order of signals exchanged between participants.

### Version 0.0.5 (February 08, 2024)

---

**What's new**

- **[Android Platform]**

  - Supports [Signed Call Android SDK v0.0.5](https://repo1.maven.org/maven2/com/clevertap/android/clevertap-signedcall-sdk/0.0.5) which is compatible with [CleverTap Android SDK v5.2.2](https://github.com/CleverTap/clevertap-android-sdk/blob/master/docs/CTCORECHANGELOG.md#version-522-december-22-2023).
  - Introduces new properties `initiatorImage` and `receiverImage` in the `MissedCallActionClickResult` instance provided through the `SignedCall.addListener(SignedCall.SignedCallOnMissedCallActionClicked,(result:MissedCallActionClickResult) => {})` listener.
  - Introduces a new public API: `SignedCallOnCallStatusListener.register(applicationContext)`. This API allows your application to receive VoIP call events through the `SignedCall.SignedCallOnCallStatusChanged` listener even when the app is in a killed state. For detailed integration instructions, please refer to the documentation.

- **[iOS Platform]**
  - Supports [Signed Call iOS SDK v0.0.6](https://github.com/CleverTap/clevertap-signedcall-ios-sdk/blob/main/CHANGELOG.md#version-006-january-19-2024) which is compatible with [CleverTap iOS SDK v5.2.2](https://github.com/CleverTap/clevertap-ios-sdk/blob/master/CHANGELOG.md#version-522-november-21-2023).

**Breaking Changes**

- **[Android and iOS Platform]**
  - The `SignedCall.SignedCallOnCallStatusChanged` listener will now provide an instance of the `CallEventResult` class instead of the `CallEvent` class. Please refer to the integration documentation for details on usage.
- **[iOS Platform]**
  - iOS deployment target version is bumped to iOS 12.

**Behaviour Changes**

- **[Android Platform]**

  - Handles UX issues during network loss or switch by invalidating the socket reconnection and establishing an active connection to process the call related actions.
  - Modifies the SDK's behavior when the **Notifications Settings** are disabled for the application. Previously, if the app's notifications were disabled, the device rang on incoming calls without displaying the call screen in the background and killed states. In this version, the SDK now declines incoming calls when the notifications are disabled. If the notification settings are later enabled, the SDK resumes processing calls instead of automatically declining them.

- **[Android and iOS Platform]**
  - The `SignedCall.addListener(SignedCall.SignedCallOnCallStatusChanged,(result:CallEventResult) => {})` listener will now provide updates in the call state to both the initiator and receiver of the call. Previously, it was exposed only to the initiator of the call.

**Bug Fixes**

- **[Android Platform]**

  - Fixes multiple outgoing call requests initiated simultaneously through multiple calls of `SignedCall.call(receiverCuid, callContext, callProperties)`. The SDK now processes only one call at a time while rejecting other requests with a failure exception.
  - Addresses an **IllegalStateException** which occurs while prompting the user with the poor/bad network conditions on the call-screen.

- **[Android and iOS Platform]**
  - Addresses an infinite **Connecting** state issue on the call screen which was triggered by using CUIDs longer than 15 characters. In this version, the SDK extends support to CUIDs ranging from 5 to 50 characters.

### Version 0.0.4 (September 12, 2023)

---

**What's new**

- **[Android Platform]**

  - Supports [Signed Call Android SDK v0.0.4](https://repo1.maven.org/maven2/com/clevertap/android/clevertap-signedcall-sdk/0.0.4) which is compatible with [CleverTap Android SDK v5.2.0](https://github.com/CleverTap/clevertap-android-sdk/blob/master/docs/CTCORECHANGELOG.md#version-520-august-10-2023).

- **[iOS Platform]**

  - Supports [Signed Call iOS SDK v0.0.5](https://github.com/CleverTap/clevertap-signedcall-ios-sdk/blob/main/CHANGELOG.md#version-005-aug-23-2023) which is compatible with [CleverTap iOS SDK v5.2.0](https://github.com/CleverTap/clevertap-ios-sdk/blob/master/CHANGELOG.md#version-520-august-16-2023).

- **[Android and iOS Platform]**
  - Adds support for hiding the **Powered by Signed Call** label from VoIP call screens. For more information, refer to [Override Dashboard Branding for Call Screen](https://developer.clevertap.com/docs/signed-call-react-native-sdk#overridedefaultbranding-all-platforms).

**Changes**

- **[Android Platform]**

  - The **index.html** file used inside the SDK has been renamed to a unique name to prevent conflicts with the same file name that may exist in the application.
  - Captures a missed call system event when a call initiator manually cancels the call, reported under the `SCEnd` system event.
  - Adjust the Microphone permission prompt limit to align with the [permissible threshold](https://developer.android.com/about/versions/11/privacy/permissions#dialog-visibility) which is shown when the receiver attends the call. Previously, if the Microphone permission was denied even once, SDK would continue to block all incoming calls at the receiver's end. (**_Note_**: Starting from Android 11, users have the option to deny the prompt twice before the permission is blocked by system, whereas in earlier versions, users could deny the prompt until selecting the "don't ask again" checkbox.)

- **[Android and iOS Platform]**
  - Captures a missed call system event when a call initiator manually cancels the call, reported under the `SCEnd` system event.

**Fixes**

- **[Android Platform]**
  - Improved Bluetooth handling for a better user experience:
    - Voice now goes through Bluetooth when Bluetooth connectivity is established during an ongoing call.
    - Voice now goes through the internal speaker when Bluetooth connectivity is disabled from the call screen button.
  - Resolved duplicate reporting of `SCIncoming` system events caused by receiving duplicate pushes for the same call, one from the socket and one from FCM.

## Version 0.0.2 (April 17, 2023)

---

- Supports [Signed Call Android SDK v0.0.2](https://repo1.maven.org/maven2/com/clevertap/android/clevertap-signedcall-sdk/0.0.2) and [CleverTap Android SDK v4.7.5](https://github.com/CleverTap/clevertap-android-sdk/releases/tag/corev4.7.5_rmv1.0.3).
- Supports [Signed Call iOS SDK v0.0.2](https://github.com/CleverTap/clevertap-signedcall-ios-sdk/releases/tag/0.0.2) and [CleverTap iOS SDK v4.2.2](https://github.com/CleverTap/clevertap-ios-sdk/releases/tag/4.2.2)
- Supports Push Primer for [Android 13 notification runtime permission](https://developer.android.com/develop/ui/views/notifications/notification-permission).
- Adds new public API `disconnectSignallingSocket()` in order to close the Signalling socket connection.

## Version 0.0.1 (March 28, 2023)

---

- Initial Release.
- Supports Signed Call Android SDK v0.0.1 and Signed Call iOS SDK v0.0.2.
