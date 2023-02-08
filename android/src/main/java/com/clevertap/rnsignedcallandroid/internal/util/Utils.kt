package com.clevertap.rnsignedcallandroid.internal.util

import android.annotation.SuppressLint
import android.util.Log
import com.clevertap.android.signedcall.exception.BaseException
import com.clevertap.android.signedcall.init.SignedCallAPI
import com.clevertap.android.signedcall.models.MissedCallAction
import com.clevertap.android.signedcall.models.SignedCallScreenBranding
import com.clevertap.rnsignedcallandroid.internal.util.Constants.DARK_THEME
import com.clevertap.rnsignedcallandroid.internal.util.Constants.KEY_BG_COLOR
import com.clevertap.rnsignedcallandroid.internal.util.Constants.KEY_BUTTON_THEME
import com.clevertap.rnsignedcallandroid.internal.util.Constants.KEY_ERROR
import com.clevertap.rnsignedcallandroid.internal.util.Constants.KEY_ERROR_CODE
import com.clevertap.rnsignedcallandroid.internal.util.Constants.KEY_ERROR_DESCRIPTION
import com.clevertap.rnsignedcallandroid.internal.util.Constants.KEY_ERROR_MESSAGE
import com.clevertap.rnsignedcallandroid.internal.util.Constants.KEY_FONT_COLOR
import com.clevertap.rnsignedcallandroid.internal.util.Constants.KEY_IS_SUCCESSFUL
import com.clevertap.rnsignedcallandroid.internal.util.Constants.KEY_LOGO_URL
import com.clevertap.rnsignedcallandroid.internal.util.Constants.LOG_TAG
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap

object Utils {

  @SuppressLint("RestrictedApi")
  @JvmStatic
  fun log(tag: String = LOG_TAG, message: String) {
    when (SignedCallAPI.getDebugLevel()) {
      SignedCallAPI.LogLevel.VERBOSE -> {
        Log.v(tag, message)
      }
      SignedCallAPI.LogLevel.DEBUG -> {
        Log.d(tag, message)
      }
      SignedCallAPI.LogLevel.INFO -> {
        Log.i(tag, message)
      }
    }
  }
}

