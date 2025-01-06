import { SignedCallLogger } from '../utils/SignedCallLogger';

/**
 * Enum representing the possible statuses of a VoIP call
 */
enum CallEvent {
  // Indicates that the call is successfully placed
  CallIsPlaced = 'CallIsPlaced',

  // Indicates that the call is ringing at receiver's device
  Ringing = 'Ringing',

  // Indicates that the call is cancelled from the initiator's end
  Cancelled = 'Cancelled',

  // Indicates that the call is cancelled due to a ring timeout(35 secs)
  CancelledDueToRingTimeout = 'CancelledDueToRingTimeout',

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

  // Indicates that the receiver is busy on VoIP call
  DeclinedDueToBusyOnVoIP = 'DeclinedDueToBusyOnVoIP',

  // Indicates that the receiver is busy on PSTN call
  DeclinedDueToBusyOnPSTN = 'DeclinedDueToBusyOnPSTN',

  // Indicates that the call is declined due to the receiver being logged out with the specific CUID
  DeclinedDueToLoggedOutCuid = 'DeclinedDueToLoggedOutCuid',

  // [Specific to Android-Platform]
  // Indicates that the call is declined due to the notifications are disabled at the receiver's end.
  DeclinedDueToNotificationsDisabled = 'DeclinedDueToNotificationsDisabled',

  // Indicates that the microphone permission is not granted for the call.
  DeclinedDueToMicrophonePermissionsNotGranted = 'DeclinedDueToMicrophonePermissionsNotGranted',

  // Indicates that the microphone permission is blocked at the receiver's end.
  DeclinedDueToMicrophonePermissionBlocked = 'DeclinedDueToMicrophonePermissionBlocked',

  // Indicates that the call is declined based on the application's logic in the onNetworkQualityResponse(int score) callback, which evaluates the network quality.
  AppInitiatedDeclinedDueToNetworkQuality = 'AppInitiatedDeclinedDueToNetworkQuality',

  // Indicates that the call is declined due to cancellation of the call from cancel CTA of the preprocessing notification
  UserInitiatedDeclinedOnCancelCta = 'UserInitiatedDeclinedOnCancelCta',

  // Indicates that the call failed due to an internal error within the SDK.
  FailedDueToInternalError = 'FailedDueToInternalError',

  // Indicates that the call has been disconnected for the party that lost the network.
  EndedDueToLocalNetworkLoss = 'EndedDueToLocalNetworkLoss',

  // Indicates that the call has been disconnected for the party that dropped due to network loss at remote end.
  EndedDueToRemoteNetworkLoss = 'EndedDueToRemoteNetworkLoss',

  // Indicates that the call has been disconnected due protocol mismatch.
  EndedDueToProtocolMismatch = 'EndedDueToProtocolMismatch',

  // Indicates that the call has been disconnected due to network delay which causes failure in media setup.
  // NOTE: This event will be triggered when the network switch is enabled.
  EndedDueToNetworkDelayInMediaSetup = 'EndedDueToNetworkDelayInMediaSetup',
}

class CallEventUtil {
  private static eventMap: Record<string, CallEvent> = Object.values(
    CallEvent
  ).reduce((map, event) => {
    map[event] = event;
    return map;
  }, {} as Record<string, CallEvent>);

  /**
   * Returns the enum value based on the passed event string.
   * @param event The event string to convert to CallEvent.
   * @returns The CallEvent enum value or null if invalid.
   */
  static fromString(event: string): CallEvent | null {
    const callEvent = this.eventMap[event];
    if (!callEvent) {
      SignedCallLogger.debug({
        message: `"${event}" is not a valid value for CallEvent.`,
      });
    }
    return callEvent || null;
  }
}

export { CallEvent, CallEventUtil };
