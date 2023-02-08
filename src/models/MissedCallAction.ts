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

class CallDetails {
  callerCuid: string;
  calleeCuid: string;
  callContext: string;

  constructor(callerCuid: string, calleeCuid: string, callContext: string) {
    this.callerCuid = callerCuid;
    this.calleeCuid = calleeCuid;
    this.callContext = callContext;
  }

  static fromDict(dict: any) {
    const callerCuid = dict.callerCuid;
    const calleeCuid = dict.calleeCuid;
    const callContext = dict.callContext;
    return new CallDetails(callerCuid, calleeCuid, callContext);
  }
}

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
