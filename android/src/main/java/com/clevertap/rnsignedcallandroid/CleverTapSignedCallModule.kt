package com.clevertap.rnsignedcallandroid

import com.clevertap.android.sdk.CleverTapAPI
import com.clevertap.android.signedcall.exception.InitException
import com.clevertap.android.signedcall.init.SignedCallAPI
import com.clevertap.android.signedcall.init.SignedCallInitConfiguration
import com.clevertap.android.signedcall.interfaces.SignedCallInitResponse
import com.clevertap.rnsignedcallandroid.util.Serializer.getInitConfigFromReadableMap
import com.clevertap.rnsignedcallandroid.util.Utils
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
  fun init(initProperties: ReadableMap?, initCallback: Callback) {
    val signedCallAPI: SignedCallAPI = getSignedCallAPI()
    initProperties?.let {
      try {
        val initConfiguration: SignedCallInitConfiguration? = getInitConfigFromReadableMap(it)
        signedCallAPI.init(context, initConfiguration, cleverTapAPI,
          object : SignedCallInitResponse {
            override fun onSuccess() {
              Utils.log(message = "SC initialized")
            }

            override fun onFailure(initException: InitException) {
              Utils.log(message = "SC Exception")
            }
          })
      } catch (throwable: Throwable) {
        throwable.printStackTrace()
        Utils.log(message = "Exception while initializing the Signed Call native module: " + throwable.localizedMessage)
      }
    } ?: run {
      //TODO - handle error
    }
  }
}
