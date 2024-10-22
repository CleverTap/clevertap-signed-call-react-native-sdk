package com.clevertap.rnsignedcallandroid.internal

import androidx.annotation.StringDef

/**
 * Defines the list of events to be published to the typescript/javascript observers of this package
 */
object Events {
  const val ON_CALL_STATUS_CHANGED = "SignedCallOnCallStatusChanged"
  const val ON_MISSED_CALL_ACTION_CLICKED = "SignedCallOnMissedCallActionClicked"
  const val ON_M2P_NOTIFICATION_CLICKED = "SignedCallOnM2PNotificationClicked"
  const val ON_M2P_NOTIFICATION_CANCEL_CTA_CLICKED = "SignedCallOnM2PNotificationCancelCtaClicked"
}

@StringDef(Events.ON_CALL_STATUS_CHANGED, Events.ON_MISSED_CALL_ACTION_CLICKED, Events.ON_M2P_NOTIFICATION_CLICKED, Events.ON_M2P_NOTIFICATION_CANCEL_CTA_CLICKED)
@Retention(AnnotationRetention.SOURCE)
annotation class EventName
