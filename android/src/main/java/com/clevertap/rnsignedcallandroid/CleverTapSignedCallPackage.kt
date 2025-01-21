package com.clevertap.rnsignedcallandroid

import com.facebook.react.TurboReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider

class CleverTapSignedCallPackage : TurboReactPackage() {
  override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? {
    return if (name == CleverTapSignedCallModuleImpl.NAME) {
      CleverTapSignedCallModule(reactContext)
    } else {
      null
    }
  }

  override fun getReactModuleInfoProvider(): ReactModuleInfoProvider {
    return ReactModuleInfoProvider {
      val moduleInfos: MutableMap<String, ReactModuleInfo> = HashMap()
      val isTurboModule: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
      moduleInfos[CleverTapSignedCallModuleImpl.NAME] = ReactModuleInfo(
        CleverTapSignedCallModuleImpl.NAME,
        CleverTapSignedCallModuleImpl.NAME,
        false,  // canOverrideExistingModule
        false,  // needsEagerInit
        true,  // hasConstants
        false,// isCxxModule
        isTurboModule // isTurboModule
      )
      moduleInfos
    }
  }

}
