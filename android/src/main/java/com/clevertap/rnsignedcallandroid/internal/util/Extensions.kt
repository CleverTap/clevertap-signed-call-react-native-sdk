package com.clevertap.rnsignedcallandroid.internal.util

import com.facebook.react.bridge.*
import org.json.JSONArray
import org.json.JSONException
import org.json.JSONObject

inline fun <reified T> ReadableMap.getValue(key: String): T? {
  if (!this.hasKey(key)) {
    return null
  }
  return when (this.getType(key)) {
    ReadableType.Null -> null
    ReadableType.Boolean -> this.getBoolean(key) as T
    ReadableType.Number -> this.getDouble(key) as T
    ReadableType.String -> this.getString(key) as T
    ReadableType.Map -> this.getMap(key) as T
    ReadableType.Array -> this.getArray(key) as T
    else -> throw IllegalArgumentException("Invalid type of $key. Please refer integration documentation for the valid type")
  }
}

fun ReadableMap.toJson(): JSONObject {
  val jsonObject = JSONObject()
  val iterator = this.keySetIterator()
  while (iterator.hasNextKey()) {
    val key = iterator.nextKey()
    when (this.getType(key)) {
      ReadableType.Null -> jsonObject.put(key, JSONObject.NULL)
      ReadableType.Boolean -> jsonObject.put(key, this.getBoolean(key))
      ReadableType.Number -> jsonObject.put(key, this.getDouble(key))
      ReadableType.String -> jsonObject.put(key, this.getString(key))
      ReadableType.Map -> jsonObject.put(key, (this.getMap(key))?.toJson())
      //ReadableType.Array is not supported in any of Signed Call parameter hence would be an invalid type.
      else -> throw IllegalArgumentException("Invalid type of $key. Please refer integration documentation for the valid type")
    }
  }
  return jsonObject
}

@Throws(JSONException::class)
fun JSONObject.convertJsonToMap(): WritableMap {
  val map: WritableMap = WritableNativeMap()
  val iterator = this.keys()
  while (iterator.hasNext()) {
    val key = iterator.next()
    when (val value = this[key]) {
      is JSONObject -> {
        map.putMap(key, this.convertJsonToMap())
      }
      is JSONArray -> {
        map.putArray(key, convertJsonToArray(value))
      }
      is Boolean -> {
        map.putBoolean(key, value)
      }
      is Int -> {
        map.putInt(key, value)
      }
      is Double -> {
        map.putDouble(key, value)
      }
      is String -> {
        map.putString(key, value)
      }
      else -> {
        map.putString(key, value.toString())
      }
    }
  }
  return map
}

@Throws(JSONException::class)
fun convertJsonToArray(jsonArray: JSONArray): WritableArray {
  val array: WritableArray = WritableNativeArray()
  for (i in 0 until jsonArray.length()) {
    val value = jsonArray[i]
    if (value is JSONObject) {
      array.pushMap(value.convertJsonToMap())
    } else if (value is JSONArray) {
      array.pushArray(convertJsonToArray(value))
    } else if (value is Boolean) {
      array.pushBoolean(value)
    } else if (value is Int) {
      array.pushInt(value)
    } else if (value is Double) {
      array.pushDouble(value)
    } else if (value is String) {
      array.pushString(value)
    } else {
      array.pushString(value.toString())
    }
  }
  return array
}
