package com.clevertap.rnsignedcallandroid.util

import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.ReadableType
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
