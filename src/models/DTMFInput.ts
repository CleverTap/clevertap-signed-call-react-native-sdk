import { type DTMFKey, DTMFKeyUtil } from './DTMFKey';

export class DTMFInput {
  inputIdentifier: string;
  inputKey: DTMFKey;

  constructor(inputIdentifier: string, inputKey: DTMFKey) {
    this.inputIdentifier = inputIdentifier;
    this.inputKey = inputKey;
  }

  static fromList(list: any) {
    if (!list) {
      return undefined;
    }
    return list.map(
      (item: { inputIdentifier: string; inputKey: string }) =>
        new DTMFInput(
          item.inputIdentifier,
          DTMFKeyUtil.fromString(item.inputKey)
        )
    );
  }
}
