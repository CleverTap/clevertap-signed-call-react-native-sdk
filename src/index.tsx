import { NativeModules, Platform } from 'react-native';
import { SignedCallResponse } from './models/SignedCallResponse';

const LINKING_ERROR =
  `The package 'clevertap-signed-call-react-native' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const CleverTapSignedCall = NativeModules.CleverTapSignedCall
  ? NativeModules.CleverTapSignedCall
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export function init(initProperties: object): Promise<SignedCallResponse> {
  return CleverTapSignedCall.init(initProperties).then((result: any) => {
    return SignedCallResponse.fromDict(result);
  });
}

export function call(
  receiverCuid: string,
  callContext: string,
  callProperties?: object | undefined
): Promise<SignedCallResponse> {
  return CleverTapSignedCall.call(
    receiverCuid,
    callContext,
    callProperties
  ).then((result: any) => {
    return SignedCallResponse.fromDict(result);
  });
}
