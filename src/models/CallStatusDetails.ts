import { M2PCallOptions, P2PCallOptions, CallOptions } from './CallOptions';
import { type CallStatus, CallStatusUtil } from './CallStatus';

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

    const callType = dict.callType === 'P2P' ? CallType.P2P : CallType.P2P;

    const callOptions =
      callType === CallType.P2P
        ? M2PCallOptions.fromDict(dict.callOptions)
        : P2PCallOptions.fromDict(dict.callOptions);

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

enum CallType {
  P2P = 'p2p',
  M2P = 'm2p',
}

export { CallStatusDetails, CallDirection, CallType };
