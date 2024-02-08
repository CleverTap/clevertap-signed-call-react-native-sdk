import { CallDetails } from './CallDetails';

/**
 * Represents the details associated to a CTA click of the missed call notification.
 */
export class MissedCallActionClickResult {
  action: MissedCallNotificationAction;
  callDetails: CallDetails;

  constructor(action: MissedCallNotificationAction, callDetails: CallDetails) {
    this.action = action;
    this.callDetails = callDetails;
  }

  static fromDict(dict: any) {
    const action = MissedCallNotificationAction.fromDict(dict.action);
    const callDetails = CallDetails.fromDict(dict.callDetails);
    return new MissedCallActionClickResult(action, callDetails);
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
