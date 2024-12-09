package com.clevertap.rnsignedcallandroid.internal.handlers

import android.content.Context
import android.util.Log
import com.clevertap.android.signedcall.interfaces.MissedCallNotificationOpenedHandler
import com.clevertap.android.signedcall.models.MissedCallNotificationOpenResult
import com.clevertap.rnsignedcallandroid.internal.Events.ON_MISSED_CALL_ACTION_CLICKED
import com.clevertap.rnsignedcallandroid.internal.events.EventEmitter
import com.clevertap.rnsignedcallandroid.internal.util.Constants.LOG_TAG
import com.clevertap.rnsignedcallandroid.internal.util.PayloadConverter.toWritableMap
import com.clevertap.rnsignedcallandroid.internal.util.Utils

/**
 * Missed Call CTA handler for SignedCall Missed Call Notifications
 */
internal class MissedCallActionClickHandler : MissedCallNotificationOpenedHandler {

  /**
   * Gets called from the SC SDK when the user taps on the missed call CTA
   *
   * @param context - the app context
   * @param result  a [MissedCallNotificationOpenResult] object having call related details
   */
  override fun onMissedCallNotificationOpened(
    context: Context, result: MissedCallNotificationOpenResult
  ) {
    try {
      Utils.log(
        message = """
                    Missed call action button clicked!
                    Streaming to event-channel with payload:
                    Action ID: ${result.action.actionID},
                    Call Type: ${result.callType},
                    Action Label: ${result.action.actionLabel},
                    Context of Call: ${result.callOptions.callContext},
                    Receiver CUID: ${result.callOptions.receiverCuid},
                    Initiator Image: ${result.callOptions.customMetaData?.initiatorImage},
                    Receiver Image: ${result.callOptions.customMetaData?.receiverImage},
                    Custom Keys: ${result.callOptions.customMetaData?.customKeys.toString()}
                """.trimIndent()
      )

      EventEmitter.emit(context, ON_MISSED_CALL_ACTION_CLICKED, result.toWritableMap())
    } catch (e: Exception) {
      Log.d(LOG_TAG, "Exception while handling missed call CTA action, " + e.localizedMessage)
    }
  }
}
