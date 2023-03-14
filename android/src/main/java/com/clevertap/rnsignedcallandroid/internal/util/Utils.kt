package com.clevertap.rnsignedcallandroid.internal.util

import android.annotation.SuppressLint
import android.util.Log
import com.clevertap.android.signedcall.init.SignedCallAPI
import com.clevertap.rnsignedcallandroid.internal.util.Constants.LOG_TAG

/**
 * Provides general-purpose utility methods
 */
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

