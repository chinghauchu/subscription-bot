import { requireOptionalNativeModule } from 'expo-modules-core';

import type { ClearbillIcloudModuleView } from './src/ClearbillIcloud.types';

export type { ClearbillIcloudModuleView, ICloudNativeStatus } from './src/ClearbillIcloud.types';

export function getClearbillIcloudNativeModule(): ClearbillIcloudModuleView | null {
  return requireOptionalNativeModule<ClearbillIcloudModuleView>('ClearbillIcloud');
}

export default getClearbillIcloudNativeModule();
