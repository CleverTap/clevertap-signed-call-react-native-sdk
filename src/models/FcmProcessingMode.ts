import { SignedCallLogger } from '../utils/SignedCallLogger';

/**
 * Enum class to represent the different FCM processing modes.
 */
enum FcmProcessingMode {
  // Indicates that the SDK uses a foreground service to process FCM calls.
  Foreground = 'foreground',

  // Indicates that the SDK processes FCM calls using a background service.
  Background = 'background',
}

class FcmProcessingModeUtil {
  /**
   * Converts the enum value to its string representation.
   * @param mode The FcmProcessingMode enum value.
   * @returns The string representation of the mode.
   */
  static toValue(mode: FcmProcessingMode): string {
    return mode;
  }

  /**
   * Returns the FcmProcessingMode enum value based on the passed string.
   * @param value The string representation of the mode.
   * @returns The corresponding FcmProcessingMode or `null` if invalid.
   */
  static fromValue(value: string): FcmProcessingMode | null {
    switch (value) {
      case FcmProcessingMode.Foreground:
        return FcmProcessingMode.Foreground;
      case FcmProcessingMode.Background:
        return FcmProcessingMode.Background;
      default:
        const errorMessage = `"{value}" is not a valid value for FcmProcessingMode.`;
        SignedCallLogger.debug({
          message: errorMessage.replace('{value}', value),
        });
        return null;
    }
  }
}

export { FcmProcessingMode, FcmProcessingModeUtil };
