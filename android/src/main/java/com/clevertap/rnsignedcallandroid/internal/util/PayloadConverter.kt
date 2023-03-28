package com.clevertap.rnsignedcallandroid.internal.util

import com.clevertap.android.signedcall.exception.BaseException
import com.clevertap.android.signedcall.init.SignedCallAPI
import com.clevertap.android.signedcall.models.MissedCallNotificationOpenResult
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap

/**
 * Contains parser methods to change the payload from one type to another.
 */
internal object PayloadConverter {

  /**
   * Parses the integer debug level to the [SignedCallAPI.LogLevel] type
   * @return - returns a parsed SCLogLevel value
   */
  fun Int.toSignedCallLogLevel(): Int {
    return when (this) {
      -1 -> SignedCallAPI.LogLevel.OFF
      0 -> SignedCallAPI.LogLevel.INFO
      2 -> SignedCallAPI.LogLevel.DEBUG
      3 -> SignedCallAPI.LogLevel.VERBOSE
      else -> throw IllegalStateException("Invalid value of debug level")
    }
  }

  /**
   * Parses the result of the initialization or call-attempt to a map
   * @return - returns a parsed WritableMap
   */
  @JvmStatic
  fun signedCallResponseToWritableMap(exception: BaseException?): WritableMap {
    val responseMap = Arguments.createMap()
    responseMap.putBoolean(Constants.KEY_IS_SUCCESSFUL, (exception == null))
    exception?.let {
      val errorMap = Arguments.createMap()
      errorMap.putInt(Constants.KEY_ERROR_CODE, exception.errorCode)
      errorMap.putString(Constants.KEY_ERROR_MESSAGE, exception.message)
      errorMap.putString(Constants.KEY_ERROR_DESCRIPTION, exception.explanation)
      responseMap.putMap(Constants.KEY_ERROR, errorMap)
    }
    return responseMap
  }

  /**
   * Parses the [MissedCallNotificationOpenResult] type to a map
   * @return - returns a parsed WritableMap
   */
  @JvmStatic
  fun MissedCallNotificationOpenResult.toWriteableMap(): WritableMap {
    val responseMap = Arguments.createMap()
    return responseMap?.apply {
      val actionMap = Arguments.createMap()
      actionMap.putString(Constants.KEY_ACTION_ID, action.actionID)
      actionMap.putString(Constants.KEY_ACTION_LABEL, action.actionLabel)

      val callDetailsMap = Arguments.createMap()
      callDetailsMap.putString(Constants.KEY_CALLER_CUID, callDetails.callerCuid)
      callDetailsMap.putString(Constants.KEY_CALLEE_CUID, callDetails.calleeCuid)
      callDetailsMap.putString(Constants.KEY_CALL_CONTEXT, callDetails.callContext)

      this.putMap(Constants.KEY_ACTION, actionMap)
      this.putMap(Constants.KEY_CALL_DETAILS, callDetailsMap)
    } ?: responseMap
  }
}
