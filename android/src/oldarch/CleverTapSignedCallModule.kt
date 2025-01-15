package com.clevertap.rnsignedcallandroid

import android.annotation.SuppressLint
import com.clevertap.android.signedcall.init.SignedCallAPI
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap

class CleverTapSignedCallModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

  private val moduleImpl = CleverTapSignedCallModuleImpl(reactContext)

  /**
   * Exports the Name of the Android module. TypeScript/Javascript part of the package used this
   * name to communicate with this NativeModule class.
   */
  override fun getName(): String {
    return CleverTapSignedCallModuleImpl.NAME
  }

  @ReactMethod
  fun addListener(eventName: String?) {
    // Keep: Required for RN built in Event Emitter Calls.
  }

  @ReactMethod
  fun removeListeners(count: Int?) {
    // Keep: Required for RN built in Event Emitter Calls.
  }

  /** Exports constants for Typescript or Javascript part of this package. */

  @SuppressLint("RestrictedApi")
  private fun registerListeners(context: ReactContext) {
    moduleImpl.registerListeners(context)
  }

  override fun getConstants(): MutableMap<String, String> {
   return moduleImpl.getConstants()
  }

  @SuppressLint("RestrictedApi")
  @ReactMethod
  fun trackSdkVersion(sdkName: String, sdkVersion: Int) {
    moduleImpl.trackSdkVersion(sdkName,sdkVersion)
  }

  @ReactMethod
  fun setDebugLevel(logLevel: Int) {
   moduleImpl.setDebugLevel(logLevel)
  }

  /**
   * Retrieves the init-properties from the readableMap and initializes the Signed Call Android SDK
   */
  @ReactMethod
  fun initialize(initProperties: ReadableMap?, promise: Promise) {
    moduleImpl.initialize(initProperties, promise)
  }

  /** Sends the call-details to initiate a VoIP call */
  @ReactMethod
  fun call(
      receiverCuid: String,
      callContext: String,
      callProperties: ReadableMap?,
      promise: Promise
  ) {
    moduleImpl.call(receiverCuid, callContext, callProperties, promise)
  }

  /**
   * Attempts to return to the active call screen.
   *
   * This method checks if there is an active call and if the client is on VoIP call.
   * If both conditions are met, it starts the call screen activity.
   */
  @ReactMethod
  fun getBackToCall(promise: Promise) {
   moduleImpl.getBackToCall(promise)
  }

  /**
   * Retrieves the current call state.
   * @return The current call state.
   */
  @ReactMethod
  fun getCallState(promise: Promise) {
    moduleImpl.getCallState(promise)
  }

  /** Logs out the Signed Call SDK session */
  @ReactMethod
  fun logout() {
    moduleImpl.logout()
  }

  /** Ends the active call, if any. */
  @ReactMethod
  fun hangupCall() {
    moduleImpl.hangupCall()
  }

  /** Disconnects the signalling socket */
  @ReactMethod
  fun disconnectSignallingSocket() {
    moduleImpl.disconnectSignallingSocket()
  }
}
