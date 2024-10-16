package com.clevertap.rnsignedcallandroid.internal.util

import com.clevertap.android.signedcall.init.SignedCallInitConfiguration
import com.clevertap.android.signedcall.init.m2p.M2PConfiguration
import com.clevertap.android.signedcall.init.m2p.M2PNotification
import com.clevertap.android.signedcall.interfaces.M2PCancelCtaClickListener
import com.clevertap.android.signedcall.interfaces.M2PNotificationClickListener
import com.clevertap.android.signedcall.models.MissedCallAction
import com.clevertap.android.signedcall.models.SignedCallScreenBranding
import com.clevertap.rnsignedcallandroid.internal.Events.ON_M2P_NOTIFICATION_CANCEL_CTA_CLICKED
import com.clevertap.rnsignedcallandroid.internal.Events.ON_M2P_NOTIFICATION_CLICKED
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
import com.clevertap.rnsignedcallandroid.internal.util.Constants.KEY_SHOW_POWERED_BY_SIGNED_CALL
import com.clevertap.rnsignedcallandroid.internal.events.EventEmitter
import com.clevertap.rnsignedcallandroid.internal.util.PayloadConverter.toWritableMap
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

      val callScreenBranding = SignedCallScreenBranding(
        bgColor,
        fontColor,
        logoUrl,
        if (buttonTheme == DARK_THEME) SignedCallScreenBranding.ButtonTheme.DARK
        else SignedCallScreenBranding.ButtonTheme.LIGHT
      )
      if (showPoweredBySignedCall != null) {
        callScreenBranding.showPoweredBySignedCall = showPoweredBySignedCall
      }
      return callScreenBranding
    } ?: run {
      return null
    }
  }

  @JvmStatic
  @Throws(Exception::class)
  fun getM2PConfigurationFromReadableMap(readableMap: ReadableMap): M2PConfiguration? {
    val m2pNotificationClickListener = M2PNotificationClickListener { context, m2pCallOptions ->
      EventEmitter.emit(
        context,
        ON_M2P_NOTIFICATION_CLICKED,
        m2pCallOptions.toWritableMap())
    }

    val m2pCancelCtaClickListener = M2PCancelCtaClickListener { context, m2pCallOptions ->
      EventEmitter.emit(
        context,
        ON_M2P_NOTIFICATION_CANCEL_CTA_CLICKED,
        m2pCallOptions.toWritableMap()
      )
    }


    // Extract values from the ReadableMap using appropriate getters
    val title = readableMap.getString(Constants.KEY_TITLE)
    val subTitle = readableMap.getString(Constants.KEY_SUB_TITLE)
    val largeIcon : Int? = readableMap.getValue(Constants.KEY_LARGE_ICON)
    val cancelCtaLabel = readableMap.getString(Constants.KEY_CANCEL_CTA_LABEL)

    // Initialize M2PNotification with extracted values
    val m2pNotification = M2PNotification(title, subTitle).apply {
      if(largeIcon != null)
        this.largeIcon = largeIcon
      this.cancelCtaLabel = cancelCtaLabel
    }

    m2pNotification.registerClickListener(m2pNotificationClickListener)
    m2pNotification.registerCancelCtaClickListener(m2pCancelCtaClickListener)

    // Build M2PConfiguration and return
    return M2PConfiguration.Builder(m2pNotification).build()
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

        val pushPrimerReadableConfig: ReadableMap? =
          readableMap.getValue(Constants.KEY_PROMPT_PUSH_PRIMER)
        val pushPrimerJson: JSONObject? = pushPrimerReadableConfig?.let {
          parsePushPrimerConfigFromInitOptions(pushPrimerReadableConfig)
        }

        val m2PConfigurationReadableMap: ReadableMap? =
          readableMap.getValue(Constants.KEY_M2P_CONFIGURATION)
        val m2PConfiguration = m2PConfigurationReadableMap?.let {
          getM2PConfigurationFromReadableMap(m2PConfigurationReadableMap)
        }

        initConfiguration =
          SignedCallInitConfiguration.Builder(initOptions, allowPersistSocketConnection)
            .promptPushPrimer(pushPrimerJson)
            .setM2PConfiguration(m2PConfiguration)
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

