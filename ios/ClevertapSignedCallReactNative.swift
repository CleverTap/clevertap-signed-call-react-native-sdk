import SignedCallSDK
import CleverTapSDK
import React
import OSLog

import Foundation

// MARK: - Call Branding
@objc(CallBranding)
class CallBranding: NSObject {
    var bgColor: String
    var fontColor: String
    var logoUrl: String
    var buttonTheme: String
    var cancelCountdownColor: String
    var showPoweredBySignedCall: Bool

    // Initializer
    init(bgColor: String, fontColor: String, logoUrl: String, buttonTheme: String, cancelCountdownColor: String, showPoweredBySignedCall: Bool) {
        self.bgColor = bgColor
        self.fontColor = fontColor
        self.logoUrl = logoUrl
        self.buttonTheme = buttonTheme
        self.cancelCountdownColor = cancelCountdownColor
        self.showPoweredBySignedCall = showPoweredBySignedCall
    }
}

// MARK: - Push Primer
@objc(PushPrimer)
class PushPrimer: NSObject {
    var inAppType: String
    var titleText: String
    var messageText: String
    var followDeviceOrientation: Bool
    var positiveBtnText: String
    var negativeBtnText: String
    var fallbackToSettings: Bool

    // Initializer
    init(inAppType: String, titleText: String, messageText: String, followDeviceOrientation: Bool, positiveBtnText: String, negativeBtnText: String, fallbackToSettings: Bool) {
        self.inAppType = inAppType
        self.titleText = titleText
        self.messageText = messageText
        self.followDeviceOrientation = followDeviceOrientation
        self.positiveBtnText = positiveBtnText
        self.negativeBtnText = negativeBtnText
        self.fallbackToSettings = fallbackToSettings
    }
}

// MARK: - FCM Notification
@objc(FCMNotification)
class FCMNotification: NSObject {
    var title: String
    var subtitle: String
    var largeIcon: String
    var cancelCtaLabel: String

    // Initializer
    init(title: String, subtitle: String, largeIcon: String, cancelCtaLabel: String) {
        self.title = title
        self.subtitle = subtitle
        self.largeIcon = largeIcon
        self.cancelCtaLabel = cancelCtaLabel
    }
}

// MARK: - Init Properties
@objc(InitProperties)
class InitProperties: NSObject {
    var accountId: String
    var apiKey: String
    var cuid: String
    var overrideDefaultBranding: CallBranding
    var allowPersistSocketConnection: Bool
    var promptPushPrimer: PushPrimer
    var missedCallActions: FCMNotification?
    var callScreenOnSignalling: Bool
    var notificationPermissionRequired: Bool
    var swipeOffBehaviourInForegroundService: String
    var fcmProcessingMode: String
    var fcmProcessingNotification: FCMNotification
    var production: Bool

    // Initializer
    init(accountId: String, apiKey: String, cuid: String, overrideDefaultBranding: CallBranding, allowPersistSocketConnection: Bool, promptPushPrimer: PushPrimer, missedCallActions: FCMNotification?, callScreenOnSignalling: Bool, notificationPermissionRequired: Bool, swipeOffBehaviourInForegroundService: String, fcmProcessingMode: String, fcmProcessingNotification: FCMNotification, production: Bool) {
        self.accountId = accountId
        self.apiKey = apiKey
        self.cuid = cuid
        self.overrideDefaultBranding = overrideDefaultBranding
        self.allowPersistSocketConnection = allowPersistSocketConnection
        self.promptPushPrimer = promptPushPrimer
        self.missedCallActions = missedCallActions
        self.callScreenOnSignalling = callScreenOnSignalling
        self.notificationPermissionRequired = notificationPermissionRequired
        self.swipeOffBehaviourInForegroundService = swipeOffBehaviourInForegroundService
        self.fcmProcessingMode = fcmProcessingMode
        self.fcmProcessingNotification = fcmProcessingNotification
        self.production = production
    }
}


@objc(CleverTapSignedCall)
class CleverTapSignedCall: RCTEventEmitter {
    
    var hasListeners = false
    private var logValue: OSLog {
        return SignedCall.isLoggingEnabled ? .default : .disabled
    }
    
    override init() {
        super.init()
        NotificationCenter.default.addObserver(self, selector: #selector(self.callStatus(notification:)), name: SCConstant.SCCallStatusDidUpdate, object: nil)
    }
  
    @objc(addListener:handler:)
    func addListener(eventName: String, handler: @escaping RCTResponseSenderBlock) {
         
    }
  
    @objc(removeListener:)
    func removeListener(eventName: String) {
         
    }
    
    @objc(getBackToCall:reject:)
    func getBackToCall(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
          
    }
  
    @objc(getCallState:reject:)
    func getCallState(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
          
    }
  
    @objc(trackSdkVersion:sdkVersion:)
    func trackSdkVersion(sdkName: String, sdkVersion: Double) -> Void {
        os_log("[CT]:[SignedCall]:[RN] Handle method trackSDKVersion to track the SDK Version", log: .default, type: .default)
        CleverTap().setCustomSdkVersion(sdkName, version: Int32(sdkVersion))
    }
    
    @objc(setDebugLevel:)
    func setDebugLevel(logLevel: Int) -> Void {
        os_log("[CT]:[SignedCall]:[RN] Handle method setDebugLevel with value: %{public}@", log: .default, type: .default, logLevel.description)
        guard logLevel >= 0 else {
            SignedCall.isLoggingEnabled = false
            return
        }
        SignedCall.isLoggingEnabled = true
    }
    
    @objc(call:callContext:callProperties:resolve:reject:)
    func call(receiverCuid: String?, callContext: String?, callProperties: NSDictionary, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        guard let callContext = callContext, let receiverCuid = receiverCuid else {
            os_log("[CT]:[SignedCall]:[RN] Handle method call, key: callContext and receiverCuid not available", log: logValue, type: .default)
            return
        }
      
      var customMetaData: SCCustomMetadata?
      if let callDetails = callProperties as? [String: Any?] {
          let remoteContext = callDetails[SCConstant.remoteContext] as? String
          let initiatorImage = callDetails[SCConstant.initiatorImage] as? String
          let receiverImage = callDetails[SCConstant.receiverImage] as? String
          
          customMetaData = SCCustomMetadata(
              remoteContext: remoteContext,
              initiatorImage: initiatorImage,
              receiverImage: receiverImage
          )
      }
        
        let callOptions = SCCallOptionsModel(context: callContext, receiverCuid: receiverCuid, customMetaData: customMetaData)
        os_log("[CT]:[SignedCall]:[RN] Handle method call with values: %{public}@, %{public}@, %{public}@", log: logValue, type: .default, callContext, receiverCuid, customMetaData.debugDescription)
        SignedCall.call(callOptions: callOptions) { result in
            switch result {
            case .success(let value):
                resolve(["isSuccessful": value])
            case .failure(let error):
                reject("\(error.errorCode)",
                       error.errorDescription,
                       error)
            }
        }
    }
    
    @objc(initialize:resolve:reject:)
    func initialize(initProperties: NSDictionary, resolve: @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock) -> Void {
        
        guard var initOptionsDict = initProperties as? [String: Any?] else {
            os_log("[CT]:[SignedCall]:[RN] Handle method initialize, key: initOptions not available", log: logValue, type: .default)
            return
        }
        
        initOptionsDict["accountID"] = initProperties["accountId"]
        
        if let brandingDetails = initProperties["overrideDefaultBranding"] as? [String: Any?],
        let bgColor = brandingDetails["bgColor"] as? String,
           let fontColor = brandingDetails["fontColor"] as? String,
           let logoUrl = brandingDetails["logoUrl"] as? String,
           let showPoweredBySignedCall = brandingDetails["showPoweredBySignedCall"] as? Bool,
           let buttonTheme = brandingDetails["buttonTheme"] as? String {
            SignedCall.overrideDefaultBranding = SCCallScreenBranding(bgColor: bgColor, fontColor: fontColor, logo: logoUrl, buttonTheme: buttonTheme == "light" ? .light : .dark)
            SignedCall.overrideDefaultBranding?.setDisplayPoweredBySignedCall(showPoweredBySignedCall)
        }
        
        
        SignedCall.initSDK(withInitOptions: initOptionsDict) { result in
            switch result {
            case .success(let value):
                resolve(["isSuccessful": value])
            case .failure(let error):
                reject("\(error.errorCode)",
                       error.errorDescription,
                       error)
            }
        }
    }
    
    @objc(logout)
    func logout() -> Void {
        os_log("[CT]:[SignedCall]:[RN] Handle method logout", log: logValue, type: .default)
        SignedCall.logout()
    }
    
    @objc(disconnectSignallingSocket)
    func disconnectSignallingSocket() -> Void {
        os_log("[CT]:[SignedCall]:[RN] Handle method disconnectSignallingSocket", log: logValue, type: .default)
        SignedCall.disconnectSignallingSocket()
    }
    
    @objc(hangupCall)
    func hangupCall() -> Void {
        os_log("[CT]:[SignedCall]:[RN] Handle method hangupCall", log: logValue, type: .default)
        SignedCall.hangup()
    }
    
    // MARK: - Call Event Handling
    
    override func supportedEvents() -> [String]! {
        [SCConstant.onCallStatusChanged]
    }
    
    override func startObserving() {
        hasListeners = true
    }
    
    override func stopObserving() {
        hasListeners = false
    }
    
    @objc func callStatus(notification: Notification) {
        let callDetails = notification.userInfo?["callDetails"] as? SCCallStatusDetails
        
        let status: SCCallStatus? = callDetails?.status
        let callDirection: String = callDetails?.callDirection.rawValue ?? ""
        let callEvent = notification.userInfo?["callStatus"] as? SCCallStatus
        let calleeCuid: String = callDetails?.callDetails.calleeCuid ?? ""
        let callerCuid: String = callDetails?.callDetails.callerCuid ?? ""
        let callContext: String = callDetails?.callDetails.context ?? ""
        let initiatorImage: String? = callDetails?.callDetails.initiatorImage
        let receiverImage: String? = callDetails?.callDetails.receiverImage
        
        let callDetailsDict: [String : Any] = ["direction": callDirection.uppercased(),
                                               "callDetails": ["callerCuid": callerCuid, 
                                                               "calleeCuid": calleeCuid,
                                                               "callContext": callContext,
                                                               "initiatorImage": initiatorImage,
                                                               "receiverImage": receiverImage],
                                               "callEvent": SCCallEventMapping(callStatus: status).value]
        handleCallEvent(callDetailsDict)
    }
    
    func handleCallEvent(_ callDetails: [String : Any]) {
        if hasListeners {
            sendEvent(withName: SCConstant.onCallStatusChanged, body: callDetails)
        }
    }
}
