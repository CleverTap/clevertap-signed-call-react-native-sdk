package com.clevertap.rnsignedcallandroid.internal.util

import com.clevertap.android.sdk.inapp.CTLocalInApp
import com.clevertap.rnsignedcallandroid.internal.util.Utils.log
import com.facebook.react.bridge.ReadableMap
import org.json.JSONObject

object PushPrimerSerializer {
  /**
   * Retrieves the Push Primer configuration from the input initProperties object and
   * converts to the localInAppJsonConfig.
   */
  fun parsePushPrimerConfigFromInitOptions(pushPrimerConfig: ReadableMap): JSONObject {
    var inAppType: CTLocalInApp.InAppType? = null
    var titleText: String? = null
    var messageText: String? = null
    var positiveBtnText: String? = null
    var negativeBtnText: String? = null
    var backgroundColor: String? = null
    var btnBorderColor: String? = null
    var titleTextColor: String? = null
    var messageTextColor: String? = null
    var btnTextColor: String? = null
    var imageUrl: String? = null
    var btnBackgroundColor: String? = null
    var btnBorderRadius: String? = null
    var fallbackToSettings = false
    var followDeviceOrientation = false
    for ((configKey, value) in pushPrimerConfig.toHashMap()) {
      try {
        if ("inAppType" == configKey) {
          inAppType = inAppTypeFromString(value as String)
        }
        if ("titleText" == configKey) {
          titleText = value as String
        }
        if ("messageText" == configKey) {
          messageText = value as String
        }
        if ("followDeviceOrientation" == configKey) {
          followDeviceOrientation = value as Boolean
        }
        if ("positiveBtnText" == configKey) {
          positiveBtnText = value as String
        }
        if ("negativeBtnText" == configKey) {
          negativeBtnText = value as String
        }
        if ("fallbackToSettings" == configKey) {
          fallbackToSettings = value as Boolean
        }
        if ("backgroundColor" == configKey) {
          backgroundColor = value as String
        }
        if ("btnBorderColor" == configKey) {
          btnBorderColor = value as String
        }
        if ("titleTextColor" == configKey) {
          titleTextColor = value as String
        }
        if ("messageTextColor" == configKey) {
          messageTextColor = value as String
        }
        if ("btnTextColor" == configKey) {
          btnTextColor = value as String
        }
        if ("imageUrl" == configKey) {
          imageUrl = value as String
        }
        if ("btnBackgroundColor" == configKey) {
          btnBackgroundColor = value as String
        }
        if ("btnBorderRadius" == configKey) {
          btnBorderRadius = value as String
        }
      } catch (t: Throwable) {
        throw IllegalArgumentException("Invalid parameters in LocalInApp config:" + t.localizedMessage)
      }
    }

    //creates the builder instance of localInApp with all the required parameters
    val builderWithRequiredParams: CTLocalInApp.Builder.Builder6 =
      getLocalInAppBuilderWithRequiredParam(
        inAppType, titleText, messageText, followDeviceOrientation, positiveBtnText,
        negativeBtnText
      )

    //adds the optional parameters to the builder instance
    if (backgroundColor != null) {
      builderWithRequiredParams.setBackgroundColor(backgroundColor)
    }
    if (btnBorderColor != null) {
      builderWithRequiredParams.setBtnBorderColor(btnBorderColor)
    }
    if (titleTextColor != null) {
      builderWithRequiredParams.setTitleTextColor(titleTextColor)
    }
    if (messageTextColor != null) {
      builderWithRequiredParams.setMessageTextColor(messageTextColor)
    }
    if (btnTextColor != null) {
      builderWithRequiredParams.setBtnTextColor(btnTextColor)
    }
    if (imageUrl != null) {
      builderWithRequiredParams.setImageUrl(imageUrl)
    }
    if (btnBackgroundColor != null) {
      builderWithRequiredParams.setBtnBackgroundColor(btnBackgroundColor)
    }
    if (btnBorderRadius != null) {
      builderWithRequiredParams.setBtnBorderRadius(btnBorderRadius)
    }
    builderWithRequiredParams.setFallbackToSettings(fallbackToSettings)
    val localInAppConfig: JSONObject = builderWithRequiredParams.build()
    log(message = "LocalInAppConfig for push primer prompt: $localInAppConfig")
    return localInAppConfig
  }

  /**
   * Creates an instance of the [CTLocalInApp.Builder.Builder6] with the required parameters.
   *
   * @return the [CTLocalInApp.Builder.Builder6] instance
   */
  private fun getLocalInAppBuilderWithRequiredParam(
    inAppType: CTLocalInApp.InAppType?,
    titleText: String?, messageText: String?,
    followDeviceOrientation: Boolean, positiveBtnText: String?,
    negativeBtnText: String?
  ): CTLocalInApp.Builder.Builder6 {

    //throws exception if any of the required parameter is missing
    if (inAppType == null || titleText == null || messageText == null || positiveBtnText == null || negativeBtnText == null) {
      throw IllegalArgumentException("Mandatory parameters are missing for LocalInApp config")
    }
    val builder: CTLocalInApp.Builder = CTLocalInApp.builder()
    return builder.setInAppType(inAppType)
      .setTitleText(titleText)
      .setMessageText(messageText)
      .followDeviceOrientation(followDeviceOrientation)
      .setPositiveBtnText(positiveBtnText)
      .setNegativeBtnText(negativeBtnText)
  }

  private fun inAppTypeFromString(inAppType: String?): CTLocalInApp.InAppType? {
    return if (inAppType == null) {
      null
    } else when (inAppType) {
      "half-interstitial" -> CTLocalInApp.InAppType.HALF_INTERSTITIAL
      "alert" -> CTLocalInApp.InAppType.ALERT
      else -> null
    }
  }
}
