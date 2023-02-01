package com.clevertap.rnsignedcallandroid

import com.clevertap.android.sdk.CleverTapAPI
import com.clevertap.android.signedcall.exception.InitException
import com.clevertap.android.signedcall.init.SignedCallAPI
import com.clevertap.android.signedcall.init.SignedCallInitConfiguration
import com.clevertap.android.signedcall.interfaces.SignedCallInitResponse
import com.clevertap.rnsignedcallandroid.util.Serializer.getInitConfigFromReadableMap
import com.clevertap.rnsignedcallandroid.util.Utils.getSignedCallResponseWritableMap
import com.clevertap.rnsignedcallandroid.util.Utils.log
import com.facebook.react.bridge.*

class CleverTapSignedCallModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {
  private var mSignedCall: SignedCallAPI? = null
  private var cleverTapAPI: CleverTapAPI? = null
  private val context = reactContext

  companion object {
    const val NAME = "CleverTapSignedCall"
  }

  override fun getName(): String {
    return NAME
  }

  private fun getSignedCallAPI(): SignedCallAPI {
    if (mSignedCall == null) {
      mSignedCall = SignedCallAPI.getInstance()
      cleverTapAPI = CleverTapAPI.getDefaultInstance(context)
    }
    return mSignedCall!!
  }

  @ReactMethod
  fun init(initProperties: ReadableMap?, promise: Promise) {
    val signedCallAPI: SignedCallAPI = getSignedCallAPI()
    initProperties?.let {
      try {
        val initConfiguration: SignedCallInitConfiguration? = getInitConfigFromReadableMap(it)
        signedCallAPI.init(
          context,
          initConfiguration,
          cleverTapAPI,
          object : SignedCallInitResponse {
            override fun onSuccess() {
              promise.resolve(getSignedCallResponseWritableMap(exception = null))
            }

            override fun onFailure(initException: InitException) {
              promise.resolve(getSignedCallResponseWritableMap(initException))
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
}
