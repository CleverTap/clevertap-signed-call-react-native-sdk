package com.clevertap.rnsignedcallandroid.internal.util

import android.annotation.SuppressLint
import android.content.Context
import android.util.Log
import com.facebook.infer.annotation.Assertions
import com.facebook.react.ReactApplication
import com.facebook.react.ReactInstanceEventListener
import com.facebook.react.ReactInstanceManager
import com.facebook.react.ReactNativeHost
import com.facebook.react.bridge.ReactContext


object ReactContextHandler {

  private const val TAG = "ReactContextHandler"

  fun execute(context: Context, runnable: (reactContext:ReactContext) -> Unit) {
    val reactContext = getReactContext(context)
    if (reactContext != null) {
      runnable(reactContext)
      return
    }
    val reactHost: Any = getReactHost(context) ?: {
      Utils.log(message = "Failed to get React Host")
    }
    if (isBridgelessArchitectureEnabled()) { // NEW arch
      val callback: ReactInstanceEventListener =
        object : ReactInstanceEventListener {
          override fun onReactContextInitialized(context: ReactContext) {
            runnable(context)
            try {
              val removeReactInstanceEventListener =
                reactHost
                  .javaClass
                  .getMethod(
                    "removeReactInstanceEventListener", ReactInstanceEventListener::class.java
                  )
              removeReactInstanceEventListener.invoke(reactHost, this)
            } catch (e: Exception) {
              Utils.log(message = "reflection error A: $e")
            }
          }
        }
      try {
        val addReactInstanceEventListener =
          reactHost
            .javaClass
            .getMethod("addReactInstanceEventListener", ReactInstanceEventListener::class.java)
        addReactInstanceEventListener.invoke(reactHost, callback)
        val startReactHost = reactHost.javaClass.getMethod("start")
        startReactHost.invoke(reactHost)
      } catch (e: Exception) {
        Utils.log(message = "reflection error ReactHost start: " + e.message)
      }
    } else { // OLD arch
      val reactInstanceManager: ReactInstanceManager =
        getReactNativeHost(context).reactInstanceManager
      reactInstanceManager.addReactInstanceEventListener(
        object : ReactInstanceEventListener {
          override fun onReactContextInitialized(context: ReactContext) {
            runnable(context)
            reactInstanceManager.removeReactInstanceEventListener(this)
          }
        })
      reactInstanceManager.createReactContextInBackground()
    }

  }

  @SuppressLint("VisibleForTests")
  fun getReactContext(context: Context): ReactContext? {
    if (isBridgelessArchitectureEnabled()) {
      val reactHost = getReactHost(context)
      Assertions.assertNotNull(reactHost, "getReactHost() is null in New Architecture")
      try {
        checkNotNull(reactHost)
        val getCurrentReactContext = reactHost.javaClass.getMethod("getCurrentReactContext")
        return getCurrentReactContext.invoke(reactHost) as ReactContext
      } catch (e: java.lang.Exception) {
        Utils.log(message = "Reflection error getCurrentReactContext: " + e.message)
        return null
      }
    }
    val reactInstanceManager =
      getReactNativeHost(context).reactInstanceManager
    return reactInstanceManager.currentReactContext
  }

  /**
   * Return true if this app is running with RN's bridgeless architecture. Cheers to @mikehardy for
   * this idea.
   *
   * @return true if new arch bridgeless mode is enabled
   */
  private fun isBridgelessArchitectureEnabled(): Boolean {
    try {
      val entryPoint =
        Class.forName("com.facebook.react.defaults.DefaultNewArchitectureEntryPoint")
      val bridgelessEnabled = entryPoint.getMethod("getBridgelessEnabled")
      val result = bridgelessEnabled.invoke(null)
      return (result == java.lang.Boolean.TRUE)
    } catch (e: java.lang.Exception) {
      return false
    }
  }

  /** Get the {ReactHost} used by this app. ure and returns null if not.  */
  private fun getReactHost(context: Context): Any? {
    try {
      val getReactHost = context.applicationContext.javaClass.getMethod("getReactHost")
      return getReactHost.invoke(context.applicationContext)
    } catch (e: java.lang.Exception) {
      return null
    }
  }

  private fun getReactNativeHost(context: Context): ReactNativeHost {
    return (context.applicationContext as ReactApplication).reactNativeHost
  }
}
