package com.clevertap.rnsignedcallandroid.internal.util

import com.clevertap.android.signedcall.init.SignedCallInitConfiguration
import com.clevertap.android.signedcall.models.MissedCallAction
import com.clevertap.android.signedcall.models.SignedCallScreenBranding
import com.clevertap.rnsignedcallandroid.internal.handlers.MissedCallActionClickHandler
import com.clevertap.rnsignedcallandroid.internal.util.Constants.DARK_THEME
import com.clevertap.rnsignedcallandroid.internal.util.Constants.KEY_ACCOUNT_ID
import com.clevertap.rnsignedcallandroid.internal.util.Constants.KEY_API_KEY
import com.clevertap.rnsignedcallandroid.internal.util.Constants.KEY_APP_ID
import com.clevertap.rnsignedcallandroid.internal.util.Constants.KEY_BG_COLOR
import com.clevertap.rnsignedcallandroid.internal.util.Constants.KEY_BUTTON_THEME
import com.clevertap.rnsignedcallandroid.internal.util.Constants.KEY_CUID
import com.clevertap.rnsignedcallandroid.internal.util.Constants.KEY_FONT_COLOR
import com.clevertap.rnsignedcallandroid.internal.util.Constants.KEY_LOGO_URL
import com.clevertap.rnsignedcallandroid.internal.util.Constants.KEY_NAME
import com.clevertap.rnsignedcallandroid.internal.util.Constants.KEY_RINGTONE
import com.clevertap.rnsignedcallandroid.internal.util.Utils.log
import com.facebook.react.bridge.*
import org.json.JSONObject

/**
 * Provides utility methods to serialize the ReadableMap to some desired type.
 */
object Serializer {
  /**
   * Retrieves the initOptions details from the readableMap of initProperties and parses into a JSONObject
   */
  @JvmStatic
  @Throws(Exception::class)
  fun getInitOptionsFromReadableConfig(initProperties: ReadableMap): JSONObject {
    initProperties.run {
      val accountId: String? = getValue(KEY_ACCOUNT_ID)
      val apiKey: String? = getValue(KEY_API_KEY)
      val cuid: String? = getValue(KEY_CUID)
      val appId: String? = getValue(KEY_APP_ID)
      val name: String? = getValue(KEY_NAME)
      val ringtone: String? = getValue(KEY_RINGTONE)

      val initOptionsJson = JSONObject()
      return initOptionsJson.apply {
        put(KEY_ACCOUNT_ID, accountId)
        put(KEY_API_KEY, apiKey)
        put(KEY_CUID, cuid)
        put(KEY_APP_ID, appId)
        put(KEY_NAME, name)
        put(KEY_RINGTONE, ringtone)
      }
    }
  }

  /**
   * Retrieves the branding details from the input initProperties object and
   * parses into the [SignedCallScreenBranding] object
   */
  @JvmStatic
  @Throws(Exception::class)
  fun getBrandingFromReadableMap(readableMap: ReadableMap): SignedCallScreenBranding? {
    val brandingMap: ReadableMap? = readableMap.getValue(Constants.KEY_OVERRIDE_DEFAULT_BRANDING)
    brandingMap?.let {
      val bgColor: String? = it.getValue(KEY_BG_COLOR)
      val fontColor: String? = it.getValue(KEY_FONT_COLOR)
      val logoUrl: String? = it.getValue(KEY_LOGO_URL)
      val buttonTheme: String? = it.getValue(KEY_BUTTON_THEME)

      return SignedCallScreenBranding(
        bgColor,
        fontColor,
        logoUrl,
        if (buttonTheme == DARK_THEME) SignedCallScreenBranding.ButtonTheme.DARK
        else SignedCallScreenBranding.ButtonTheme.LIGHT
      )
    } ?: run {
      return null
    }
  }

  /**
   * Retrieves the missed call actions from the input initProperties object and
   * parses into the list of [MissedCallAction]
   */
  @JvmStatic
  @Throws(Exception::class)
  fun getMissedCallActionsFromReadableConfig(readableMap: ReadableMap): List<MissedCallAction>? {
    val missedCallActionMap: ReadableMap? = readableMap.getValue(Constants.KEY_MISSED_CALL_ACTIONS)
    missedCallActionMap?.let { map ->
      return map.toHashMap().toList().map {
        MissedCallAction(
          it.first, it.second as String?
        )
      }
    } ?: run {
      return null
    }
  }

  /**
   * Retrieves the initConfiguration from the input initProperties object and
   * parses into the [SignedCallInitConfiguration] object.
   */
  @JvmStatic
  @Throws(Throwable::class)
  fun getInitConfigFromReadableMap(readableMap: ReadableMap): SignedCallInitConfiguration? {
    var initConfiguration: SignedCallInitConfiguration? = null
    readableMap.run {
      try {
        val initOptions: JSONObject = getInitOptionsFromReadableConfig(readableMap)

        val allowPersistSocketConnection: Boolean =
          getValue(Constants.KEY_ALLOW_PERSIST_SOCKET_CONNECTION) ?: throw IllegalArgumentException(
            "allowPersistSocketConnection field is required"
          )

        val promptReceiverReadPhoneStatePermission: Boolean =
          getValue(Constants.KEY_PROMPT_RECEIVER_READ_PHONE_STATE_PERMISSION) ?: false

        val callScreenBranding: SignedCallScreenBranding? = getBrandingFromReadableMap(readableMap)

        val missedCallActionsList: List<MissedCallAction>? =
          getMissedCallActionsFromReadableConfig(readableMap)

        val missedCallActionClickHandlerPath: String? =
          MissedCallActionClickHandler::class.java.canonicalName

        initConfiguration =
          SignedCallInitConfiguration.Builder(initOptions, allowPersistSocketConnection)
            .promptReceiverReadPhoneStatePermission(promptReceiverReadPhoneStatePermission)
            .overrideDefaultBranding(callScreenBranding)
            .setMissedCallActions(missedCallActionsList, missedCallActionClickHandlerPath).build()
      } catch (throwable: Throwable) {
        log(message = "issue occurs while de-serializing the initProperties: ${throwable.localizedMessage}")
        throwable.printStackTrace()
        throw throwable
      }
      return initConfiguration
    }
  }
}

