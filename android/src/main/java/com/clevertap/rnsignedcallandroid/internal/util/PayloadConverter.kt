package com.clevertap.rnsignedcallandroid.internal.util

import com.clevertap.android.signedcall.enums.SCCallState
import com.clevertap.android.signedcall.enums.VoIPCallStatus
import com.clevertap.android.signedcall.exception.BaseException
import com.clevertap.android.signedcall.init.SignedCallAPI
import com.clevertap.android.signedcall.models.CallDetails
import com.clevertap.android.signedcall.models.MissedCallNotificationOpenResult
import com.clevertap.android.signedcall.models.SCCallStatusDetails
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap

/**
 * Contains parser methods to change the payload from one type to another.
 */
internal object PayloadConverter {

  /**
   * Parses the integer debug level to the [SignedCallAPI.LogLevel] type
   * @return - returns a parsed SCLogLevel value
   */
  fun Int.toSignedCallLogLevel(): Int {
    return when (this) {
      -1 -> SignedCallAPI.LogLevel.OFF
      0 -> SignedCallAPI.LogLevel.INFO
      2 -> SignedCallAPI.LogLevel.DEBUG
      3 -> SignedCallAPI.LogLevel.VERBOSE
      else -> throw IllegalStateException("Invalid value of debug level")
    }
  }

  /**
   * Parses the result of the initialization or call-attempt to a map
   * @return - returns a parsed WritableMap
   */
  @JvmStatic
  fun signedCallResponseToWritableMap(exception: BaseException?): WritableMap {
    val responseMap = Arguments.createMap()
    responseMap.putBoolean(Constants.KEY_IS_SUCCESSFUL, (exception == null))
    exception?.let {
      val errorMap = Arguments.createMap()
      errorMap.putInt(Constants.KEY_ERROR_CODE, exception.errorCode)
      errorMap.putString(Constants.KEY_ERROR_MESSAGE, exception.message)
      errorMap.putString(Constants.KEY_ERROR_DESCRIPTION, exception.explanation)
      responseMap.putMap(Constants.KEY_ERROR, errorMap)
    }
    return responseMap
  }

  /**
   * Parses the [MissedCallNotificationOpenResult] type to a map
   * @return - returns a parsed WritableMap
   */
  @JvmStatic
  fun MissedCallNotificationOpenResult.toWriteableMap(): WritableMap {
    val responseMap = Arguments.createMap()
    return responseMap.apply {
      val actionMap = Arguments.createMap()
      actionMap.putString(Constants.KEY_ACTION_ID, action.actionID)
      actionMap.putString(Constants.KEY_ACTION_LABEL, action.actionLabel)

      this.putMap(Constants.KEY_ACTION, actionMap)
      this.putMap(Constants.KEY_CALL_DETAILS, callDetails.toWriteableMap())
    }
  }

  /**
   * Converts SCCallStatusDetails to a Map.
   *
   * @return A Map representation of SCCallStatusDetails.
   */
  fun SCCallStatusDetails.toWriteableMap(): WritableMap {
    return Arguments.createMap().apply {
      this.putString("direction", direction.toString())
      this.putMap("callDetails", callDetails.toWriteableMap())
      this.putString("callEvent", callStatus.formattedCallEvent())
    }
  }

  /**
   * Converts [VoIPCallStatus] to a formatted string.
   *
   * @return A formatted call event string.
   */
  private fun VoIPCallStatus.formattedCallEvent(): String {
    return when (this) {
      VoIPCallStatus.CALL_IS_PLACED -> "CallIsPlaced"
      VoIPCallStatus.CALL_RINGING -> "Ringing"
      VoIPCallStatus.CALL_CANCELLED -> "Cancelled"
      VoIPCallStatus.CALL_DECLINED -> "Declined"
      VoIPCallStatus.CALL_MISSED -> "Missed"
      VoIPCallStatus.CALL_ANSWERED -> "Answered"
      VoIPCallStatus.CALL_IN_PROGRESS -> "CallInProgress"
      VoIPCallStatus.CALL_OVER -> "Ended"
      VoIPCallStatus.CALLEE_BUSY_ON_ANOTHER_CALL -> "ReceiverBusyOnAnotherCall"
      VoIPCallStatus.CALL_DECLINED_DUE_TO_LOGGED_OUT_CUID -> "DeclinedDueToLoggedOutCuid"
      VoIPCallStatus.CALL_DECLINED_DUE_TO_NOTIFICATIONS_DISABLED -> "DeclinedDueToNotificationsDisabled"
      VoIPCallStatus.CALLEE_MICROPHONE_PERMISSION_NOT_GRANTED -> "DeclinedDueToMicrophonePermissionsNotGranted"
      VoIPCallStatus.CALLEE_MICROPHONE_PERMISSION_BLOCKED -> "DeclinedDueToMicrophonePermissionBlocked"
      VoIPCallStatus.CALL_DECLINED_DUE_TO_BUSY_ON_VOIP -> "DeclinedDueToBusyOnVoIP"
      VoIPCallStatus.CALL_DECLINED_DUE_TO_BUSY_ON_PSTN -> "DeclinedDueToBusyOnPSTN"
      VoIPCallStatus.CALL_CANCELLED_DUE_TO_RING_TIMEOUT -> "CancelledDueToRingTimeout"
      VoIPCallStatus.APP_INITIATED_CALL_DECLINED_DUE_TO_NETWORK_QUALITY -> "AppInitiatedDeclinedDueToNetworkQuality"
      VoIPCallStatus.USER_INITIATED_CALL_DECLINED_ON_CANCEL_CTA -> "UserInitiatedDeclinedOnCancelCta"
      VoIPCallStatus.CALL_FAILED_DUE_TO_INTERNAL_ERROR -> "FailedDueToInternalError"
      VoIPCallStatus.CALL_OVER_DUE_TO_LOCAL_NETWORK_LOSS -> "EndedDueToLocalNetworkLoss"
      VoIPCallStatus.CALL_OVER_DUE_TO_REMOTE_NETWORK_LOSS -> "EndedDueToRemoteNetworkLoss"
      VoIPCallStatus.CALL_OVER_DUE_TO_PROTOCOL_MISMATCH -> "EndedDueToProtocolMismatch"
      VoIPCallStatus.CALL_OVER_DUE_TO_NETWORK_DELAY_IN_MEDIA_SETUP -> "EndedDueToNetworkDelayInMediaSetup"
      else -> this.name
    }
  }

  /**
   * Converts [SCCallState] to a formatted string.
   *
   * @return A formatted call state string.
   */
  fun SCCallState.formattedCallState(): String? {
    return when (this) {
      SCCallState.OUTGOING_CALL -> "OutgoingCall"
      SCCallState.INCOMING_CALL -> "IncomingCall"
      SCCallState.ONGOING_CALL -> "OngoingCall"
      SCCallState.CLEANUP_CALL -> "CleanupCall"
      SCCallState.NO_CALL -> "NoCall"
      else -> null
    }
  }

  /**
   * Converts CallDetails to a Map.
   *
   * @return A Map representation of CallDetails.
   */
  fun CallDetails.toWriteableMap(): WritableMap {
    return Arguments.createMap().apply {
      putString(Constants.KEY_CALL_ID, (callId))
      putString(Constants.KEY_CALLER_CUID, (callerCuid ?: ""))
      putString(Constants.KEY_CALLEE_CUID, (calleeCuid ?: ""))
      putString(Constants.KEY_CALL_CONTEXT, (callContext ?: ""))
      putString(Constants.KEY_CHANNEL, (channel.channelName ?: ""))
      putString(Constants.KEY_INITIATOR_IMAGE, initiatorImage)
      putString(Constants.KEY_RECEIVER_IMAGE, receiverImage)
      putString(Constants.KEY_REMOTE_CONTEXT, remoteContext)
    }
  }
}
