package com.clevertap.rnsignedcallandroid.internal.events

import com.clevertap.android.signedcall.models.MissedCallNotificationOpenResult
import com.clevertap.rnsignedcallandroid.internal.EventName
import com.clevertap.rnsignedcallandroid.internal.Events.ON_CALL_STATUS_CHANGED
import com.clevertap.rnsignedcallandroid.internal.Events.ON_MISSED_CALL_ACTION_CLICKED
import com.clevertap.rnsignedcallandroid.internal.util.PayloadConverter.toWriteableMap
import com.clevertap.rnsignedcallandroid.internal.util.Utils.log
import com.facebook.react.bridge.ReactContext
import com.facebook.react.modules.core.DeviceEventManagerModule

/**
 * Emitter class to establish the communication from android to the
 * Typescript or Javascript part of this package.
 */
internal class EventEmitter(private val reactContext: ReactContext) {

  /**
   * Use this method to send the payload to the registered listeners of the passed event.
   * @param event - target event name
   * @param payload - payload to be sent
   */
  fun emit(@EventName event: String, payload: Any) {
    try {
      log(message = "emit() : $event")
      when (event) {
        ON_CALL_STATUS_CHANGED -> emitOnCallStatusChanged(event, payload as String)
        ON_MISSED_CALL_ACTION_CLICKED -> emitOnMissedCallActionClicked(
          event, payload as MissedCallNotificationOpenResult
        )
      }
    } catch (t: Throwable) {
      log(message = "An exception occurred while emitting $event: " + t.localizedMessage)
    }
  }

  private fun emitOnCallStatusChanged(@EventName event: String, callStatus: String) {
    log(message = "emitOnCallStatusChanged() : $event")
    sendEmit(event, callStatus)
  }

  private fun emitOnMissedCallActionClicked(
    @EventName event: String, missedCallAction: MissedCallNotificationOpenResult
  ) {
    val payload = missedCallAction.toWriteableMap()
    log(message = "emitOnMissedCallActionClicked() : $event with payload: $payload")
    sendEmit(event, payload)
  }

  private fun sendEmit(@EventName eventName: String, params: Any) {
    try {
      reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        .emit(eventName, params)
    } catch (t: Throwable) {
      log(message = "An exception while signalling the $eventName: " + t.localizedMessage)
    }
  }
}
