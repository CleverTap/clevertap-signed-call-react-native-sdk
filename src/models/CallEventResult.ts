import { CallDetails } from './CallDetails';
import { CallEventUtil, type CallEvent } from './CallEvent';

// Represents the result of a call event.
export class CallEventResult {
  direction: CallDirection;
  callDetails: CallDetails;
  callEvent: CallEvent;

  constructor(
    direction: CallDirection,
    callDetails: CallDetails,
    callEvent: CallEvent
  ) {
    this.direction = direction;
    this.callDetails = callDetails;
    this.callEvent = callEvent;
  }

  static fromDict(dict: any) {
    const direction =
      dict.direction === 'INCOMING'
        ? CallDirection.Incoming
        : CallDirection.Outgoing;

    const callEvent = CallEventUtil.fromString(dict.callEvent);
    const callDetails = CallDetails.fromDict(dict.callDetails);
    return new CallEventResult(direction, callDetails, callEvent);
  }
}

// Enumeration representing the direction of a call (incoming or outgoing).
enum CallDirection {
  Incoming = 'Incoming',
  Outgoing = 'Outgoing',
}
