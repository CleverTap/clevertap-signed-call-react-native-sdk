package com.clevertap.rnsignedcallandroid

import android.content.Context
import com.clevertap.android.signedcall.init.SignedCallAPI
import com.clevertap.rnsignedcallandroid.internal.Events
import com.clevertap.rnsignedcallandroid.internal.events.EventEmitter
import com.clevertap.rnsignedcallandroid.internal.util.Utils.log

open class SCBackgroundCallEventHandler {

  companion object {

    @JvmStatic
    fun initialize(context: Context) {
      log(message = "SCBackgroundCallEventHandler is initialized!")

      SignedCallAPI.getInstance().registerVoIPCallStatusListener { data ->
        log(message = "SCBackgroundCallEventHandler is invoked with payload: $data")
        EventEmitter.emit(context, Events.ON_CALL_STATUS_CHANGED, data)
      }
    }
  }
}
