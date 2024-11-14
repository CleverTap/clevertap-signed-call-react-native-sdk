package com.clevertap.rnsignedcallandroid.internal

import androidx.annotation.StringDef

/**
 * Defines the list of events to be published to the typescript/javascript observers of this package
 */
object Events {
  const val ON_CALL_STATUS_CHANGED = "SignedCallOnCallStatusChanged"
  const val ON_MISSED_CALL_ACTION_CLICKED = "SignedCallOnMissedCallActionClicked"
}

@StringDef(Events.ON_CALL_STATUS_CHANGED, Events.ON_MISSED_CALL_ACTION_CLICKED)
@Retention(AnnotationRetention.SOURCE)
annotation class EventName
