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
    moduleImpl.getBackToCall(promise)
  }

  override fun logout() {
   moduleImpl.logout()
  }

  override fun hangupCall() {
   moduleImpl.hangupCall()
  }

  override fun disconnectSignallingSocket() {
    moduleImpl.disconnectSignallingSocket()
  }

  override fun addListener(eventName: String?, handler: Callback?) {
    TODO("Not yet implemented")
  }

  override fun removeListener(eventName: String?) {
    TODO("Not yet implemented")
  }


}
