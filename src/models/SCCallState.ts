import { SignedCallLogger } from '../utils/SignedCallLogger';

/**
 * Enum class to represent the different states of an active call.
 */
enum SCCallState {
  // Indicates an outgoing call that is in progress.
  OutgoingCall = 'OutgoingCall',

  // Indicates an incoming call that is ringing and waiting to be answered.
  IncomingCall = 'IncomingCall',

  // Indicates an active call that is currently in progress and connected.
  OngoingCall = 'OngoingCall',

  // Indicates the absence of any active call.
  NoCall = 'NoCall',
}

class SCCallStateUtil {
  //Returns the enum value based on the passed event string
  static fromString(event: string): SCCallState | null {
    switch (event) {
      case 'OutgoingCall':
        return SCCallState.OutgoingCall;
      case 'IncomingCall':
        return SCCallState.IncomingCall;
      case 'OngoingCall':
        return SCCallState.OngoingCall;
      case 'NoCall':
        return SCCallState.NoCall;
      default:
        const errorMessage = `"{event}" is not a valid value for SCCallState.`;
        SignedCallLogger.debug({
          message: errorMessage.replace('{event}', event),
        });
        return null;
    }
  }
}

export { SCCallState, SCCallStateUtil };
