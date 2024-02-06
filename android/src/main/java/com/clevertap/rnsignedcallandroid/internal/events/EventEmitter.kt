package com.clevertap.rnsignedcallandroid.internal.events

import android.content.Context
import com.clevertap.android.signedcall.models.MissedCallNotificationOpenResult
import com.clevertap.android.signedcall.models.SCCallStatusDetails
import com.clevertap.rnsignedcallandroid.internal.EventName
import com.clevertap.rnsignedcallandroid.internal.Events.ON_CALL_STATUS_CHANGED
import com.clevertap.rnsignedcallandroid.internal.Events.ON_MISSED_CALL_ACTION_CLICKED
import com.clevertap.rnsignedcallandroid.internal.util.PayloadConverter.toWriteableMap
import com.clevertap.rnsignedcallandroid.internal.util.Utils.log
import com.facebook.react.ReactApplication
import com.facebook.react.ReactInstanceEventListener
import com.facebook.react.ReactNativeHost
import com.facebook.react.bridge.ReactContext
import com.facebook.react.modules.core.DeviceEventManagerModule

/**
 * Emitter class to establish the communication from android to the
 * Typescript or Javascript part of this package.
 */
internal object EventEmitter {

  /**
   * Use this method to send the payload to the registered listeners of the passed event.
   * @param event - target event name
   * @param payload - payload to be sent
   */
  fun emit(context: Context, @EventName event: String, payload: Any) {
    // Construct and load our normal React JS code bundle
    val application = context.applicationContext as ReactApplication
    val reactNativeHost: ReactNativeHost = application.reactNativeHost

    if (reactNativeHost.hasInstance()) {
      val reactContext = reactNativeHost.reactInstanceManager.currentReactContext
      processEmit(reactContext, event, payload)
    } else {
      val reactInstanceManager = reactNativeHost.reactInstanceManager
      // Otherwise wait for construction, then send the notification
      reactInstanceManager.addReactInstanceEventListener(object : ReactInstanceEventListener {
        override fun onReactContextInitialized(context: ReactContext) {
          processEmit(context, event, payload)
          reactInstanceManager.removeReactInstanceEventListener(this)
        }
      })
      if (!reactInstanceManager.hasStartedCreatingInitialContext()) {
        // Construct it in the background
        reactInstanceManager.createReactContextInBackground()
      }
    }
  }

  private fun processEmit(reactContext: ReactContext?, @EventName event: String, payload: Any) {
    try {
      log(message = "emit : $event event with payload: $payload")
      when (event) {
        ON_CALL_STATUS_CHANGED -> sendEmit(reactContext, event, (payload as SCCallStatusDetails).toWriteableMap())
        ON_MISSED_CALL_ACTION_CLICKED -> sendEmit(
          reactContext, event, (payload as MissedCallNotificationOpenResult).toWriteableMap()
        )
      }
    } catch (t: Throwable) {
      log(message = "An exception occurred while emitting $event: " + t.localizedMessage)
    }
  }

  private fun sendEmit(reactContext: ReactContext?, @EventName eventName: String, params: Any) {
    try {
      reactContext!!.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)?.emit(eventName, params)
    } catch (t: Throwable) {
      log(message = "An exception while signalling the $eventName: " + t.localizedMessage)
    }
  }
}
