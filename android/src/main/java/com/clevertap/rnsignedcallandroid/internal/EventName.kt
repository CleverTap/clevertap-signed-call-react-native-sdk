package com.clevertap.rnsignedcallandroid.internal

import androidx.annotation.StringDef

object Constants {
  const val ON_CALL_STATUS_CHANGED = "SignedCallOnCallStatusChanged"
  const val ON_MISSED_CALL_ACTION_CLICKED = "SignedCallOnMissedCallActionClicked"
}

@StringDef(Constants.ON_CALL_STATUS_CHANGED, Constants.ON_MISSED_CALL_ACTION_CLICKED)
@Retention(AnnotationRetention.SOURCE)
annotation class EventName
