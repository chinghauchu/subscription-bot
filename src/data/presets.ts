export const CATEGORIES = [
  '串流影音',
  '音樂',
  '雲端',
  '通訊',
  '新聞',
  '健身',
  '外送',
  '購物會員',
  '軟體',
  '其他',
] as const;

export type Category = (typeof CATEGORIES)[number];
export type BillingCycle = 'month' | 'quarter' | 'year';

export type TaiwanPreset = {
  id: string;
  nameZh: string;
  category: Category;
  cycle: BillingCycle;
  examplePriceNtd: number | null;
  cancelHint: string;
};

const cycleMap = {
  月: 'month',
  季: 'quarter',
  年: 'year',
} as const;

function preset(
  id: string,
  nameZh: string,
  category: Category,
  typicalCycle: keyof typeof cycleMap,
  examplePriceNtd: number | null,
  cancelHint: string,
): TaiwanPreset {
  return {
    id,
    nameZh,
    category,
    cycle: cycleMap[typicalCycle],
    examplePriceNtd,
    cancelHint,
  };
}

/** 台灣常見訂閱／定期扣款預設（價格為示意，使用者可改；不自動取消） */
export const TAIWAN_PRESETS: TaiwanPreset[] = [
  preset('netflix', 'Netflix', '串流影音', '月', 290, '網頁帳號 > 取消方案；https://www.netflix.com/cancelplan'),
  preset('disney-plus', 'Disney+', '串流影音', '月', 270, 'https://www.disneyplus.com/account'),
  preset('youtube-premium', 'YouTube Premium', '串流影音', '月', 179, 'https://www.youtube.com/paid_memberships'),
  preset('apple-tv-plus', 'Apple TV+', '串流影音', '月', 90, '設定 > Apple ID > 訂閱'),
  preset('prime-video', 'Prime Video（Amazon）', '串流影音', '月', null, 'Amazon 帳號 > 會員與訂閱'),
  preset('hami-video', 'Hami Video', '串流影音', '月', 250, 'Hami Video App／中華會員中心'),
  preset('friday', 'friDay 影音', '串流影音', '月', 240, '遠傳 friDay／會員中心'),
  preset('myvideo', 'MyVideo', '串流影音', '月', 199, '台哥大 MyVideo 會員'),
  preset('catchplay', 'CatchPlay+', '串流影音', '月', 270, 'CatchPlay 帳號管理'),
  preset('iqiyi', 'IQIYI 愛奇藝', '串流影音', '月', 230, '愛奇藝台灣站／App 訂閱管理'),
  preset('spotify', 'Spotify', '音樂', '月', 149, 'https://www.spotify.com/tw/account/subscription/'),
  preset('apple-music', 'Apple Music', '音樂', '月', 150, '設定 > Apple ID > 訂閱'),
  preset('kkbox', 'KKBOX', '音樂', '月', 149, 'https://www.kkbox.com/account/'),
  preset('line-music', 'LINE MUSIC', '音樂', '月', 149, 'LINE MUSIC App > 設定 > 訂閱'),
  preset('youtube-music', 'YouTube Music', '音樂', '月', 149, '多與 YouTube Premium 綁定；https://www.youtube.com/paid_memberships'),
  preset('streetvoice', 'streetvoice 街聲（會員）', '音樂', '月', null, '街聲帳號會員中心'),
  preset('icloud-plus', 'iCloud+', '雲端', '月', 90, '設定 > Apple ID > iCloud > 管理方案'),
  preset('google-one', 'Google One', '雲端', '月', 70, 'https://one.google.com/settings'),
  preset('dropbox', 'Dropbox', '雲端', '月', null, 'https://www.dropbox.com/account/plan'),
  preset('microsoft-365', 'Microsoft 365', '雲端', '年', 2190, 'https://account.microsoft.com/services'),
  preset('cht-mobile', '中華電信門號月租', '通訊', '月', 599, 'https://www.cht.com.tw/ （門市／客服辦退租或改速）'),
  preset('fet-mobile', '遠傳門號月租', '通訊', '月', 599, 'https://www.fetnet.net/'),
  preset('twm-mobile', '台灣大哥大門號月租', '通訊', '月', 599, 'https://www.taiwanmobile.com/'),
  preset('home-broadband', '家用寬頻／光纖', '通訊', '月', 999, '向原業者辦退租／移機'),
  preset('line-stickers', 'LINE 貼圖／主題連續包', '通訊', '月', 30, 'LINE > 設定 > 付款 > 訂閱管理'),
  preset('udn', '聯合報／聯合線上', '新聞', '月', null, '會員中心取消'),
  preset('cw', '天下雜誌數位', '新聞', '年', null, '天下會員中心'),
  preset('mirrormedia', '鏡週刊／鏡文學會員', '新聞', '月', null, '鏡週刊會員中心'),
  preset('tnl', 'The News Lens 關鍵評論網', '新聞', '月', null, '會員取消頁'),
  preset('apple-news-plus', 'Apple News+', '新聞', '月', 120, '設定 > Apple ID > 訂閱（視地區可用性）'),
  preset('world-gym', 'World Gym 會籍', '健身', '月', null, '依合約至會所／客服解約；勿僅刪 App'),
  preset('fitness-factory', '健身工廠', '健身', '月', null, '依合約辦理'),
  preset('beingfit', 'BeingFit／其它連鎖健身房', '健身', '月', null, '合約＋客服；名稱可自訂'),
  preset('pure-yoga', 'Pure Yoga／瑜珈館會籍', '健身', '月', null, '館內櫃檯／合約'),
  preset('apple-fitness', 'Apple Fitness+', '健身', '月', 150, '設定 > Apple ID > 訂閱'),
  preset('uber-one', 'Uber One／Uber Eats 會員', '外送', '月', 75, 'Uber App > 帳戶 > Uber One'),
  preset('pandapro', 'foodpanda pandapro', '外送', '月', 75, 'foodpanda App > pandapro 管理'),
  preset('delivery-generic', '熊貓／外送加值（通用）', '外送', '月', null, '各 App 內會員頁'),
  preset('amazon-prime', 'Amazon Prime', '購物會員', '年', null, 'Amazon 帳戶 > Prime 會員資格'),
  preset('momo', 'momo 富摩卡／momo 會員', '購物會員', '年', null, 'momo App／網頁會員中心'),
  preset('pchome', 'PChome 會員加值', '購物會員', '年', null, 'PChome 會員中心'),
  preset('costco', 'Costco 美語會員', '購物會員', '年', 1350, '好市多服務台／官網續約說明；停訂依會員規則'),
  preset('shopee', '蝦皮／商城付費活動包', '購物會員', '月', null, '各平台訂單與自動續訂設定'),
  preset('adobe', 'Adobe Creative Cloud', '軟體', '月', null, 'https://account.adobe.com/plans'),
  preset('notion', 'Notion AI／Plus', '軟體', '月', null, 'Notion Settings > Plans'),
  preset('chatgpt', 'ChatGPT Plus', '軟體', '月', 620, 'https://chatgpt.com/ （Settings > Subscription）'),
  preset('github', 'GitHub Pro／Copilot', '軟體', '月', null, 'https://github.com/settings/billing'),
  preset('1password', '1Password／密碼管理器', '軟體', '年', null, '各廠商帳號 Billing'),
  preset('setapp', 'setapp／其它軟體組', '軟體', '月', null, '各廠商帳號訂閱管理'),
  preset('game-pass', '遊戲訂閱（Xbox Game Pass／PS Plus）', '其他', '月', null, '各平台帳號訂閱管理'),
  preset('switch-online', 'Nintendo Switch Online', '其他', '年', 240, '任天堂帳號商店訂閱'),
  preset('irent', 'iRent／共享汽機車月費', '其他', '月', null, '各業者 App 會員'),
  preset('parking', '停車場月租', '其他', '月', null, '向場地方解約'),
  preset('insurance', '保險（旅平／車險／壽險定期）', '其他', '年', null, '依保單聯繫業務／客服；勿僅刪 App'),
  preset('taipower', '台電電費（定期）', '其他', '月', null, 'https://www.taipower.com.tw/'),
  preset('tapwater', '自來水費（定期）', '其他', '月', null, 'https://www.water.gov.tw/'),
  preset('gas', '瓦斯費（定期）', '其他', '月', null, '向當地瓦斯業者'),
  preset('custom', '自訂訂閱', '其他', '月', null, '使用者自行填名稱與取消方式'),
];

export const CATEGORY_ACCENT: Record<Category, string> = {
  串流影音: '#C2410C',
  音樂: '#7C3AED',
  雲端: '#0369A1',
  通訊: '#0F766E',
  新聞: '#B45309',
  健身: '#BE123C',
  外送: '#B45309',
  購物會員: '#1D4ED8',
  軟體: '#4338CA',
  其他: '#3F6212',
};

export function cycleLabel(cycle: BillingCycle): string {
  if (cycle === 'year') return '年繳';
  if (cycle === 'quarter') return '季繳';
  return '月繳';
}

export function findPreset(id: string): TaiwanPreset | undefined {
  return TAIWAN_PRESETS.find((item) => item.id === id);
}
