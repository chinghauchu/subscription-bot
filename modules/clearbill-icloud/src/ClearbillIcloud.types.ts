export type ICloudNativeStatus = {
  available: boolean;
  signedIn: boolean;
  reason: 'ok' | 'signed-out' | 'container-unavailable' | string;
  containerId: string;
  containerPath: string;
  kvUpdatedAt: string;
};

export type ClearbillIcloudModuleView = {
  getStatus(): ICloudNativeStatus;
  synchronize(): Promise<boolean>;
  readSnapshot(): Promise<string | null>;
  writeSnapshot(json: string): Promise<void>;
  kvGet(key: string): Promise<string | null>;
  kvSet(key: string, value: string): Promise<void>;
  addListener(event: string, listener: (event: Record<string, unknown>) => void): { remove(): void };
};
