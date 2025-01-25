#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>

@import CleverTapSDK;
@import SignedCallSDK;

@implementation AppDelegate
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"ClevertapSignedCallReactNativeExample";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};
  
 RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];

 RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                  moduleName:self.moduleName
                                           initialProperties:self.initialProps];
 if (@available(iOS 13.0, *)) {
   rootView.backgroundColor = [UIColor systemBackgroundColor];
 } else {
   rootView.backgroundColor = [UIColor whiteColor];
 }

 self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
 UIViewController *rootViewController = [UIViewController new];
 rootViewController.view = rootView;
 self.window.rootViewController = rootViewController;
  
  SignedCall.cleverTapInstance = [CleverTap sharedInstance];
  [SignedCall setIsLoggingEnabled: YES];
  [SignedCall registerVoIPWithAppName:@"Sample App"];
  [SignedCall setRootViewController:self.window.rootViewController];
  [self.window makeKeyAndVisible];

  return  YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
