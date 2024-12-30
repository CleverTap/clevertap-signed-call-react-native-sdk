package com.clevertap.rnsignedcallandroid

import android.content.Context
import com.clevertap.android.signedcall.init.SignedCallAPI
import com.clevertap.android.signedcall.interfaces.MissedCallNotificationOpenedHandler
import com.clevertap.android.signedcall.models.MissedCallNotificationOpenResult
import com.clevertap.rnsignedcallandroid.internal.Events
import com.clevertap.rnsignedcallandroid.internal.events.EventEmitter
import com.clevertap.rnsignedcallandroid.internal.handlers.MissedCallActionClickHandler
import com.clevertap.rnsignedcallandroid.internal.util.PayloadConverter.toWriteableMap
import com.clevertap.rnsignedcallandroid.internal.util.Utils.log

open class SignedCallOnCallStatusListener {

  companion object {

    @JvmStatic
    fun register(context: Context) {
      log(message = "SignedCallOnCallStatusListener is registered!")

      SignedCallAPI.getInstance().registerVoIPCallStatusListener { data ->
        log(message = "SignedCallOnCallStatusListener is invoked in killed state: $data")
        EventEmitter.emit(context, Events.ON_CALL_STATUS_CHANGED, data.toWriteableMap())
      }

      SignedCallAPI.getInstance().setMissedCallNotificationOpenedHandler { _, data ->
        log(message = "MissedCallNotificationOpenedHandler is invoked in killed state: $data")
        EventEmitter.emit(context, Events.ON_CALL_STATUS_CHANGED, data.toWriteableMap())
      }
    }
  }
}
