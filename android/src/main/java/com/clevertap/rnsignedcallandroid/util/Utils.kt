package com.clevertap.rnsignedcallandroid.util

import android.annotation.SuppressLint
import android.util.Log
import com.clevertap.android.signedcall.exception.BaseException
import com.clevertap.android.signedcall.init.SignedCallAPI
import com.clevertap.android.signedcall.models.MissedCallAction
import com.clevertap.android.signedcall.models.SignedCallScreenBranding
import com.clevertap.rnsignedcallandroid.util.Constants.DARK_THEME
import com.clevertap.rnsignedcallandroid.util.Constants.KEY_BG_COLOR
import com.clevertap.rnsignedcallandroid.util.Constants.KEY_BUTTON_THEME
import com.clevertap.rnsignedcallandroid.util.Constants.KEY_ERROR
import com.clevertap.rnsignedcallandroid.util.Constants.KEY_ERROR_CODE
import com.clevertap.rnsignedcallandroid.util.Constants.KEY_ERROR_DESCRIPTION
import com.clevertap.rnsignedcallandroid.util.Constants.KEY_ERROR_MESSAGE
import com.clevertap.rnsignedcallandroid.util.Constants.KEY_FONT_COLOR
import com.clevertap.rnsignedcallandroid.util.Constants.KEY_IS_SUCCESSFUL
import com.clevertap.rnsignedcallandroid.util.Constants.KEY_LOGO_URL
import com.clevertap.rnsignedcallandroid.util.Constants.LOG_TAG
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

  /**
   * Retrieves the branding details from the input initProperties object and
   * parses into the [SignedCallScreenBranding] object
   */
  @JvmStatic
  @Throws(Exception::class)
  fun parseBrandingFromInitOptions(brandingMap: Map<*, *>): SignedCallScreenBranding {
    val bgColor = brandingMap[KEY_BG_COLOR] as String
    val fontColor = brandingMap[KEY_FONT_COLOR] as String
    val logoUrl = brandingMap[KEY_LOGO_URL] as String
    val buttonTheme = brandingMap[KEY_BUTTON_THEME] as String

    return SignedCallScreenBranding(
      bgColor, fontColor, logoUrl,
      if (buttonTheme == DARK_THEME)
        SignedCallScreenBranding.ButtonTheme.DARK
      else
        SignedCallScreenBranding.ButtonTheme.LIGHT
    )
  }

  /**
   * Retrieves the missed call actions from the input initProperties object and
   * parses into the list of [MissedCallAction]
   */
  @JvmStatic
  @Throws(Exception::class)
  fun parseMissedCallActionsFromInitOptions(missedCallActionsMap: Map<*, *>): List<MissedCallAction> {
    return missedCallActionsMap.toList().map {
      MissedCallAction(
        it.first as String?,
        it.second as String?
      )
    }
  }

  /**
   * Parses the initialization or call response to a map by populating properties
   */
  @JvmStatic
  fun getSignedCallResponseWritableMap(exception: BaseException?): WritableMap {
    val responseMap = Arguments.createMap()
    responseMap.putBoolean(KEY_IS_SUCCESSFUL, (exception == null))
    exception?.let {
      val errorMap = Arguments.createMap()
      errorMap.putInt(KEY_ERROR_CODE, exception.errorCode)
      errorMap.putString(KEY_ERROR_MESSAGE, exception.message)
      errorMap.putString(KEY_ERROR_DESCRIPTION, exception.explanation)
      responseMap.putMap(KEY_ERROR, errorMap)
    }
    return responseMap
  }
}

