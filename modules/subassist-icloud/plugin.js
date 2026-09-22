const { withEntitlementsPlist, withInfoPlist } = require('expo/config-plugins');

const CONTAINER = 'iCloud.app.subassist.tw';
const BUNDLE_ID = 'app.subassist.tw';

/**
 * Adds iCloud Documents + Key-Value Store entitlements and Info.plist
 * container metadata used by FileManager ubiquity APIs.
 *
 * @param {import('expo/config-plugins').ExportedConfig} config
 */
function withSubassistIcloud(config) {
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
        NSUbiquitousContainerName: '訂閱助手',
        NSUbiquitousContainerSupportedFolderLevels: 'Any',
      },
    };
    if (mod.modResults.ITSAppUsesNonExemptEncryption == null) {
      mod.modResults.ITSAppUsesNonExemptEncryption = false;
    }
    if (!mod.modResults.NSFaceIDUsageDescription) {
      mod.modResults.NSFaceIDUsageDescription =
        '用於鎖定訂閱助手，避免他人查看你的訂閱與支出。';
    }
    return mod;
  });

  return config;
}

module.exports = withSubassistIcloud;
