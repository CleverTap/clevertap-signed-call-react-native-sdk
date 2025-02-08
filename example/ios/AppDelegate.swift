//
//  AppDelegate.swift
//  ClevertapSignedCallReactNativeExample
//
//  Created by Shrinath Gupta on 08/02/25.
//


import UIKit
import React_RCTAppDelegate
import ReactAppDependencyProvider
import CleverTapSDK
import SignedCallSDK

@main
class AppDelegate: RCTAppDelegate {
  override func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
    self.moduleName = "ClevertapSignedCallReactNativeExample"
    self.dependencyProvider = RCTAppDependencyProvider()

    // You can add your custom initial props in the dictionary below.
    // They will be passed down to the ViewController used by React Native.
    self.initialProps = [:]
    let bridge = RCTBridge(delegate: self, launchOptions: launchOptions)
            
    let rootView = RCTRootView(bridge: bridge!, moduleName: moduleName!, initialProperties: initialProps)
    
    if #available(iOS 13.0, *) {
        rootView.backgroundColor = UIColor.systemBackground
    } else {
        rootView.backgroundColor = UIColor.white
    }
    
    self.window = UIWindow(frame: UIScreen.main.bounds)
    let rootViewController = UIViewController()
    rootViewController.view = rootView
    self.window.rootViewController = rootViewController
    
    SignedCall.cleverTapInstance = CleverTap.sharedInstance()
    SignedCall.isLoggingEnabled = true
    SignedCall.registerVoIP(appName: "Sample App")
    SignedCall.rootViewController = self.window.rootViewController
    
    self.window.makeKeyAndVisible()
    
    return true
  }

  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}
