import { Platform } from 'react-native';

export type Callback = () => void;

export function isDeviceVersionTargetsBelow(apiLevel: number) {
  const deviceSdkVersion = Platform.Version as number;
  return deviceSdkVersion < apiLevel;
}
