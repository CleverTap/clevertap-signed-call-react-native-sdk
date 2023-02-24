#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <SignedCallSDK/SignedCallSDK.h>

@interface RCT_EXTERN_MODULE(ClevertapSignedCallReactNative, NSObject)

RCT_EXTERN_METHOD(
                  initSDK:(NSDictionary *)initOptions
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

RCT_EXTERN_METHOD(setDebugLevel:(int)logLevel)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
