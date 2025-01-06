import SignedCallSDK
import CleverTapSDK
import React
import OSLog

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
    @objc(trackSdkVersion:withsdkVersion:)
    func trackSdkVersion(sdkName: String, sdkVersion: Int) -> Void {
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
    
    @objc(call:withContext:withCallProperties:withResolver:withRejecter:)
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
    
    @objc(initialize:withResolver:withRejecter:)
    func initialize(initOptions: NSDictionary, resolve: @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock) -> Void {
        
        guard var initOptionsDict = initOptions as? [String: Any?] else {
            os_log("[CT]:[SignedCall]:[RN] Handle method initialize, key: initOptions not available", log: logValue, type: .default)
            return
        }
        
        initOptionsDict["accountID"] = initOptions["accountId"]
        
        if let brandingDetails = initOptions["overrideDefaultBranding"] as? [String: Any?],
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
