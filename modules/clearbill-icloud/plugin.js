const { withEntitlementsPlist, withInfoPlist } = require('expo/config-plugins');

const CONTAINER = 'iCloud.app.clearbill.tw';
const BUNDLE_ID = 'app.clearbill.tw';

/**
 * Adds iCloud Documents + Key-Value Store entitlements and Info.plist
 * container metadata used by FileManager ubiquity APIs.
 *
 * @param {import('expo/config-plugins').ExportedConfig} config
 */
function withClearbillIcloud(config) {
  config = withEntitlementsPlist(config, (mod) => {
    mod.modResults['com.apple.developer.icloud-container-identifiers'] = [CONTAINER];
    mod.modResults['com.apple.developer.icloud-services'] = ['CloudDocuments'];
    mod.modResults['com.apple.developer.ubiquity-container-identifiers'] = [CONTAINER];
    mod.modResults['com.apple.developer.ubiquity-kvstore-identifier'] =
      `$(TeamIdentifierPrefix)${BUNDLE_ID}`;
    return mod;
  });

  config = withInfoPlist(config, (mod) => {
    mod.modResults.NSUbiquitousContainers = {
      [CONTAINER]: {
        NSUbiquitousContainerIsDocumentScopePublic: true,
        NSUbiquitousContainerName: '扣款清',
        NSUbiquitousContainerSupportedFolderLevels: 'Any',
      },
    };
    if (mod.modResults.ITSAppUsesNonExemptEncryption == null) {
      mod.modResults.ITSAppUsesNonExemptEncryption = false;
    }
    if (!mod.modResults.NSFaceIDUsageDescription) {
      mod.modResults.NSFaceIDUsageDescription =
        '用於鎖定扣款清，避免他人查看你的訂閱與支出。';
    }
    return mod;
  });

  return config;
}

module.exports = withClearbillIcloud;
