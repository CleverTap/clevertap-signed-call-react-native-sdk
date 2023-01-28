package com.clevertap.rnsignedcallandroid.util

import android.annotation.SuppressLint
import android.util.Log
import com.clevertap.android.signedcall.exception.CallException
import com.clevertap.android.signedcall.exception.InitException
import com.clevertap.android.signedcall.init.SignedCallAPI
import com.clevertap.android.signedcall.models.MissedCallAction
import com.clevertap.android.signedcall.models.SignedCallScreenBranding
import com.clevertap.rnsignedcallandroid.util.Constants.DARK_THEME
import com.clevertap.rnsignedcallandroid.util.Constants.KEY_BG_COLOR
import com.clevertap.rnsignedcallandroid.util.Constants.KEY_BUTTON_THEME
import com.clevertap.rnsignedcallandroid.util.Constants.KEY_FONT_COLOR
import com.clevertap.rnsignedcallandroid.util.Constants.KEY_LOGO_URL
import com.clevertap.rnsignedcallandroid.util.Constants.LOG_TAG

object Utils {

    @SuppressLint("RestrictedApi")
    @JvmStatic
    fun log(tag:String = LOG_TAG, message: String) {
        when(SignedCallAPI.getDebugLevel()) {
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

    /**
     * Parses the initialization or call exception to a map by populating errorCode,
     * message and explanation of the exception.
     */
    @JvmStatic
    fun parseExceptionToMapObject(exception: Any): HashMap<String, Any> {
        val error = if (exception is InitException) exception else exception as CallException
        val errorMap = HashMap<String, Any>()
        errorMap[Constants.KEY_ERROR_CODE] = error.errorCode
        errorMap[Constants.KEY_ERROR_MESSAGE] = error.message!!
        errorMap[Constants.KEY_ERROR_DESCRIPTION] = error.explanation
        return errorMap
    }


    /**
     * Retrieves the branding details from the input initProperties object and
     * parses into the [SignedCallScreenBranding] object
     */
    @JvmStatic
    @Throws(Exception::class)
    fun parseBrandingFromInitOptions(brandingMap: Map<*, *>): SignedCallScreenBranding {
        val bgColor = brandingMap[KEY_BG_COLOR] as String
        val fontColor = brandingMap[KEY_FONT_COLOR] as String
        val logoUrl = brandingMap[KEY_LOGO_URL] as String
        val buttonTheme = brandingMap[KEY_BUTTON_THEME] as String

        return SignedCallScreenBranding(
            bgColor, fontColor, logoUrl,
            if (buttonTheme == DARK_THEME)
                SignedCallScreenBranding.ButtonTheme.DARK
            else
                SignedCallScreenBranding.ButtonTheme.LIGHT
        )
    }

    /**
     * Retrieves the missed call actions from the input initProperties object and
     * parses into the list of [MissedCallAction]
     */
    @JvmStatic
    @Throws(Exception::class)
    fun parseMissedCallActionsFromInitOptions(missedCallActionsMap: Map<*, *>): List<MissedCallAction> {
        return missedCallActionsMap.toList().map {
            MissedCallAction(
                it.first as String?,
                it.second as String?
            )
        }
    }
}

