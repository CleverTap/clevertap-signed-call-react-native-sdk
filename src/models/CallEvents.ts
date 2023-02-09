import { SignedCallLogger } from '../utils/SignedCallLogger';

///Holds all the possible statuses of a VoIP call
export enum CallEvent {
  //When a call is cancelled from the initiator's end
  Cancelled = 'Cancelled',

  //When a call is declined from the receiver's end
  Declined = 'Declined',

  //When a call is missed at the receiver's end
  Missed = 'Missed',

  //When a call is picked up by the receiver
  Answered = 'Answered',

  //When connection to the receiver is established after the call is answered.
  //Audio transfer begins at this state.
  CallInProgress = 'CallInProgress',

  //When a call has been ended.
  Ended = 'Ended',

  //When the receiver is busy on another call
  ReceiverBusyOnAnotherCall = 'ReceiverBusyOnAnotherCall',
}

export namespace CallEvent {
  ///gets the index of the event from [CallEvent]
  export function fromString(event: string): CallEvent {
    switch (event) {
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
      default:
        const errorMessage = `"{event}" is not a valid value for CallEvent.`;
        SignedCallLogger.debug({
          message: errorMessage.replace('{event}', event),
        });
        throw new Error(errorMessage.replace('{event}', event));
    }
  }
}
