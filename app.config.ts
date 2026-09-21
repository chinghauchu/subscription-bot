import type { ExpoConfig } from 'expo/config';

const ICloudContainer = 'iCloud.app.clearbill.tw';
const BundleId = 'app.clearbill.tw';

const admobIosAppId = process.env.EXPO_PUBLIC_ADMOB_IOS_APP_ID?.trim();
const admobAndroidAppId = process.env.EXPO_PUBLIC_ADMOB_ANDROID_APP_ID?.trim();

const config: ExpoConfig = {
  name: '扣款清',
  slug: 'clearbill',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'clearbill',
  userInterfaceStyle: 'automatic',
  primaryColor: '#0F6E62',
  ios: {
    bundleIdentifier: BundleId,
    supportsTablet: true,
    usesIcloudStorage: true,
    icon: './assets/expo.icon',
    infoPlist: {
      CFBundleDisplayName: '扣款清',
      CFBundleAllowMixedLocalizations: true,
      NSFaceIDUsageDescription: '用於鎖定扣款清，避免他人查看你的訂閱與支出。',
      ITSAppUsesNonExemptEncryption: false,
      NSUbiquitousContainers: {
        [ICloudContainer]: {
          NSUbiquitousContainerIsDocumentScopePublic: true,
          NSUbiquitousContainerName: '扣款清',
          NSUbiquitousContainerSupportedFolderLevels: 'Any',
        },
      },
    },
    entitlements: {
      'com.apple.developer.icloud-container-identifiers': [ICloudContainer],
      'com.apple.developer.icloud-services': ['CloudDocuments'],
      'com.apple.developer.ubiquity-container-identifiers': [ICloudContainer],
      'com.apple.developer.ubiquity-kvstore-identifier': `$(TeamIdentifierPrefix)${BundleId}`,
    },
    privacyManifests: {
      NSPrivacyAccessedAPITypes: [
        {
          NSPrivacyAccessedAPIType: 'NSPrivacyAccessedAPICategoryUserDefaults',
          NSPrivacyAccessedAPITypeReasons: ['CA92.1'],
        },
        {
          NSPrivacyAccessedAPIType: 'NSPrivacyAccessedAPICategoryFileTimestamp',
          NSPrivacyAccessedAPITypeReasons: ['C617.1'],
        },
      ],
    },
  },
  android: {
    package: BundleId,
    adaptiveIcon: {
      backgroundColor: '#0F3D38',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
  },
  web: {
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  locales: {
    'zh-Hant': './languages/zh-Hant.json',
    en: './languages/en.json',
  },
  plugins: [
    'expo-router',
    'expo-secure-store',
    'expo-sharing',
    [
      'expo-local-authentication',
      {
        faceIDPermission: '用於鎖定扣款清，避免他人查看你的訂閱與支出。',
      },
    ],
    [
      'expo-splash-screen',
      {
        backgroundColor: '#0F3D38',
        image: './assets/images/splash-icon.png',
        imageWidth: 96,
        dark: {
          backgroundColor: '#071615',
          image: './assets/images/splash-icon.png',
        },
      },
    ],
    './modules/clearbill-icloud/plugin.js',
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    ...(process.env.EAS_PROJECT_ID ? { eas: { projectId: process.env.EAS_PROJECT_ID } } : {}),
    iCloudContainer: ICloudContainer,
    iapRemoveAdsProductId: process.env.EXPO_PUBLIC_IAP_REMOVE_ADS_ID ?? '',
    admobIosAppId: admobIosAppId ?? '',
    admobAndroidAppId: admobAndroidAppId ?? '',
    admobIosBannerId: process.env.EXPO_PUBLIC_ADMOB_IOS_BANNER_ID ?? '',
    admobAndroidBannerId: process.env.EXPO_PUBLIC_ADMOB_ANDROID_BANNER_ID ?? '',
  },
};

export default config;
