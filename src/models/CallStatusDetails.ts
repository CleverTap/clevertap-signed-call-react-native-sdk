import { CallOptionsUtils, CallOptions } from './CallOptions';
import { type CallStatus, CallStatusUtil } from './CallStatus';
import { CallType } from './CallType';

// Represents the result of a call event.
class CallStatusDetails {
  direction: CallDirection;
  callType: CallType;
  callOptions: CallOptions;
  callStatus: CallStatus;

  constructor(
    direction: CallDirection,
    callType: CallType,
    callOptions: CallOptions,
    callStatus: CallStatus
  ) {
    this.direction = direction;
    this.callType = callType;
    this.callOptions = callOptions;
    this.callStatus = callStatus;
  }

  static fromDict(dict: any) {
    const direction =
      dict.direction === 'INCOMING'
        ? CallDirection.Incoming
        : CallDirection.Outgoing;

    const callType = dict.callType === 'P2P' ? CallType.P2P : CallType.M2P;

    const callOptions = CallOptionsUtils.fromDictAndCallType(
      dict.callOptions,
      callType
    );

    return new CallStatusDetails(
      direction,
      callType,
      callOptions,
      CallStatusUtil.fromString(dict.callStatus)
    );
  }
}

// Enumeration representing the direction of a call (incoming or outgoing).
enum CallDirection {
  Incoming = 'Incoming',
  Outgoing = 'Outgoing',
}

export { CallStatusDetails, CallDirection };
