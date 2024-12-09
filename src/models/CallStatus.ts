import { SignedCallLogger } from '../utils/SignedCallLogger';

/**
 * Enum representing the possible statuses of a VoIP call
 */
enum CallStatus {
  // Indicates that the call is successfully placed
  CallIsPlaced = 'CallIsPlaced',

  // Indicates that the call is cancelled from the initiator's end
  Cancelled = 'Cancelled',

  // Indicates that the call is declined from the receiver's end
  Declined = 'Declined',

  // Indicates that the call is missed at the receiver's end
  Missed = 'Missed',

  // Indicates that the call is picked up by the receiver
  Answered = 'Answered',

  // Indicates that the connection to the receiver is established and the audio transfer begins at this state
  CallInProgress = 'CallInProgress',

  // Indicates that the call is over
  CallOver = 'CallOver',

  // Indicates that the callee is already busy on another call
  CalleeBusyOnAnotherCall = 'CalleeBusyOnAnotherCall',

  // Indicates that the call is declined due to the receiver being logged out with the specific CUID
  DeclinedDueToLoggedOutCuid = 'DeclinedDueToLoggedOutCuid',

  // [Specific to Android-Platform]
  // Indicates that the call is declined due to the notifications are disabled at the receiver's end.
  DeclinedDueToNotificationsDisabled = 'DeclinedDueToNotificationsDisabled',

  // Indicates that the microphone permission is not granted for the call.
  DeclinedDueToMicrophonePermissionsNotGranted = 'DeclinedDueToMicrophonePermissionsNotGranted',

  // Indicates that the campaign call is cancelled due to TTL is expired
  CallCancelledDueToTtlExpired = 'CallCancelledDueToTtlExpired',

  // Indicates that the call is cancelled due to ring-timeout at initiator's end
  CallCancelledDueToRingTimeout = 'CallCancelledDueToRingTimeout',

  // Indicates that the M2P call is cancelled by clicking on cancel CTA from campaign's notification
  CallCancelledDueToCampaignNotificationCancelled = 'CallCancelledDueToCampaignNotificationCancelled',

  // Indicates that a DTMF input is received from M2P keypad screen
  DTMFInputReceived = 'DTMFInputReceived',

  // Indicates that the call was declined due to user inititated click on cancel CTA of FCM notification
  UserInitaitedCallDeclinedOnCancelCTA = 'UserInitaitedCallDeclinedOnCancelCTA',
}

class CallStatusUtil {
  //Returns the enum value based on the passed event string
  static fromString(event: string): CallStatus {
    switch (event) {
      case 'CALL_IS_PLACED':
        return CallStatus.CallIsPlaced;
      case 'CALL_CANCELLED':
        return CallStatus.Cancelled;
      case 'CALL_DECLINED':
        return CallStatus.Declined;
      case 'CALL_MISSED':
        return CallStatus.Missed;
      case 'CALL_ANSWERED':
        return CallStatus.Answered;
      case 'CALL_IN_PROGRESS':
        return CallStatus.CallInProgress;
      case 'CALL_OVER':
        return CallStatus.CallOver;
      case 'CALLEE_BUSY_ON_ANOTHER_CALL':
        return CallStatus.CalleeBusyOnAnotherCall;
      case 'CALL_DECLINED_DUE_TO_LOGGED_OUT_CUID':
        return CallStatus.DeclinedDueToLoggedOutCuid;
      case 'CALL_DECLINED_DUE_TO_NOTIFICATIONS_DISABLED':
        return CallStatus.DeclinedDueToNotificationsDisabled;
      case 'CALLEE_MICROPHONE_PERMISSION_NOT_GRANTED':
        return CallStatus.DeclinedDueToMicrophonePermissionsNotGranted;
      case 'CALL_CANCELLED_DUE_TO_TTL_EXPIRED':
        return CallStatus.CallCancelledDueToTtlExpired;
      case `CALL_CANCELLED_DUE_TO_RING_TIMEOUT`:
        return CallStatus.CallCancelledDueToRingTimeout;
      case `CALL_CANCELLED_DUE_TO_CAMPAIGN_NOTIFICATION_CANCELLED`:
        return CallStatus.CallCancelledDueToCampaignNotificationCancelled;
      case `DTMF_INPUT_RECEIVED`:
        return CallStatus.DTMFInputReceived;
      case `USER_INITIATED_CALL_DECLINED_ON_CANCEL_CTA`:
        return CallStatus.UserInitaitedCallDeclinedOnCancelCTA;
      default:
        const errorMessage = `"${event}" is not a valid value for CallStatus.`;
        SignedCallLogger.debug({
          message: errorMessage,
        });
        throw new Error(errorMessage);
    }
  }
}

export { CallStatus, CallStatusUtil };
