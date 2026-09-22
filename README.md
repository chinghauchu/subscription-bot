# 訂閱助手 sub-assist

看清每月自動扣款；離職／搬家／換機／賣機時，一次清點訂閱與帳號綁定。

Bundle：`app.subassist.tw`　Slug／scheme：`sub-assist`　App Store 顯示名稱：訂閱助手  
目標：App Store 上架等級 1.0（Expo SDK 57）。

- 免費 + 底部廣告佔位（無 AdMob 金鑰也不會閃退）
- NT$60 一次買斷去廣告（建議產品編號 `subassist_remove_ads`；無產品編號不閃退）
- 本機 AsyncStorage + **正式版強制走 iCloud 同步**（`iCloud.app.subassist.tw`）
- 不讀銀行／Gmail／簡訊，不自動取消第三方

## 公開頁面

GitHub Pages 靜態檔在 `docs/`。在倉庫 Settings → Pages 選擇 branch `main`、folder `/docs` 後，預期網址為：

- https://chinghauchu.github.io/subscription-bot/
- https://chinghauchu.github.io/subscription-bot/privacy.html
- https://chinghauchu.github.io/subscription-bot/terms.html

App 內 `PRIVACY_URL`／`TERMS_URL` 預設指向上述隱私權與條款頁，可用 `EXPO_PUBLIC_PRIVACY_URL`、`EXPO_PUBLIC_TERMS_URL` 覆寫。

---

# sub-assist (訂閱助手)

See monthly auto-charges clearly. When life turns — quit a job, move, get a new phone, or sell a phone — clear subscriptions in one place.

This is an Expo SDK 57 / Expo Router app for Taiwan. Core tracking is free. Ads are a bottom banner placeholder until AdMob keys exist. Remove-ads is a **NT$60 one-time** IAP stub. Suggested product id: `subassist_remove_ads`.

**Does not** read banks, Gmail, or SMS. **Does not** auto-cancel third-party services.

## Stack

- Expo SDK 57, Expo Router tabs: 總覽｜訂閱｜大掃除｜我的
- TypeScript strict
- Local persistence: `@react-native-async-storage/async-storage`
- Mandatory iCloud sync on iOS production/dev clients via local module `modules/subassist-icloud`
  - `NSUbiquitousKeyValueStore`
  - iCloud Documents (`Documents/subassist-snapshot.json`)
  - container `iCloud.app.subassist.tw`
  - config plugin + entitlements
  - Traditional Chinese status copy when signed out, in Expo Go, on Android, or on web
- Face ID lock (`expo-local-authentication`)
- CSV / JSON export (`expo-sharing`)
- Onboarding, dark mode, in-app privacy & terms

## Setup

```bash
npm install
cp .env.example .env.local   # optional keys; app runs without them
npx tsc --noEmit
npx expo start
```

iCloud native code is **not** available in Expo Go. Use a development build:

```bash
npx eas build --profile development --platform ios
```

## Environment

See `.env.example`. Missing AdMob / IAP keys must never crash:

| Variable | Purpose |
| --- | --- |
| `EXPO_PUBLIC_IAP_REMOVE_ADS_ID` | App Store non-consumable product id (`subassist_remove_ads`) |
| `EXPO_PUBLIC_PRIVACY_URL` | Privacy page. Default: GitHub Pages `privacy.html` |
| `EXPO_PUBLIC_TERMS_URL` | Terms page. Default: GitHub Pages `terms.html` |
| `EXPO_PUBLIC_ADMOB_IOS_APP_ID` / `_ANDROID_` | App IDs (do not enable the native ads plugin until real) |
| `EXPO_PUBLIC_ADMOB_IOS_BANNER_ID` / `_ANDROID_` | Banner units |
| `EAS_PROJECT_ID` | After `eas init` |

## iCloud

Entitlements are declared in `app.config.ts` and `modules/subassist-icloud/plugin.js`:

- `com.apple.developer.icloud-container-identifiers` = `iCloud.app.subassist.tw`
- iCloud Documents + KVS (`$(TeamIdentifierPrefix)app.subassist.tw`)

On Apple Developer, enable iCloud (Documents + Key-value storage) for App ID `app.subassist.tw` and create the container.

## EAS

`eas.json` includes `development`, `development-simulator`, `preview`, and `production` profiles.

```bash
npx eas-cli init     # once, then paste project id into EAS_PROJECT_ID
npx eas build -p ios --profile production
```

## Privacy boundary

Manual entry only. Cleanup checklists include official links as hints. The app never logs into Netflix, carriers, or banks for you.

## License

MIT. App Store name: 訂閱助手. English brand / slug / scheme: sub-assist.
