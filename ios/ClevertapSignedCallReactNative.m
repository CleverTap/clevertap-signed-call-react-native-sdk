#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(CleverTapSignedCall, NSObject)

RCT_EXTERN_METHOD(
                  initialize:(NSDictionary *)initOptions
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(
                  call:(NSString *)receiverCuid
                  withContext: (NSString *)callContext
                  withCallProperties: (NSDictionary *)callProperties
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(logout)

RCT_EXTERN_METHOD(hangupCall)

RCT_EXTERN_METHOD(setDebugLevel:(int)logLevel)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

- (NSDictionary *)constantsToExport {
    return @{
        @"SignedCallOnCallStatusChanged": @"SignedCallOnCallStatusChanged"
    };
}

- (dispatch_queue_t)methodQueue {
    return dispatch_get_main_queue();
}


@end
