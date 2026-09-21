export type CleanupTemplateId = 'quit' | 'move' | 'new_phone' | 'sell_phone';

export type CleanupItem = {
  id: string;
  title: string;
  detail?: string;
  links?: { label: string; url: string }[];
};

export type CleanupGroup = {
  id: string;
  title: string;
  items: CleanupItem[];
};

export type CleanupTemplate = {
  id: CleanupTemplateId;
  title: string;
  shortTitle: string;
  emoji: string;
  intro: string;
  accent: string;
  groups: CleanupGroup[];
};

function item(id: string, title: string, detail?: string, links?: CleanupItem['links']): CleanupItem {
  return { id, title, detail, links };
}

export const CLEANUP_TEMPLATES: CleanupTemplate[] = [
  {
    id: 'quit',
    title: '離職',
    shortTitle: '離職',
    emoji: '🧳',
    accent: '#0F6E62',
    intro:
      '離職前後，把公司信箱、員工優惠訂閱、通勤與通訊相關的自動扣款清一遍，避免錢還在扣、權限卻沒了。逐項打勾即可；取消請到各服務官網或 App 完成。本 App 不會代為登入或自動取消。',
    groups: [
      {
        id: 'subs',
        title: '訂閱',
        items: [
          item(
            'quit-1',
            '取消公司信箱／教育優惠綁定的串流',
            'Netflix、Disney+、YouTube Premium 等——改回個人方案或停訂。',
            [
              { label: 'Netflix 取消方案', url: 'https://www.netflix.com/cancelplan' },
              { label: 'Disney+ 帳號', url: 'https://www.disneyplus.com/account' },
              { label: 'YouTube 會員', url: 'https://www.youtube.com/paid_memberships' },
            ],
          ),
          item(
            'quit-2',
            '檢查員工價音樂／有聲是否仍扣個人卡',
            'Spotify、Apple Music、KKBOX、LINE MUSIC。',
            [
              { label: 'Spotify 訂閱', url: 'https://www.spotify.com/tw/account/subscription/' },
              { label: 'KKBOX 帳號', url: 'https://www.kkbox.com/account/' },
              { label: 'Apple 訂閱', url: 'https://apps.apple.com/account/subscriptions' },
            ],
          ),
          item(
            'quit-3',
            '停用公司補助的雲端／軟體',
            'Google Workspace 個人加購、Microsoft 365、Adobe、Notion 團隊席次。',
            [
              { label: 'Google One', url: 'https://one.google.com/settings' },
              { label: 'Microsoft 服務', url: 'https://account.microsoft.com/services' },
              { label: 'Adobe 方案', url: 'https://account.adobe.com/plans' },
            ],
          ),
          item('quit-4', '取消職涯／學習訂閱', 'LinkedIn Premium、線上課程年繳——確認是否自動續約。'),
        ],
      },
      {
        id: 'comms',
        title: '通訊',
        items: [
          item('quit-5', '退出公司 Slack／Teams／Discord', '關閉手機通知與自動登入。'),
          item(
            'quit-6',
            '公司配發門號／公務 SIM：辦退租或過戶',
            '確認加值服務已停。',
            [
              { label: '中華電信', url: 'https://www.cht.com.tw/' },
              { label: '遠傳', url: 'https://www.fetnet.net/' },
              { label: '台灣大哥大', url: 'https://www.taiwanmobile.com/' },
            ],
          ),
          item('quit-7', '公務 LINE／WeChat 工作帳', '備份後登出；關閉與私人帳號的同步。'),
        ],
      },
      {
        id: 'money',
        title: '金流',
        items: [
          item('quit-8', '更新薪轉／扣款帳戶', '停止對公司戶的定期轉帳、團保自付額。'),
          item('quit-9', '檢查信用卡帳單', '標註仍扣款的「公司優惠」訂閱並一一取消。'),
          item('quit-10', '辦停或改址：職工福利、團保、職災相關自費加保', '依人資文件與保單辦理。'),
        ],
      },
      {
        id: 'devices',
        title: '裝置',
        items: [
          item('quit-11', '公司筆電／手機登出個人帳號', 'Apple ID、Google、iCloud、密碼管理器。'),
          item('quit-12', '撤銷公司裝置上的個人 App 登入', '銀行、支付、健康等。'),
          item('quit-13', '歸還門禁卡、VPN、硬體金鑰', '確認遠端帳號已停用。'),
        ],
      },
      {
        id: 'misc',
        title: '雜項',
        items: [
          item('quit-14', '取消員工停車場、共享汽機車企業方案', 'iRent、GoShare 企業等。'),
          item('quit-15', '停用辦公室周邊外送企業碼／儲值', 'Uber Eats、foodpanda 企業。'),
          item('quit-16', '更新履歷與求職平台通知', '避免舊公司信箱收驗證信。'),
          item('quit-17', '在扣款清把已取消項目標記完成', '本月總覽再對一次卡況。'),
          item('quit-18', '其它公司專屬訂閱或扣款', '可在下方新增自訂項目。'),
        ],
      },
    ],
  },
  {
    id: 'move',
    title: '搬家',
    shortTitle: '搬家',
    emoji: '📦',
    accent: '#1D4ED8',
    intro:
      '地址變了，訂閱與帳單常還寄到舊家。這份清單幫你改地址、停舊居費用、開新居必要服務，並清掉用不到的會員。取消與過戶請到各業者完成。',
    groups: [
      {
        id: 'subs',
        title: '訂閱',
        items: [
          item('move-1', '更新串流／購物會員的帳單地址與電話', 'Netflix、Amazon、momo 等。'),
          item('move-2', '新聞／雜誌紙本改寄或改數位'),
          item('move-3', '取消舊居才用得到的服務', '社區頻道、地區限定會員。'),
        ],
      },
      {
        id: 'comms',
        title: '通訊',
        items: [
          item(
            'move-4',
            '門號與寬頻：辦理移機、續約或退租',
            '中華／遠傳／台哥大。',
            [
              { label: '中華電信', url: 'https://www.cht.com.tw/' },
              { label: '遠傳', url: 'https://www.fetnet.net/' },
              { label: '台灣大哥大', url: 'https://www.taiwanmobile.com/' },
            ],
          ),
          item('move-5', '更新門號通訊錄常用聯絡', '房東、管委、新居鄰里。'),
          item('move-6', '歸還舊業者數據機／ONT', '避免續扣機租。'),
        ],
      },
      {
        id: 'utilities',
        title: '金流／公用事業',
        items: [
          item('move-7', '台電：舊址退租／結清；新址過戶或新裝', undefined, [
            { label: '台電', url: 'https://www.taipower.com.tw/' },
          ]),
          item('move-8', '自來水：舊址停用、新址申請', undefined, [
            { label: '台灣自來水', url: 'https://www.water.gov.tw/' },
          ]),
          item('move-9', '瓦斯（天然氣／桶裝）通知舊新地址業者', '避免基本費續扣。'),
          item('move-10', '管理費／社區費', '舊社區結清；新社區約定轉帳。'),
          item('move-11', '信用卡／銀行更新通訊地址與帳單寄送', '網銀設定。'),
        ],
      },
      {
        id: 'devices',
        title: '裝置',
        items: [
          item('move-12', '印表機、智慧喇叭、監控改連新 Wi‑Fi', '刪舊屋自動化場景。'),
          item('move-13', '更新 Apple／Google 帳號配送與家人共享地址'),
        ],
      },
      {
        id: 'misc',
        title: '雜項',
        items: [
          item('move-14', '健保／戶籍相關通訊地址', '若已遷籍，依戶政流程；非 App 內完成。'),
          item('move-15', '外送、電商常用地址改為新居', '刪除舊地址避免送錯。'),
          item('move-16', '停車場月租、共享機車常用站點改設定'),
          item('move-17', '在扣款清核對本月公用事業與電信金額', '可在下方新增自訂項目。'),
        ],
      },
    ],
  },
  {
    id: 'new_phone',
    title: '換機',
    shortTitle: '換機',
    emoji: '📱',
    accent: '#7C3AED',
    intro:
      '換新 iPhone／iPad 前後，把帳號、支付、雙重驗證與訂閱登入移轉乾淨，舊機恢復原廠設定，避免訂閱綁在已不使用的裝置上。',
    groups: [
      {
        id: 'subs',
        title: '訂閱',
        items: [
          item(
            'phone-1',
            '確認 Apple ID 訂閱在新機可管理',
            'iCloud+、Apple Music、Arcade、TV+ 等。',
            [{ label: 'Apple 訂閱', url: 'https://apps.apple.com/account/subscriptions' }],
          ),
          item(
            'phone-2',
            'Google Play／YouTube／Google One 在新機登入並檢查續約',
            undefined,
            [
              { label: 'Google One', url: 'https://one.google.com/settings' },
              { label: 'YouTube 會員', url: 'https://www.youtube.com/paid_memberships' },
            ],
          ),
          item('phone-3', '串流 App 在新機重新登入', '檢查同時登入裝置數是否超限（例如 Netflix）。'),
        ],
      },
      {
        id: 'comms',
        title: '通訊',
        items: [
          item('phone-4', '門號 eSIM／實體 SIM 移轉完成', '測試收發簡訊（銀行 OTP 用）。'),
          item('phone-5', 'LINE 帳號移轉／備份還原', '關閉舊機自動登入。'),
          item('phone-6', '通訊錄與 iMessage／FaceTime 用新機門號驗證'),
        ],
      },
      {
        id: 'money',
        title: '金流',
        items: [
          item('phone-7', 'Apple Pay、全支付、街口、Line Pay 在新機重新加入', '重新驗證卡片。'),
          item('phone-8', '銀行 App：撤銷舊機裝置綁定', '新機重新綁定與生物辨識。'),
          item('phone-9', '確認訂閱扣款卡仍為有效卡'),
        ],
      },
      {
        id: 'devices',
        title: '裝置',
        items: [
          item('phone-10', '舊機：登出 iCloud、關閉「尋找」、解除配對 Watch／雙耳'),
          item('phone-11', '舊機：清除所有內容和設定', '設定 → 一般 → 轉移或重置。確認已備份。'),
          item('phone-12', '新機：Face ID 重錄，並依需求開啟鎖定模式'),
          item('phone-13', '密碼管理器、驗證器 App（OTP）確認種子已遷移', '否則先勿清除舊機。'),
        ],
      },
      {
        id: 'misc',
        title: '雜項',
        items: [
          item('phone-14', '健康／運動手環、車用藍牙重新配對'),
          item('phone-15', '在扣款清用新機開啟並核對訂閱列表', '若有匯出備份，先匯入。'),
          item('phone-16', '其它只裝在舊機的付費 App／會員', '可在下方新增自訂項目。'),
        ],
      },
    ],
  },
  {
    id: 'sell_phone',
    title: '賣機',
    shortTitle: '賣機',
    emoji: '🏷️',
    accent: '#B45309',
    intro:
      '賣出或回收舊機前，必須解除 Apple ID、支付與個資。這份清單偏「清除與停用」——賣出後就無法再靠這台手機收 OTP 或取消訂閱，請先做完再成交。',
    groups: [
      {
        id: 'subs',
        title: '訂閱',
        items: [
          item('sell-1', '先處理完所有訂閱取消／改卡', '賣出後難收驗證簡訊。'),
          item(
            'sell-2',
            '檢查 Apple 訂閱與「與購買項目共享」',
            '不需要的先取消。',
            [{ label: 'Apple 訂閱', url: 'https://apps.apple.com/account/subscriptions' }],
          ),
          item('sell-3', '退出家庭共享', '若舊機是組織者，先轉移組織者。'),
          item(
            'sell-4',
            '從串流／音樂／雲端裝置列表移除本機',
            undefined,
            [
              { label: 'Netflix 帳號', url: 'https://www.netflix.com/YourAccount' },
              { label: 'Spotify 帳號', url: 'https://www.spotify.com/tw/account/' },
            ],
          ),
        ],
      },
      {
        id: 'comms',
        title: '通訊',
        items: [
          item('sell-5', '門號若跟著機子賣：先辦過戶或拔卡／取消 eSIM', '勿賣出後才發現門號還在。'),
          item('sell-6', 'LINE：備份後登出', '必要時在新裝置完成帳號保護。'),
          item('sell-7', 'iMessage／FaceTime 停用門號關聯後再清除'),
        ],
      },
      {
        id: 'money',
        title: '金流',
        items: [
          item('sell-8', '移除 Apple Pay 所有卡片', '刪除全支付／街口等 App 內綁定或先登出。'),
          item('sell-9', '銀行 App 解除裝置信任', '依各銀行通知客服撤銷該裝置。'),
          item('sell-10', '確認沒有只靠此機收簡訊的訂閱或證券驗證'),
        ],
      },
      {
        id: 'devices',
        title: '裝置（關鍵）',
        items: [
          item(
            'sell-11',
            '關閉「尋找」並從帳號移除裝置',
            '設定 → [你的名字] → 尋找 → 關閉；或 iCloud 網頁移除。',
            [{ label: '尋找', url: 'https://www.icloud.com/find' }],
          ),
          item('sell-12', '登出 iCloud、iTunes／Media、Game Center'),
          item('sell-13', '取消配對 Apple Watch、藍牙配件'),
          item('sell-14', '清除所有內容和設定', '開機應出現「您好」設定畫面（未登入才可交易）。'),
          item('sell-15', '若無法解鎖／無法關尋找：不要出售', '走官方流程或回收商合格管道。'),
        ],
      },
      {
        id: 'misc',
        title: '雜項',
        items: [
          item('sell-16', '刊登前拍照序號／外觀', '保留清除完成的開機畫面照片作證明。'),
          item('sell-17', '僅透過可信回收商／二手平台', '勿提供 Apple ID 密碼給買家。'),
          item('sell-18', '在扣款清將與舊機相關的提醒勾完', '可在下方新增自訂項目。'),
        ],
      },
    ],
  },
];

export function getCleanupTemplate(id: string): CleanupTemplate | undefined {
  return CLEANUP_TEMPLATES.find((template) => template.id === id);
}

export function flattenTemplateItems(template: CleanupTemplate): CleanupItem[] {
  return template.groups.flatMap((group) => group.items);
}
