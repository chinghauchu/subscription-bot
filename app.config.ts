import type { ExpoConfig } from 'expo/config';

const ICloudContainer = 'iCloud.app.subassist.tw';
const BundleId = 'app.subassist.tw';
const PrivacyUrl =
  process.env.EXPO_PUBLIC_PRIVACY_URL?.trim() ||
  'https://chinghauchu.github.io/subscription-bot/privacy.html';
const TermsUrl =
  process.env.EXPO_PUBLIC_TERMS_URL?.trim() ||
  'https://chinghauchu.github.io/subscription-bot/terms.html';

const admobIosAppId = process.env.EXPO_PUBLIC_ADMOB_IOS_APP_ID?.trim();
const admobAndroidAppId = process.env.EXPO_PUBLIC_ADMOB_ANDROID_APP_ID?.trim();

const config: ExpoConfig = {
  name: '訂閱助手',
  slug: 'sub-assist',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'sub-assist',
  userInterfaceStyle: 'automatic',
  primaryColor: '#0F6E62',
  ios: {
    bundleIdentifier: BundleId,
    supportsTablet: true,
    usesIcloudStorage: true,
    icon: './assets/expo.icon',
    infoPlist: {
      CFBundleDisplayName: '訂閱助手',
      CFBundleAllowMixedLocalizations: true,
      NSFaceIDUsageDescription: '用於鎖定訂閱助手，避免他人查看你的訂閱與支出。',
      ITSAppUsesNonExemptEncryption: false,
      NSUbiquitousContainers: {
        [ICloudContainer]: {
          NSUbiquitousContainerIsDocumentScopePublic: true,
          NSUbiquitousContainerName: '訂閱助手',
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
        faceIDPermission: '用於鎖定訂閱助手，避免他人查看你的訂閱與支出。',
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
    './modules/subassist-icloud/plugin.js',
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    ...(process.env.EAS_PROJECT_ID ? { eas: { projectId: process.env.EAS_PROJECT_ID } } : {}),
    iCloudContainer: ICloudContainer,
    privacyUrl: PrivacyUrl,
    termsUrl: TermsUrl,
    iapRemoveAdsProductId: process.env.EXPO_PUBLIC_IAP_REMOVE_ADS_ID ?? '',
    admobIosAppId: admobIosAppId ?? '',
    admobAndroidAppId: admobAndroidAppId ?? '',
    admobIosBannerId: process.env.EXPO_PUBLIC_ADMOB_IOS_BANNER_ID ?? '',
    admobAndroidBannerId: process.env.EXPO_PUBLIC_ADMOB_ANDROID_BANNER_ID ?? '',
  },
};

export default config;
