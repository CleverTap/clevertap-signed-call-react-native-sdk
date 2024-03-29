package com.clevertap.rnsignedcallandroid.internal.events

import android.content.Context
import com.clevertap.rnsignedcallandroid.internal.EventName
import com.clevertap.rnsignedcallandroid.internal.util.Utils.log
import com.facebook.react.ReactApplication
import com.facebook.react.ReactInstanceEventListener
import com.facebook.react.ReactNativeHost
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.WritableMap
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
  fun emit(context: Context, @EventName event: String, payload: WritableMap) {
    try {
      val application = context.applicationContext as ReactApplication
      val reactNativeHost: ReactNativeHost = application.reactNativeHost
      val reactContext = reactNativeHost.reactInstanceManager.currentReactContext

      if (reactContext != null) {
        sendEmit(reactContext, event, payload)
      } else {
        val reactInstanceManager = reactNativeHost.reactInstanceManager
        reactInstanceManager.addReactInstanceEventListener(object : ReactInstanceEventListener {
          override fun onReactContextInitialized(context: ReactContext) {
            sendEmit(context, event, payload)
            reactInstanceManager.removeReactInstanceEventListener(this)
          }
        })
        if (!reactInstanceManager.hasStartedCreatingInitialContext()) {
          reactInstanceManager.createReactContextInBackground()
        }
      }
    } catch (t: Throwable) {
      log(message = "An exception occurred while emitting the $event with params: $payload: " + t.localizedMessage)
    }
  }

  private fun sendEmit(reactContext: ReactContext?, @EventName eventName: String, payload: Any) {
    try {
      log(message = "Emitting : $eventName event with payload: $payload")
      reactContext!!.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)?.emit(eventName, payload)
    } catch (t: Throwable) {
      log(message = "An exception occurred while operating on eventEmitter instance: " + t.localizedMessage)
    }
  }
}
