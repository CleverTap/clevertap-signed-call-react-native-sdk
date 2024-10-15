package com.clevertap.rnsignedcallandroid.internal.util

import com.clevertap.android.signedcall.exception.BaseException
import com.clevertap.android.signedcall.init.SignedCallAPI
import com.clevertap.android.signedcall.models.DTMFInput
import com.clevertap.android.signedcall.models.M2PCallOptions
import com.clevertap.android.signedcall.models.MissedCallNotificationOpenResult
import com.clevertap.android.signedcall.models.P2PCallOptions
import com.clevertap.android.signedcall.models.SCCallOptions
import com.clevertap.android.signedcall.models.SCCallStatusDetails
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import org.json.JSONArray
import org.json.JSONException
import org.json.JSONObject

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
  fun MissedCallNotificationOpenResult.toWritableMap(): WritableMap {
    val responseMap = Arguments.createMap()
    return responseMap.apply {
      when (callOptions) {
        is M2PCallOptions -> putMap("callOptions", (callOptions as M2PCallOptions).toWritableMap())
        is P2PCallOptions -> putMap("callOptions", (callOptions as P2PCallOptions).toWritableMap())
      }
      val actionMap = Arguments.createMap()
      actionMap.putString(Constants.KEY_ACTION_ID, action.actionID)
      actionMap.putString(Constants.KEY_ACTION_LABEL, action.actionLabel)
      this.putMap(Constants.KEY_ACTION, actionMap)
    }
  }

  /**
   * Adds Properties common to both P2P CallOptions and M2PCallOptions to a WritableMap.
   */
  @JvmStatic
  private fun SCCallOptions.toSCCallOptionsMap(): WritableMap {
    return Arguments.createMap().apply {
      putString("receiverCuid", receiverCuid)
      putString("callContext", callContext)

      customMetaData?.let { customMetaData ->
        putMap("customMetaData", Arguments.createMap().apply {
          putString("initiatorImage", customMetaData.initiatorImage)
          putString("receiverImage", customMetaData.receiverImage)
          putMap("customKeys", customMetaData.customKeys?.toWritableMap())
        })
      }
    }
  }

  private fun JSONObject.toWritableMap(): WritableMap {
    val writableMap = Arguments.createMap()

    val keys = this.keys()
    while (keys.hasNext()) {
      val key = keys.next()
      try {
        val value = this[key]

        when (value) {
          is String -> writableMap.putString(key, value)
          is Int -> writableMap.putInt(key, value)
          is Boolean -> writableMap.putBoolean(key, value)
          is Long -> writableMap.putDouble(key, value.toDouble())
          is Float, is Double -> writableMap.putDouble(key, (value as Number).toDouble())
          is JSONObject -> writableMap.putMap(key, value.toWritableMap())
          is JSONArray -> writableMap.putArray(key, value.toWritableArray())
          else -> {
            // Handle other possible cases if needed
          }
        }
      } catch (e: JSONException) {
        e.printStackTrace()
      }
    }
    return writableMap
  }


  private fun JSONArray.toWritableArray(): WritableArray {
    val writableArray = Arguments.createArray()

    for (i in 0 until this.length()) {
      try {
        val value = this[i]

        when (value) {
          is String -> writableArray.pushString(value)
          is Int -> writableArray.pushInt(value)
          is Boolean -> writableArray.pushBoolean(value)
          is Long -> writableArray.pushDouble(value.toDouble())
          is Float, is Double -> writableArray.pushDouble((value as Number).toDouble())
          is JSONObject -> writableArray.pushMap(value.toWritableMap())
          is JSONArray -> writableArray.pushArray(value.toWritableArray())
          else -> {
            // Handle other possible cases if needed
          }
        }
      } catch (e: JSONException) {
        e.printStackTrace()
      }
    }
    return writableArray
  }

  /**
   * Converts DTMFInput to a Map.
   *
   * @return A Map representation of DTMFInput.
   */
  @JvmStatic
  fun DTMFInput.toWritableMap(): WritableMap {
    return Arguments.createMap().apply {
      putString("inputIdentifier", inputIdentifier)
      putString("inputKey", inputKey.key.toString())
    }
  }


  /**
   * Converts M2PCallOptions to a Map.
   *
   * @return A Map representation of M2PCallOptions.
   */
  @JvmStatic
  fun M2PCallOptions.toWritableMap(): WritableMap {
    return this.toSCCallOptionsMap().apply {
      putString("campaignId", campaignId)
      putString("campaignEndTime", campaignEndTime)

      putArray("campaignLabelList", Arguments.createArray().apply {
        campaignLabelList?.forEach { label -> pushString(label) }
      })

      putArray("dtmfInputList", Arguments.createArray().apply {
        dtmfInputList?.forEach { dtmf -> pushMap(dtmf.toWritableMap()) }
      })
    }
  }

  /**
   * Converts P2PCallOptions to a Map.
   *
   * @return A Map representation of P2PCallOptions.
   */
  @JvmStatic
  fun P2PCallOptions.toWritableMap(): WritableMap {
    return this.toSCCallOptionsMap().apply {
      putString("initiatorCuid", initiatorCuid)
    }
  }


  /**
   * Converts SCCallStatusDetails to a Map.
   *
   * @return A Map representation of SCCallStatusDetails.
   */
  @JvmStatic
  fun SCCallStatusDetails.toWritableMap(): WritableMap {
    return Arguments.createMap().apply {
      putString("direction", direction.toString())
      putString("callType", callType.toString())
      when (callOptions) {
        is M2PCallOptions -> putMap("callOptions", (callOptions as M2PCallOptions).toWritableMap())
        is P2PCallOptions -> putMap("callOptions", (callOptions as P2PCallOptions).toWritableMap())
      }
      putString("callStatus", callStatus.status)
    }
  }
}
