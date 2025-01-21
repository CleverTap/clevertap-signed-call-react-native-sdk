import { TurboModuleRegistry, type TurboModule } from "react-native";
import type { SignedCallResponse } from "./models/SignedCallResponse";
import { type SCCallState } from "./SignedCall";

type CallBranding = {
    bgColor: string ,
    fontColor: string ,
    logoUrl: string ,
    buttonTheme: string ,
    cancelCountdownColor: string 
    showPoweredBySignedCall: boolean 
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
    title:string,
    subtitle:string,
    largeIcon:string,
    cancelCtaLabel:string
}

type InitProperties = {
    accountId: string,
    apiKey: string,
    cuid: string,
    overrideDefaultBranding: CallBranding,
    allowPersistSocketConnection: boolean ,
    promptPushPrimer: PushPrimer ,
    missedCallActions: FCMNotification | null,
    callScreenOnSignalling: boolean,
    notificationPermissionRequired: boolean,
    swipeOffBehaviourInForegroundService:string,
    fcmProcessingMode: string,
    fcmProcessingNotification: FCMNotification,
    production: boolean 
}


type CallProperties = {
    remote_context:string
}

type SignedCallConstants = {
    SignedCallOnMissedCallActionClicked:string,
    SignedCallOnCallStatusChanged:string
}

export interface Spec extends TurboModule {

    getConstants(): SignedCallConstants

    initialize(initProperties: InitProperties):Promise<SignedCallResponse>

    call(
        receiverCuid: string,
        callContext: string,
        callProperties?: CallProperties 
    ): Promise<SignedCallResponse>

    getBackToCall(): Promise<boolean>

    getCallState(): Promise<SCCallState | null>

    logout(): void

    hangupCall(): void

    disconnectSignallingSocket(): void

    addListener(eventName: string, handler: ()=>void): void

    removeListener(eventName: string): void

    trackSdkVersion(sdkName: string, sdkVersion: number):void

    setDebugLevel(logLevel:number):void
}


export default TurboModuleRegistry.getEnforcing<Spec>(
    'CleverTapSignedCall',
);