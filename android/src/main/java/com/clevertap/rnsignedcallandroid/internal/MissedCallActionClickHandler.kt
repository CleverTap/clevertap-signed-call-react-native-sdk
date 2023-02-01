package com.clevertap.rnsignedcallandroid.internal

import android.content.Context
import android.util.Log
import com.clevertap.android.signedcall.interfaces.MissedCallNotificationOpenedHandler
import com.clevertap.android.signedcall.models.MissedCallNotificationOpenResult
import com.clevertap.rnsignedcallandroid.util.Constants.LOG_TAG
import com.clevertap.rnsignedcallandroid.util.Utils

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
    context: Context,
    result: MissedCallNotificationOpenResult
  ) {
    try {
      Utils.log(
        message = "Missed call action button clicked!" +
          " Streaming to event-channel with payload: \n actionID: " + result.action.actionID
          + ", actionLabel: " + result.action.actionLabel
          + ", context of call: " + result.callDetails.callContext
          + ", cuid of caller: " + result.callDetails.callerCuid
          + ", cuid of callee: " + result.callDetails.calleeCuid
      )

      //Sends the real-time changes in the call-state in an observable event-stream
      //MissedCallActionEventStreamHandler.eventSink?.success(result.toMap())
    } catch (e: Exception) {
      Log.d(LOG_TAG, "Exception while handling missed call CTA action, " + e.localizedMessage)
    }
  }
}
