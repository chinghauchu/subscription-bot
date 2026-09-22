import { requireOptionalNativeModule } from 'expo-modules-core';

import type { SubassistIcloudModuleView } from './src/SubassistIcloud.types';

export type { ICloudNativeStatus, SubassistIcloudModuleView } from './src/SubassistIcloud.types';

export function getSubassistIcloudNativeModule(): SubassistIcloudModuleView | null {
  return requireOptionalNativeModule<SubassistIcloudModuleView>('SubassistIcloud');
}

export default getSubassistIcloudNativeModule();
