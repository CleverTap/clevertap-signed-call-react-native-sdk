import { SignedCallLogger } from '../utils/SignedCallLogger';

/**
 * Enum representing ..
 */
enum SCCallState {
  OutgoingCall = 'OutgoingCall',
  IncomingCall = 'IncomingCall',
  OngoingCall = 'OngoingCall',
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
