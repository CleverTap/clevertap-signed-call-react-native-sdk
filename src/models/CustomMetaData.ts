//Contains details about the missed call
export class CustomMetaData {
  initiatorImage: string | undefined;
  receiverImage: string | undefined;
  customKeys: Map<string, any>;

  constructor(
    initiatorImage: string,
    receiverImage: string,
    customKeys: Map<string, any>
  ) {
    this.initiatorImage = initiatorImage;
    this.receiverImage = receiverImage;
    this.customKeys = customKeys;
  }

  static fromDict(dict: any) {
    const initiatorImage = dict.initiatorImage;
    const receiverImage = dict.receiverImage;
    const customKeys = dict.customKeys ?? new Map<string, any>();

    const customMetaData = new CustomMetaData(
      initiatorImage,
      receiverImage,
      customKeys
    );
    return customMetaData;
  }
}
