export class DTMFInput {
  inputIdentifier: string;
  inputKey: string; // @TODO Change this to DTMFKey if required. Maybe unnecessary

  constructor(inputIdentifier: string, inputKey: string) {
    this.inputIdentifier = inputIdentifier;
    this.inputKey = inputKey;
  }

  static fromList(list: any) {
    return list.map(
      (item: { inputIdentifier: string; inputKey: string }) =>
        new DTMFInput(item.inputIdentifier, item.inputKey)
    );
  }
}
