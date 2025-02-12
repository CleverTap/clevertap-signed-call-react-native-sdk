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


  override fun getName(): String {
    return CleverTapSignedCallModuleImpl.NAME
  }

  @ReactMethod
  fun addListener(eventName: String?) {
    moduleImpl.addListener(eventName)
  }

  @ReactMethod
  fun removeListeners(count: Int?) {
    moduleImpl.removeListeners(count.toInt())
  }


  @SuppressLint("RestrictedApi")
  private fun registerListeners(context: ReactContext) {
    moduleImpl.registerListeners(context)
  }

  override fun getConstants(): MutableMap<String, String> {
   return moduleImpl.getConstants()
  }

  @SuppressLint("RestrictedApi")
  @ReactMethod
  fun trackSdkVersion(sdkName: String, sdkVersion: Int,promise: Promise) {
    moduleImpl.trackSdkVersion(sdkName,sdkVersion,promise)
  }

  @ReactMethod
  fun setDebugLevel(logLevel: Int) {
   moduleImpl.setDebugLevel(logLevel)
  }

  @ReactMethod
  fun initialize(initProperties: ReadableMap?, promise: Promise) {
    moduleImpl.initialize(initProperties, promise)
  }

  @ReactMethod
  fun call(
      receiverCuid: String,
      callContext: String,
      callProperties: ReadableMap?,
      promise: Promise
  ) {
    moduleImpl.call(receiverCuid, callContext, callProperties, promise)
  }

  @ReactMethod
  fun getBackToCall(promise: Promise) {
   moduleImpl.getBackToCall(promise)
  }

  @ReactMethod
  fun getCallState(promise: Promise) {
    moduleImpl.getCallState(promise)
  }

  @ReactMethod
  fun logout(promise: Promise) {
    moduleImpl.logout(promise)
  }

  @ReactMethod
  fun hangupCall(promise: Promise) {
    moduleImpl.hangupCall(promise)
  }

  @ReactMethod
  fun disconnectSignallingSocket(promise: Promise) {
    moduleImpl.disconnectSignallingSocket(promise)
  }

  @ReactMethod
  fun isInitialized(promise: Promise) {
     moduleImpl.isInitialized(promise)
  }

  @ReactMethod
  fun dismissMissedCallNotification(promise: Promise) {
     moduleImpl.dismissMissedCallNotification(promise)
  }
}
