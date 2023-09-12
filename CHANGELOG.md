# Change Log

### Version 0.0.4 (September 12, 2023)
-------------------------------------------

**What's new**

* **[Android Platform]**
  * Supports [Signed Call Android SDK v0.0.4](https://repo1.maven.org/maven2/com/clevertap/android/clevertap-signedcall-sdk/0.0.4) which is compatible with [CleverTap Android SDK v5.2.0](https://github.com/CleverTap/clevertap-android-sdk/blob/master/docs/CTCORECHANGELOG.md#version-520-august-10-2023).

* **[iOS Platform]**
  * Supports [Signed Call iOS SDK v0.0.5](https://github.com/CleverTap/clevertap-signedcall-ios-sdk/blob/main/CHANGELOG.md#version-005-aug-23-2023) which is compatible with [CleverTap iOS SDK v5.2.0](https://github.com/CleverTap/clevertap-ios-sdk/blob/master/CHANGELOG.md#version-520-august-16-2023).

* **[Android and iOS Platform]**
  * Adds support for hiding the **Powered by Signed Call** label from VoIP call screens. For more information, refer to [Override Dashboard Branding for Call Screen](https://developer.clevertap.com/docs/signed-call-react-native-sdk#overridedefaultbranding-all-platforms).

**Changes**

* **[Android Platform]**
  * The **index.html** file used inside the SDK has been renamed to a unique name to prevent conflicts with the same file name that may exist in the application.
  * Captures a missed call system event when a call initiator manually cancels the call, reported under the `SCEnd` system event.
  * Adjust the Microphone permission prompt limit to align with the [permissible threshold](https://developer.android.com/about/versions/11/privacy/permissions#dialog-visibility) which is shown when the receiver attends the call. Previously, if the Microphone permission was denied even once, SDK would continue to block all incoming calls at the receiver's end. (***Note***: Starting from Android 11, users have the option to deny the prompt twice before the permission is blocked by system, whereas in earlier versions, users could deny the prompt until selecting the "don't ask again" checkbox.)

* **[Android and iOS Platform]**
  * Captures a missed call system event when a call initiator manually cancels the call, reported under the `SCEnd` system event.

**Fixes**

* **[Android Platform]**
  * Improved Bluetooth handling for a better user experience:
    * Voice now goes through Bluetooth when Bluetooth connectivity is established during an ongoing call.
    * Voice now goes through the internal speaker when Bluetooth connectivity is disabled from the call screen button.
  * Resolved duplicate reporting of `SCIncoming` system events caused by receiving duplicate pushes for the same call, one from the socket and one from FCM.

## Version 0.0.2 (April 17, 2023)
-------------------------------------------

- Supports [Signed Call Android SDK v0.0.2](https://repo1.maven.org/maven2/com/clevertap/android/clevertap-signedcall-sdk/0.0.2) and [CleverTap Android SDK v4.7.5](https://github.com/CleverTap/clevertap-android-sdk/releases/tag/corev4.7.5_rmv1.0.3).
- Supports [Signed Call iOS SDK v0.0.2](https://github.com/CleverTap/clevertap-signedcall-ios-sdk/releases/tag/0.0.2) and [CleverTap iOS SDK v4.2.2](https://github.com/CleverTap/clevertap-ios-sdk/releases/tag/4.2.2)
- Supports Push Primer for [Android 13 notification runtime permission](https://developer.android.com/develop/ui/views/notifications/notification-permission).
- Adds new public API `disconnectSignallingSocket()` in order to close the Signalling socket connection.

## Version 0.0.1 (March 28, 2023)
-------------------------------------------

- Initial Release.
- Supports Signed Call Android SDK v0.0.1 and Signed Call iOS SDK v0.0.2.
