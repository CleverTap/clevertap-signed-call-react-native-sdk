import { SignedCallLogger } from '../utils/SignedCallLogger';

/**
 * Enum representing the possible statuses of a Swipe Off Behavior during ongoing call
 */
enum SCSwipeOffBehaviour {
  // Indicates the behavior where the call is ended when the user swipes off the app.
  EndCall = 'EndCall',

  // Indicates the behavior where the call persists even if the user swipes off the app.
  PersistCall = 'PersistCall',
}

class SCSwipeOffBehaviourUtil {
  //Returns the enum value based on the passed event string
  static fromString(event: string): SCSwipeOffBehaviour {
    switch (event) {
      case 'EndCall':
        return SCSwipeOffBehaviour.EndCall;
      case 'PersistCall':
        return SCSwipeOffBehaviour.PersistCall;
      default:
        const errorMessage = `"{event}" is not a valid value for SCSwipeOffBehaviour.`;
        SignedCallLogger.debug({
          message: errorMessage.replace('{event}', event),
        });
        return SCSwipeOffBehaviour.EndCall;
    }
  }
}

export { SCSwipeOffBehaviour, SCSwipeOffBehaviourUtil };
