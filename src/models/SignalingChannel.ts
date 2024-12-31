import { SignedCallLogger } from '../utils/SignedCallLogger';

/**
 * Enum representing the possible channels used for delivering call notifications.
 */
enum SignalingChannel {
  // Indicates a socket-based channel used to deliver the incoming call to the receiver.
  Socket = 'socket',

  // Indicates an FCM-based channel used to deliver the incoming call to the receiver.
  Fcm = 'fcm',
}

class SignalingChannelUtil {
  /**
   * Converts the enum value to its string representation.
   * @param channel The SCSignalingChannel enum value.
   * @returns The string representation of the channel.
   */
  static toValue(channel: SignalingChannel): string {
    return channel;
  }

  /**
   * Returns the SCSignalingChannel enum value based on the passed string.
   * @param value The string representation of the channel.
   * @returns The corresponding SCSignalingChannel or `null` if invalid.
   */
  static fromValue(value: string): SignalingChannel | undefined {
    switch (value) {
      case SignalingChannel.Socket:
        return SignalingChannel.Socket;
      case SignalingChannel.Fcm:
        return SignalingChannel.Fcm;
      default:
        const errorMessage = `"${value}" is not a valid value for SCSignalingChannel.`;
        SignedCallLogger.debug({
          message: errorMessage,
        });
        return undefined;
    }
  }
}

export { SignalingChannel, SignalingChannelUtil };
