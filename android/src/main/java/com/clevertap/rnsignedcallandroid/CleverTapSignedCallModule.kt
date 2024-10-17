package com.clevertap.rnsignedcallandroid

import android.annotation.SuppressLint
import com.clevertap.android.sdk.CleverTapAPI
import com.clevertap.android.signedcall.exception.CallException
import com.clevertap.android.signedcall.exception.InitException
import com.clevertap.android.signedcall.init.SignedCallAPI
import com.clevertap.android.signedcall.init.SignedCallInitConfiguration
import com.clevertap.android.signedcall.interfaces.OutgoingCallResponse
import com.clevertap.android.signedcall.interfaces.SignedCallInitResponse
import com.clevertap.android.signedcall.utils.SignedCallUtils
import com.clevertap.rnsignedcallandroid.internal.Events.ON_CALL_STATUS_CHANGED
import com.clevertap.rnsignedcallandroid.internal.Events.ON_M2P_NOTIFICATION_CANCEL_CTA_CLICKED
import com.clevertap.rnsignedcallandroid.internal.Events.ON_M2P_NOTIFICATION_CLICKED
import com.clevertap.rnsignedcallandroid.internal.Events.ON_MISSED_CALL_ACTION_CLICKED
import com.clevertap.rnsignedcallandroid.internal.events.EventEmitter
import com.clevertap.rnsignedcallandroid.internal.util.InitConfigSerializer.getInitConfigFromReadableMap
import com.clevertap.rnsignedcallandroid.internal.util.PayloadConverter.signedCallResponseToWritableMap
import com.clevertap.rnsignedcallandroid.internal.util.PayloadConverter.toSignedCallLogLevel
import com.clevertap.rnsignedcallandroid.internal.util.PayloadConverter.toWritableMap
import com.clevertap.rnsignedcallandroid.internal.util.Utils.log
import com.clevertap.rnsignedcallandroid.internal.util.toJson
import com.facebook.react.bridge.*

class CleverTapSignedCallModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {
  private var mSignedCall: SignedCallAPI? = null
  private var cleverTapAPI: CleverTapAPI? = null

  init {
    cleverTapAPI = CleverTapAPI.getDefaultInstance(reactContext)
    registerListeners(reactContext)
  }

  companion object {
    const val NAME = "CleverTapSignedCall"
    const val ERROR_CLEVERTAP_INSTANCE_NOT_INITIALIZED = "CleverTap Instance is not initialized"
  }

  /**
   * Exports the Name of the Android module. TypeScript/Javascript part of the package used this
   * name to communicate with this NativeModule class.
   */
  override fun getName(): String {
    return NAME
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
  override fun getConstants(): MutableMap<String, String> =
      hashMapOf(
          ON_CALL_STATUS_CHANGED to ON_CALL_STATUS_CHANGED,
          ON_MISSED_CALL_ACTION_CLICKED to ON_MISSED_CALL_ACTION_CLICKED,
          ON_M2P_NOTIFICATION_CLICKED to ON_M2P_NOTIFICATION_CLICKED,
          ON_M2P_NOTIFICATION_CANCEL_CTA_CLICKED to ON_M2P_NOTIFICATION_CANCEL_CTA_CLICKED
      )

  private fun getSignedCallAPI(): SignedCallAPI {
    if (mSignedCall == null) {
      mSignedCall = SignedCallAPI.getInstance()
    }
    return mSignedCall!!
  }

  @SuppressLint("RestrictedApi")
  private fun registerListeners(context: ReactContext) {
    if (!SignedCallUtils.isAppInBackground()) {
      SignedCallAPI.getInstance().registerVoIPCallStatusListener { data ->
        log(message = "SignedCallOnCallStatusListener is invoked in foreground or background: $data")
        EventEmitter.emit(context, ON_CALL_STATUS_CHANGED, data.toWritableMap())
      }
    }
  }

  @SuppressLint("RestrictedApi")
  @ReactMethod
  fun trackSdkVersion(sdkName: String, sdkVersion: Int) {
    cleverTapAPI?.let { cleverTapAPI!!.setCustomSdkVersion(sdkName, sdkVersion) }
        ?: run {
          log(message = "$ERROR_CLEVERTAP_INSTANCE_NOT_INITIALIZED to track the SDK Version")
        }
  }

  @ReactMethod
  fun setDebugLevel(logLevel: Int) {
    SignedCallAPI.setDebugLevel(logLevel.toSignedCallLogLevel())
  }

  /**
   * Retrieves the init-properties from the readableMap and initializes the Signed Call Android SDK
   */
  @ReactMethod
  fun initialize(initProperties: ReadableMap?, promise: Promise) {
    val signedCallAPI: SignedCallAPI = getSignedCallAPI()
    initProperties?.let {
      try {
        val initConfiguration: SignedCallInitConfiguration? = getInitConfigFromReadableMap(it, reactContext)
        signedCallAPI.init(
            reactContext,
            initConfiguration,
            cleverTapAPI,
            object : SignedCallInitResponse {
              override fun onSuccess() {
                promise.resolve(signedCallResponseToWritableMap(exception = null))
              }

              override fun onFailure(initException: InitException) {
                promise.resolve(signedCallResponseToWritableMap(initException))
              }
            }
        )
      } catch (throwable: Throwable) {
        val errorMessage = "Exception while initializing the Signed Call native module"
        log(message = errorMessage + ": " + throwable.localizedMessage)
        promise.reject(errorMessage, throwable)
      }
    }
  }

  /** Sends the call-details to initiate a VoIP call */
  @ReactMethod
  fun call(
      receiverCuid: String,
      callContext: String,
      callProperties: ReadableMap?,
      promise: Promise
  ) {
    val signedCallAPI: SignedCallAPI = getSignedCallAPI()
    try {
      val callOptions = callProperties?.toJson()
      signedCallAPI.call(
          reactContext,
          receiverCuid,
          callContext,
          callOptions,
          object : OutgoingCallResponse {
            override fun onSuccess() {
              promise.resolve(signedCallResponseToWritableMap(exception = null))
            }

            override fun onFailure(callException: CallException?) {
              promise.resolve(signedCallResponseToWritableMap(callException))
            }
          }
      )
    } catch (throwable: Throwable) {
      val errorMessage = "Exception while initiating the VoIP Call"
      log(message = errorMessage + ": " + throwable.localizedMessage)
      promise.reject(errorMessage, throwable)
    }
  }

  /** Logs out the Signed Call SDK session */
  @ReactMethod
  fun logout() {
    getSignedCallAPI().logout(reactContext)
  }

  /** Ends the active call, if any. */
  @ReactMethod
  fun hangupCall() {
    getSignedCallAPI().callController?.endCall()
  }

  /** Disconnects the signalling socket */
  @ReactMethod
  fun disconnectSignallingSocket() {
    getSignedCallAPI().disconnectSignallingSocket(reactContext)
  }
}
