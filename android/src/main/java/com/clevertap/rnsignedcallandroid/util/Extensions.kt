package com.clevertap.rnsignedcallandroid.util

import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.ReadableType

fun ReadableMap.hasKeyWithType(key: String, type: ReadableType): Boolean {
  return this.hasKey(key) && this.getType(key) == type
}

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
    else -> throw IllegalArgumentException("Invalid type of $key. Please refer integration documentation for valid type")
  }
}
