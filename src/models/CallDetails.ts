//Contains details about the missed call
export class CallDetails {
  callId: string | undefined;
  callerCuid: string;
  calleeCuid: string;
  callContext: string;
  initiatorImage: string | undefined;
  receiverImage: string | undefined;
  remoteContext: string | undefined;

  constructor(callerCuid: string, calleeCuid: string, callContext: string) {
    this.callerCuid = callerCuid;
    this.calleeCuid = calleeCuid;
    this.callContext = callContext;
  }

  static fromDict(dict: any) {
    const callerCuid = dict.callerCuid;
    const calleeCuid = dict.calleeCuid;
    const callContext = dict.callContext;

    const callDetails = new CallDetails(callerCuid, calleeCuid, callContext);
    callDetails.callId = dict.callId;
    callDetails.initiatorImage = dict.initiatorImage;
    callDetails.receiverImage = dict.receiverImage;
    callDetails.remoteContext = dict.remoteContext;

    return callDetails;
  }
}
