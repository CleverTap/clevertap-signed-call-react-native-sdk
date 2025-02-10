#import <React/RCTBridgeModule.h>
#ifdef RCT_NEW_ARCH_ENABLED
#import "CleverTapSignedCallSpec.h"

@interface RCT_EXTERN_MODULE(CleverTapSignedCall,NSObject <NativeCleverTapSignedCallModuleSpec>)
#else
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(CleverTapSignedCall,NSObject <RCTBridgeModule>)
#endif

+ (BOOL)requiresMainQueueSetup {
    return NO;
}

- (dispatch_queue_t)methodQueue {
    return dispatch_get_main_queue();
}

- (NSDictionary *)constantsToExport {
    return @{
        @"SignedCallOnCallStatusChanged": @"SignedCallOnCallStatusChanged",
        @"SignedCallOnMissedCallActionClicked":@"SignedCallOnMissedCallActionClicked"
    };
}

- (NSDictionary *)getConstants {
    return [self constantsToExport];
}

RCT_EXTERN_METHOD(disconnectSignallingSocket:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getBackToCall:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getCallState:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(hangupCall:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(initialize:(NSDictionary *)initProperties
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)


RCT_EXTERN_METHOD(logout:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setDebugLevel:(double)logLevel)

RCT_EXTERN_METHOD(trackSdkVersion:(NSString *)sdkName sdkVersion:(double)sdkVersion resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(call:(NSString *)receiverCuid callContext:(NSString *)callContext  callProperties: (NSDictionary *)callProperties resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(isInitialized:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(dismissMissedCallNotification:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeCleverTapSignedCallModuleSpecJSI>(params);
}
#endif

@end



