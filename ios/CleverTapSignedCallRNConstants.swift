import Foundation

struct SCConstant {
    static let messageReceived = "MessageReceived"
    static let initiatorImage = "initiator_image"
    static let receiverImage = "receiver_image"
    static let onCallStatusChanged = "SignedCallOnCallStatusChanged"
    static let callStatus = "callStatus"
}

struct SCCallEvent: RawRepresentable {
    var rawValue: Int
    
    var value: String {
        switch rawValue {
        case 3001: return "Ended"
            
        case 3006: return "Cancelled"
        case 3002: return "Answered"
        case 3003: return "Declined"
        case 3004: return "Missed"
        case 3005: return "ReceiverBusyOnAnotherCall"
        case 3009: return "Ended"
        case 3010: return "CallInProgress"
            
        case 3007: return "DelayAction"
        case 3008: return "MicrophonePermission"
        case 3011: return "SuccessCall"
        default: return ""
        }
    }
}
