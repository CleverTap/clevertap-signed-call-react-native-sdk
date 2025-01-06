import Foundation
import SignedCallSDK

struct SCConstant {
    static let SCCallStatusDidUpdate: NSNotification.Name = NSNotification.Name(rawValue: "SCCallStatusDidUpdate")
    
    static let remoteContext = "remote_context"
    static let initiatorImage = "initiator_image"
    static let receiverImage = "receiver_image"
    static let onCallStatusChanged = "SignedCallOnCallStatusChanged"
    static let callStatus = "callStatus"
}

struct SCCallEventMapping {
    var callStatus: SCCallStatus?
    var value: String {
        switch callStatus {
        case .CALL_DECLINED_DUE_TO_LOGGED_OUT_CUID:
            "DeclinedDueToLoggedOutCuid"
        case .CALLEE_MICROPHONE_PERMISSION_NOT_GRANTED:
            "DeclinedDueToMicrophonePermissionsNotGranted"
        case .CALL_IS_PLACED:
            "CallIsPlaced"
        case .CALLEE_BUSY_ON_ANOTHER_CALL:
            "ReceiverBusyOnAnotherCall"
        case .CALL_CANCELLED:
            "Cancelled"
        case .CALL_DECLINED:
            "Declined"
        case .CALL_MISSED:
            "Missed"
        case .CALL_ANSWERED:
            "Answered"
        case .CALL_IN_PROGRESS:
            "CallInProgress"
        case .CALL_OVER:
            "Ended"
        case .CALL_DECLINED_DUE_TO_NOTIFICATIONS_DISABLED:
            "DeclinedDueToNotificationsDisabled"
        case .DELAYED_ANSWER_ACTION:
            ""
        case .none:
            "none"
        @unknown default:
            "unknow"
        }
    }
}
