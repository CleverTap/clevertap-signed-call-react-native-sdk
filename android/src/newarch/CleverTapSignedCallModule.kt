package com.clevertap.rnsignedcallandroid


import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap

class CleverTapSignedCallModule(context: ReactApplicationContext): NativeCleverTapSignedCallModuleSpec(context) {

  private val moduleImpl = CleverTapSignedCallModuleImpl(context)

  override fun getName(): String {
   return CleverTapSignedCallModuleImpl.NAME
  }

  override fun initialize(initProperties: ReadableMap, promise: Promise) {
    moduleImpl.initialize(initProperties,promise)
  }

  override fun call(
    receiverCuid: String,
    callContext: String,
    callProperties: ReadableMap?,
    promise: Promise
  ) {
    moduleImpl.call(receiverCuid, callContext, callProperties, promise)
  }

  override fun getBackToCall(promise: Promise) {
    moduleImpl.getBackToCall(promise)
  }

  override fun getCallState(promise: Promise) {
    moduleImpl.getCallState(promise)
  }

  override fun logout(promise: Promise) {
   moduleImpl.logout(promise)
  }

  override fun hangupCall(promise: Promise) {
   moduleImpl.hangupCall(promise)
  }

  override fun disconnectSignallingSocket(promise: Promise) {
    moduleImpl.disconnectSignallingSocket(promise)
  }


  override fun trackSdkVersion(sdkName: String, sdkVersion: Double,promise: Promise) {
   moduleImpl.trackSdkVersion(sdkName,sdkVersion.toInt(),promise)
  }

  override fun setDebugLevel(logLevel: Double,promise: Promise) {
   moduleImpl.setDebugLevel(logLevel.toInt())
  }

  override fun isInitialized(promise: Promise) {
    moduleImpl.isInitialized(promise)
  }

  override fun dismissMissedCallNotification(promise: Promise) {
    moduleImpl.dismissMissedCallNotification(promise)
  }

  override fun addListener(eventType: String?) {
    moduleImpl.addListener(eventType)
  }

  override fun removeListeners(count: Double) {
   moduleImpl.removeListeners(count.toInt())
  }

  override fun getTypedExportedConstants(): MutableMap<String, Any>  = moduleImpl.getConstants() as MutableMap<String, Any>


}
