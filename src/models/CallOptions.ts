import { CustomMetaData } from './CustomMetaData';
import { DTMFInput } from './DTMFInput';

class CallOptions {
  receiverCuid: string;
  callContext: string;
  customMetaData: CustomMetaData;

  constructor(
    receiverCuid: string,
    callContext: string,
    customMetaData: CustomMetaData
  ) {
    this.receiverCuid = receiverCuid;
    this.callContext = callContext;
    this.customMetaData = customMetaData;
  }

  static fromDict(dict: any) {
    const callerCuid = dict.receiverCuid;
    const callContext = dict.callContext;
    const customMetaData = CustomMetaData.fromDict(dict.customMetaData);
    const callOptions = new CallOptions(
      callerCuid,
      callContext,
      customMetaData
    );

    return callOptions;
  }
}

class M2PCallOptions extends CallOptions {
  campaignId: string;
  campaignEndTime: string;
  campaignLabelList: string[];
  dtmfInputList: DTMFInput[];

  constructor(
    receiverCuid: string,
    callContext: string,
    customMetaData: CustomMetaData,
    campaignID: string,
    campaignEndTime: string,
    campaignLabelList: string[],
    dtmfInputList: DTMFInput[]
  ) {
    super(receiverCuid, callContext, customMetaData);
    this.campaignId = campaignID;

    this.campaignEndTime = campaignEndTime;
    this.campaignLabelList = campaignLabelList;
    this.dtmfInputList = dtmfInputList;
  }

  static fromDict(dict: any) {
    return new M2PCallOptions(
      dict.receiverCuid,
      dict.callContext,
      dict.customMetaData,
      dict.campaignId,
      dict.campaignEndTime,
      dict.campaignLabelList,
      DTMFInput.fromList(dict.dtmfInputList)
    );
  }
}

class P2PCallOptions extends CallOptions {
  initiatorCuid: string;
  constructor(
    receiverCuid: string,
    callContext: string,
    customMetaData: CustomMetaData,
    initiatorCUID: string
  ) {
    super(receiverCuid, callContext, customMetaData);
    this.initiatorCuid = initiatorCUID;
  }
}

export { CallOptions, M2PCallOptions, P2PCallOptions };
