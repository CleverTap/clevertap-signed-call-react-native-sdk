package com.clevertap.rnsignedcallandroid.internal.util

import android.content.Context
import com.clevertap.android.signedcall.init.SignedCallInitConfiguration
import com.clevertap.android.signedcall.init.SignedCallInitConfiguration.FCMProcessingMode
import com.clevertap.android.signedcall.init.SignedCallInitConfiguration.SCSwipeOffBehaviour
import com.clevertap.android.signedcall.init.p2p.FCMProcessingNotification
import com.clevertap.android.signedcall.models.MissedCallAction
import com.clevertap.android.signedcall.models.SignedCallScreenBranding
import com.clevertap.rnsignedcallandroid.internal.util.Constants.DARK_THEME
import com.clevertap.rnsignedcallandroid.internal.util.Constants.KEY_ACCOUNT_ID
import com.clevertap.rnsignedcallandroid.internal.util.Constants.KEY_API_KEY
import com.clevertap.rnsignedcallandroid.internal.util.Constants.KEY_APP_ID
import com.clevertap.rnsignedcallandroid.internal.util.Constants.KEY_BG_COLOR
import com.clevertap.rnsignedcallandroid.internal.util.Constants.KEY_BUTTON_THEME
import com.clevertap.rnsignedcallandroid.internal.util.Constants.KEY_CANCEL_COUNTDOWN_COLOR
import com.clevertap.rnsignedcallandroid.internal.util.Constants.KEY_CUID
import com.clevertap.rnsignedcallandroid.internal.util.Constants.KEY_FCM_NOTIFICATION
import com.clevertap.rnsignedcallandroid.internal.util.Constants.KEY_FONT_COLOR
import com.clevertap.rnsignedcallandroid.internal.util.Constants.KEY_LOGO_URL
import com.clevertap.rnsignedcallandroid.internal.util.Constants.KEY_NAME
import com.clevertap.rnsignedcallandroid.internal.util.Constants.KEY_RINGTONE
import com.clevertap.rnsignedcallandroid.internal.util.Constants.KEY_SHOW_POWERED_BY_SIGNED_CALL
import com.clevertap.rnsignedcallandroid.internal.util.PushPrimerSerializer.parsePushPrimerConfigFromInitOptions
import com.clevertap.rnsignedcallandroid.internal.util.Utils.log
import com.facebook.react.bridge.*
import org.json.JSONObject

/**
 * Provides utility methods to serialize the initConfig's readableMap to some desired type.
 */
object InitConfigSerializer {
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
      val showPoweredBySignedCall: Boolean? = it.getValue(KEY_SHOW_POWERED_BY_SIGNED_CALL)
      val cancelCountdownColor: String? = it.getValue(KEY_CANCEL_COUNTDOWN_COLOR)

      val callScreenBranding = SignedCallScreenBranding.Builder()
        .setBgColor(bgColor)
        .setFontColor(fontColor)
        .setLogoUrl(logoUrl)
        .setCancelCountdownColor(cancelCountdownColor)

      if (buttonTheme != null) {
        callScreenBranding.setButtonTheme(
          if (DARK_THEME == buttonTheme)
            SignedCallScreenBranding.ButtonTheme.DARK
          else
            SignedCallScreenBranding.ButtonTheme.LIGHT
        )
      }

      if (showPoweredBySignedCall != null) {
        callScreenBranding.setShowPoweredBySignedCall(showPoweredBySignedCall)
      }

      return callScreenBranding.build()
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
   * Retrieves the swipeOffBehaviour from the given initProperties object and parses to the instance of [SCSwipeOffBehaviour]
   */
  @JvmStatic
  @Throws(Exception::class)
  fun getSwipeOffBehaviourFromReadableConfig(readableMap: ReadableMap): SCSwipeOffBehaviour {
    val swipeOffBehaviour: String? = readableMap.getValue(Constants.KEY_SWIPE_OFF_BEHAVIOUR_IN_FOREGROUND_SERVICE)
    swipeOffBehaviour?.let {
      return if (it == "EndCall") {
        SCSwipeOffBehaviour.END_CALL
      } else {
        SCSwipeOffBehaviour.PERSIST_CALL
      }
    } ?: run {
      return SCSwipeOffBehaviour.END_CALL
    }
  }

  /**
   * Retrieves the FCMProcessingMode from the given initProperties object and parses to the instance of [FCMProcessingMode]
   */
  private fun parseFCMProcessingModeFromReadableConfig(readableMap: ReadableMap): FCMProcessingMode {
    val fcmProcessingMode: String? = readableMap.getValue(Constants.KEY_FCM_PROCESSING_MODE)
    fcmProcessingMode?.let {
      return if (it == "foreground") {
        FCMProcessingMode.FOREGROUND
      } else {
        FCMProcessingMode.BACKGROUND
      }
    } ?: run {
      return FCMProcessingMode.BACKGROUND
    }
  }

  /**
   * Retrieves the FCMProcessingNotification from the given initProperties object and parses to the instance of [FCMProcessingNotification]
   */
  @JvmStatic
  @Throws(Exception::class)
  fun parseFCMProcessingNotificationFromInitOptions(readableMap: ReadableMap, context: Context): FCMProcessingNotification? {
    val fcmProcessingNotification: ReadableMap? = readableMap.getValue(KEY_FCM_NOTIFICATION)
    fcmProcessingNotification?.let {
      val title: String? = it.getValue(Constants.KEY_FCM_NOTIFICATION_TITLE)
      val subTitle: String? = it.getValue(Constants.KEY_FCM_NOTIFICATION_SUBTITLE)
      val cancelCtaLabel: String? = it.getValue(Constants.KEY_FCM_NOTIFICATION_CANCEL_CTA_LABEL)
      val largeIcon: String? = it.getValue(Constants.KEY_FCM_NOTIFICATION_LARGE_ICON)

      val largeIconResourceId = largeIcon?.let {
        context.resources.getIdentifier(it, "drawable", context.packageName)
      } ?: 0

      return FCMProcessingNotification.Builder(title, subTitle)
        .setLargeIcon(largeIconResourceId)
        .setCancelCtaLabel(cancelCtaLabel)
        .build()
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
  fun getInitConfigFromReadableMap(readableMap: ReadableMap, context: Context): SignedCallInitConfiguration? {
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

        val pushPrimerReadableConfig: ReadableMap? = readableMap.getValue(Constants.KEY_PROMPT_PUSH_PRIMER)
        val pushPrimerJson: JSONObject? = pushPrimerReadableConfig?.let {
          parsePushPrimerConfigFromInitOptions(pushPrimerReadableConfig)
        }

        val notificationPermissionRequired: Boolean = getValue(Constants.KEY_NOTIFICATION_PERMISSION_REQUIRED) ?: true

        val callScreenOnSignalling = getValue(Constants.KEY_CALL_SCREEN_ON_SIGNALLING) ?: false

        val swipeOffBehaviour: SCSwipeOffBehaviour = getSwipeOffBehaviourFromReadableConfig(readableMap)

        val fcmProcessingMode: FCMProcessingMode = parseFCMProcessingModeFromReadableConfig(readableMap)

        val fcmProcessingNotification: FCMProcessingNotification? =
          parseFCMProcessingNotificationFromInitOptions(readableMap, context)

        initConfiguration =
          SignedCallInitConfiguration.Builder(initOptions, allowPersistSocketConnection)
            .promptPushPrimer(pushPrimerJson)
            .promptReceiverReadPhoneStatePermission(promptReceiverReadPhoneStatePermission)
            .setNotificationPermissionRequired(notificationPermissionRequired)
            .callScreenOnSignalling(callScreenOnSignalling)
            .overrideDefaultBranding(callScreenBranding)
            .setMissedCallActions(missedCallActionsList)
            .setSwipeOffBehaviourInForegroundService(swipeOffBehaviour)
            .setFCMProcessingMode(fcmProcessingMode, fcmProcessingNotification)
            .build()
      } catch (throwable: Throwable) {
        log(message = "issue occurs while de-serializing the initProperties: ${throwable.localizedMessage}")
        throwable.printStackTrace()
        throw throwable
      }
      return initConfiguration
    }
  }
}

