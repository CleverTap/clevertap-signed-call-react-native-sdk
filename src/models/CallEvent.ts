import { SignedCallLogger } from '../utils/SignedCallLogger';

/**
 * Enum representing the possible statuses of a VoIP call
 */
enum CallEvent {
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

  // Indicates that the call has been ended.
  Ended = 'Ended',

  // Indicates that the receiver is already busy on another call
  ReceiverBusyOnAnotherCall = 'ReceiverBusyOnAnotherCall',

  // Indicates that the call is declined due to the receiver being logged out with the specific CUID
  DeclinedDueToLoggedOutCuid = 'DeclinedDueToLoggedOutCuid',

  // [Specific to Android-Platform]
  // Indicates that the call is declined due to the notifications are disabled at the receiver's end.
  DeclinedDueToNotificationsDisabled = 'DeclinedDueToNotificationsDisabled',

  // Indicates that the microphone permission is not granted for the call.
  DeclinedDueToMicrophonePermissionsNotGranted = 'DeclinedDueToMicrophonePermissionsNotGranted',
}

class CallEventUtil {
  //Returns the enum value based on the passed event string
  static fromString(event: string): CallEvent | null {
    switch (event) {
      case 'CallIsPlaced':
        return CallEvent.CallIsPlaced;
      case 'Cancelled':
        return CallEvent.Cancelled;
      case 'Declined':
        return CallEvent.Declined;
      case 'Missed':
        return CallEvent.Missed;
      case 'Answered':
        return CallEvent.Answered;
      case 'CallInProgress':
        return CallEvent.CallInProgress;
      case 'Ended':
        return CallEvent.Ended;
      case 'ReceiverBusyOnAnotherCall':
        return CallEvent.ReceiverBusyOnAnotherCall;
      case 'DeclinedDueToLoggedOutCuid':
        return CallEvent.DeclinedDueToLoggedOutCuid;
      case 'DeclinedDueToNotificationsDisabled':
        return CallEvent.DeclinedDueToNotificationsDisabled;
      case 'DeclinedDueToMicrophonePermissionsNotGranted':
        return CallEvent.DeclinedDueToMicrophonePermissionsNotGranted;
      default:
        const errorMessage = `"{event}" is not a valid value for CallEvent.`;
        SignedCallLogger.debug({
          message: errorMessage.replace('{event}', event),
        });
        return null;
    }
  }
}

export { CallEvent, CallEventUtil };
