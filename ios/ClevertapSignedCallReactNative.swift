import SignedCallSDK
import CleverTapSDK
import React

@objc(CleverTapSignedCall)
class CleverTapSignedCall: RCTEventEmitter {
    
    var hasListeners = false
    
    override init() {
        super.init()
        NotificationCenter.default.addObserver(self, selector: #selector(self.callStatus(notification:)), name: NSNotification.Name(rawValue: SCConstant.messageReceived), object: nil)
    }
    
    @objc(setDebugLevel:)
    func setDebugLevel(logLevel: Int) -> Void {
        guard logLevel >= 0 else {
            SignedCall.isLoggingEnabled = false
            return
        }
        SignedCall.isLoggingEnabled = true
    }
    
    @objc(call:withContext:withCallProperties:withResolver:withRejecter:)
    func call(receiverCuid: String?, callContext: String?, callProperties: NSDictionary, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        guard let callContext = callContext, let receiverCuid = receiverCuid else {
            return
        }
        var customMetaData: SCCustomMetadata?
        if let callDetails = callProperties as? [String: Any?],
           let initiatorImage = callDetails[SCConstant.initiatorImage] as? String,
           let receiverImage = callDetails[SCConstant.receiverImage] as? String {

            customMetaData = SCCustomMetadata(initiatorImage: initiatorImage, receiverImage: receiverImage)
        }

        let callOptions = SCCallOptionsModel(context: callContext, receiverCuid: receiverCuid, customMetaData: customMetaData)
        SignedCall.call(callOptions: callOptions) { result in
            switch result {
            case .success(let value):
                resolve(value)
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
            return
        }
        
        initOptionsDict["accountID"] = initOptions["accountId"]
        initOptionsDict["production"] = false
        
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
        let message = notification.userInfo?[SCConstant.callStatus]
        
        guard let callValue = message as? Int,
              let callEvent = SCCallStatus(rawValue: callValue) else {
            //  os_log("Unknown call event raised: %{public}@", log: logValue, type: .default, notification.object.debugDescription)
            return
        }
        
        switch callEvent {
            
        case .CALL_CANCEL, .CALL_DECLINED, .CALL_MISSED, .CALL_ANSWERED, .CALL_CONNECTED, .RECEIVER_BUSY_ON_ANOTHER_CALL, .CALL_OVER :
            handleCallEvent(SCCallEvent(rawValue: callValue).value)
        default: break
        }
    }
        
    func handleCallEvent(_ callEvent: String) {
        print(callEvent)
        if hasListeners {
            sendEvent(withName: SCConstant.onCallStatusChanged, body: callEvent)
        }
   }
}
