import { TurboModuleRegistry, type TurboModule } from "react-native";
import type { SignedCallResponse } from "./models/SignedCallResponse";
import { type SCCallState } from "./SignedCall";
export interface Spec extends TurboModule {

    getConstants(): SignedCallConstants

    initialize(initProperties: AndroidInitProperties | iOSInitProperties): Promise<SignedCallResponse>

    call(
        receiverCuid: string,
        callContext: string,
        callProperties?: CallProperties
    ): Promise<SignedCallResponse>

    getBackToCall(): Promise<boolean>

    getCallState(): Promise<SCCallState | null>

    logout(): Promise<boolean>

    hangupCall(): Promise<void>

    disconnectSignallingSocket(): Promise<void>

    trackSdkVersion(sdkName: string, sdkVersion: number): Promise<void>

    setDebugLevel(logLevel: number): Promise<void>

    isInitialized(): Promise<boolean>
    
    dismissMissedCallNotification(): Promise<boolean> 

    // NativeEventEmitter methods for the New Architecture.
    // The implementations are handled implicitly by React Native.
    addListener: (eventType: string) => void;
    
    removeListeners: (count: number) => void;
}


export default TurboModuleRegistry.getEnforcing<Spec>(
    'CleverTapSignedCall',
);

type AndroidInitProperties = {
    accountId: string,
    apiKey: string,
    cuid: string,
    allowPersistSocketConnection: boolean,
    notificationPermissionRequired: boolean,
    appId: string | null,
    name:string | null,
    ringtone: string | null,
    promptReceiverReadPhoneStatePermission: boolean | null,
    overrideDefaultBranding: CallBranding | null,
    missedCallActions: MissedCallActions | null,
    promptPushPrimer: PushPrimer | null,
    callScreenOnSignalling: boolean | null,
    // EndCall or PersistCall
    swipeOffBehaviourInForegroundService: string | null,
    // foreground or background
    fcmProcessingMode: string | null,
    fcmProcessingNotification: FCMNotification | null,
}

type iOSInitProperties = {
    accountId: string,
    apiKey: string,
    cuid: string,
    production:boolean,
    overrideDefaultBranding: CallBranding | null,
}

type CallBranding = {
    bgColor: string | null,
    fontColor: string  | null,
    logoUrl: string  | null,
    // dark or light
    buttonTheme: string  | null,
    // cancelCountdownColor is NA for iOS
    cancelCountdownColor: string  | null,
    showPoweredBySignedCall: boolean  | null
}

type actionLabel = string;

type MissedCallActions = {
    [actionId: string]:actionLabel
}

 type PushPrimer = {
    inAppType: string,
    titleText: string,
    messageText: string,
    followDeviceOrientation: boolean,
    positiveBtnText: string,
    negativeBtnText: string,
    fallbackToSettings: boolean,
}

 type FCMNotification = {
    title: string,
    subtitle: string,
    largeIcon: string,
    cancelCtaLabel: string
}

type CallProperties = {
    remote_context: string,
    receiver_image: string,
    initiator_image:string
}

type SignedCallConstants = {
    SignedCallOnMissedCallActionClicked: string,
    SignedCallOnCallStatusChanged: string
}