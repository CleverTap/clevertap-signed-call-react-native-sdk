import { CallOptions, CallOptionsUtils } from './CallOptions';
import { CallType } from './CallType';

/**
 * Represents the details associated to a CTA click of the missed call notification.
 */
export class MissedCallActionClickResult {
  action: MissedCallNotificationAction;
  callOptions: CallOptions;
  callType: CallType;

  constructor(
    action: MissedCallNotificationAction,
    callType: CallType,
    callOptions: CallOptions
  ) {
    this.action = action;
    this.callType = callType;
    this.callOptions = callOptions;
  }

  static fromDict(dict: any) {
    const action = MissedCallNotificationAction.fromDict(dict.action);
    const callType = dict.callType === 'P2P' ? CallType.P2P : CallType.P2P;
    const callOptions = CallOptionsUtils.fromDictAndCallType(
      callType,
      dict.callOptions
    );
    return new MissedCallActionClickResult(action, callType, callOptions);
  }
}

//Contains details about the clicked action-button
class MissedCallNotificationAction {
  actionId: string;
  actionLabel: string;

  constructor(actionId: string, actionLabel: string) {
    this.actionId = actionId;
    this.actionLabel = actionLabel;
  }

  static fromDict(dict: any) {
    const actionId = dict.actionId;
    const actionLabel = dict.actionLabel;
    return new MissedCallNotificationAction(actionId, actionLabel);
  }
}
