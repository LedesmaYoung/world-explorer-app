# 🌍 小小环球旅行家

> 一款专为 3-6 岁幼儿设计的世界国旗探索游戏，让孩子在游戏中认识世界各国国旗、学习地理知识。

![Version](https://img.shields.io/badge/版本-2.0.0-blue)
![Platform](https://img.shields.io/badge/平台-iPad%20(iOS%2026+)-green)
![License](https://img.shields.io/badge/协议-MIT-orange)

## 📖 项目简介

小小环球旅行家是一个寓教于乐的儿童教育应用，通过游戏化的方式帮助幼儿认识世界各国的国旗、地理位置和基础文化知识。支持多个旅行家档案管理，完美适配亲子互动场景。

### ✨ 核心特性

- 🎮 **多种游戏玩法**：颜色辨识、国旗点击、拼图游戏、翻牌配对、涂色创作、垃圾分类游戏
- 🔊 **语音引导**：全程语音提示，解决幼儿识字困难
- 👨‍👩‍👧‍👦 **亲子互动**：支持双人对战的翻牌配对游戏
- 🎨 **创作画廊**：涂色作品保存与展示
- ♻️ **垃圾分类百科**：包含 200+ 种垃圾物品的详细分类信息
- 📱 **原生 APP**：基于 Capacitor 打包的 iOS 原生应用，完全离线可用
- 👤 **多用户管理**：支持最多 3 个旅行家档案

## 🎯 目标用户

- **主要用户**：3-6 岁幼儿
- **使用场景**：亲子互动、早期教育、地理启蒙
- **设计理念**：简单直观、趣味性强、教育性高

## 🗂️ 项目结构

```
world-explorer/
├── index.html              # 主页面
├── capacitor.config.json   # Capacitor 配置
├── package.json            # npm 配置
├── css/                    # 样式文件
│   ├── style.css          # 主样式
│   ├── traveler.css       # 旅行家相关样式
│   ├── games.css          # 游戏模块样式
│   └── transitions.css    # 页面过渡动画
├── js/                     # JavaScript 模块
│   ├── app.js             # 主应用逻辑
│   ├── data.js            # 国家数据配置（107 国）
│   ├── storage.js         # 本地存储管理
│   ├── audio.js           # 音频管理
│   ├── voice.js           # 语音引导模块
│   ├── game.js            # 颜色辨识游戏
│   ├── game-tap.js        # 国旗点击游戏
│   ├── game-puzzle.js     # 拼图游戏
│   ├── game-match.js      # 翻牌配对游戏
│   ├── game-coloring.js   # 涂色创作游戏
│   ├── game-garbage.js    # 垃圾分类游戏
│   └── culture-data.js    # 文化数据
├── data/                   # 数据文件
│   └── garbage/           # 垃圾分类数据
│       ├── garbage-data.json  # 垃圾分类元数据
│       └── images/        # 垃圾物品图片
├── assets/                 # 资源文件
│   ├── audio/             # 音频文件
│   │   ├── voices/        # 国家中英文发音
│   │   └── sounds/        # 音效文件
│   └── icons/             # 图标资源
├── ios/                    # iOS 原生项目（Capacitor 生成）
│   └── App/               # Xcode 项目
├── www/                    # Web 资源目录（Capacitor 构建用）
├── docs/                   # 文档目录
└── pages/                  # 其他页面
```

## 🚀 快速开始

### 开发环境要求

- **Node.js** v18+
- **Xcode** 26+（仅 macOS）
- **npm** v9+

### 从 world-explorer-web 同步

本项目是从 world-explorer-web 同步的，主要开发在 Web 项目进行。

```bash
# 从 Web 项目同步更新
./sync-from-web.sh
```

### 本地开发

1. 克隆项目到本地
   ```bash
   git clone https://github.com/LedesmaYoung/world-explorer-app.git
   cd world-explorer
   ```

2. 安装依赖
   ```bash
   npm install
   ```

3. 本地预览（浏览器）
   ```bash
   # 使用启动脚本
   ./start.sh
   
   # 或直接打开
   open www/index.html
   ```

### 构建 iOS APP

1. 同步 Web 资源到 iOS 项目
   ```bash
   npx cap sync ios
   ```

2. 打开 Xcode
   ```bash
   npx cap open ios
   ```

3. 在 Xcode 中构建并安装到 iPad
   - 选择开发团队（Signing & Capabilities）
   - 连接 iPad
   - 点击运行按钮

### 常用命令

```bash
# 同步资源到 iOS
npx cap sync ios

# 打开 Xcode
npx cap open ios

# 添加 iOS 平台（首次）
npx cap add ios
```

## 🎮 游戏玩法

### 游戏模式

游戏提供两种模式：

| 模式 | 说明 | 适合场景 |
|------|------|---------|
| **护照模式** | 按国家探索，完成任务收集印章 | 学习探索、循序渐进 |
| **独立模式** | 直接进入游戏，挑战排行榜 | 纯娱乐、竞技挑战 |

### 印章体系（护照模式）

护照模式设计了四种类型的护照印章：

| 印章类型 | 图标 | 难度 | 游戏类型 | 适合年龄 |
|---------|------|------|---------|---------|
| 入境章 | 🛬 | ⭐ 简单 | 点击类游戏 | 3-4 岁 |
| 出境章 | 🛫 | ⭐⭐ 中等 | 拼图游戏 | 4-5 岁 |
| 纪念章 | 🌟 | ⭐⭐⭐ 挑战 | 翻牌配对游戏 | 5-6 岁 |
| 创作章 | 🎨 | ⭐⭐⭐ 创作 | 涂色创作游戏 | 5-6 岁 |

### 游戏模块

#### 护照模式游戏

##### 1. 颜色辨识游戏 🎨
- **玩法**：找出国旗上的颜色对应的气球
- **适合年龄**：3-4 岁
- **获得印章**：入境章

##### 2. 国旗点击游戏 🚩
- **玩法**：从多个国旗中找到正确的国旗
- **适合年龄**：3-5 岁
- **获得印章**：入境章

##### 3. 拼图游戏 🧩
- **玩法**：将国旗碎片拖拽到正确位置
- **适合年龄**：4-5 岁
- **获得印章**：出境章

##### 4. 翻牌配对游戏 🃏
- **玩法**：翻开两张卡片进行配对（双人竞技）
- **适合年龄**：5-6 岁
- **获得印章**：纪念章

##### 5. 涂色创作游戏 🖍️
- **玩法**：给国旗轮廓涂色，支持 16 种颜色、橡皮擦、画笔粗细调节
- **适合年龄**：5-6 岁
- **获得印章**：创作章
- **作品保存**：保存到个人画廊

#### 独立模式游戏

独立模式提供更丰富的游戏选择和难度挑战：

##### 6. 国旗点击游戏（天梯模式）🚩
- **玩法**：限时挑战，在倒计时内尽可能多地点对国旗
- **难度递增**：答对越多，选项越多、时间越紧
- **排行榜**：按最高分数排名

##### 7. 拼图游戏 🧩
- **玩法**：选择不同难度进行拼图挑战
- **难度等级**：简单（3×3）、中等（4×4）、困难（5×5）
- **排行榜**：按用时排名

##### 8. 翻牌配对游戏 🃏
- **玩法**：翻开卡片进行配对，支持双人对战
- **难度等级**：7 级（3×3 到 10×10 网格）
- **适合场景**：亲子互动、竞技挑战

##### 9. 国旗连连看 🔗
- **玩法**：连接两个相同的国旗图案进行消除
- **难度等级**：7 级（3×3 到 10×10 网格）
- **特色功能**：
  - 连线动画特效
  - 急速排行榜（按用时排名）
  - 提示功能（每局 3 次）

##### 10. 垃圾分类游戏 ♻️
- **玩法**：将垃圾物品拖拽到正确的垃圾桶进行分类
- **垃圾类型**：有害垃圾、厨余垃圾、可回收物、其他垃圾
- **游戏模式**：
  - **天梯挑战** 🏆：无限关卡，难度递增，答错 3 次结束，全球排行榜
  - **简单模式**：6 个物品，60 秒时限
  - **中等模式**：10 个物品，90 秒时限
  - **困难模式**：14 个物品，120 秒时限
- **适合年龄**：4-6 岁
- **教育意义**：培养环保意识，学习垃圾分类知识
- **数据来源**：基于《垃圾分类立体拼插游戏书》提取的真实数据

### 勋章系统

通过收集印章解锁成就勋章：

- 🥇 **新手旅行家**：收集第 1 个印章
- 🌏 **洲际探险家**：探索完整一个大洲
- 🎯 **游戏达人**：完成所有游戏类型
- 🏆 **环球旅行家**：收集所有国家印章
- 等等...

## 💾 数据存储

### 本地存储结构

应用使用 `localStorage` 存储数据，支持多旅行家档案：

```javascript
{
  travelers: [                    // 旅行家列表（最多3个）
    {
      id: 'uuid',
      name: '小明',
      avatar: '🧑‍✈️',
      createdAt: '2026-03-25'
    }
  ],
  currentTravelerId: 'uuid',      // 当前登录的旅行家
  saves: {                        // 各旅行家的存档
    'uuid': {
      collectedCountries: [],     // 已收集国家ID
      countryStamps: {},          // 国家印章记录
      unlockedBadges: [],         // 已解锁勋章
      gallery: [],                // 画廊作品
      settings: {
        soundEnabled: true,
        bgmEnabled: false
      }
    }
  }
}
```

### 数据安全

- 所有数据存储在用户本地设备
- 不涉及网络传输和服务器存储
- 用户可随时清除数据

## 🔧 开发指南

### 技术栈

- **前端框架**：原生 JavaScript（无框架依赖）
- **样式**：原生 CSS3 + CSS Variables
- **存储**：LocalStorage API
- **语音**：Web Speech API
- **原生打包**：Capacitor 8.x
- **目标平台**：iPad (iOS 26+)

### 核心模块

#### 1. 旅行家管理 (`app.js`)
```javascript
// 创建旅行家
createTraveler(name, avatar)

// 切换旅行家
switchTraveler(travelerId)

// 删除旅行家
deleteTraveler(travelerId)
```

#### 2. 存储管理 (`storage.js`)
```javascript
// 保存数据
saveTravelerData(travelerId, data)

// 加载数据
loadTravelerData(travelerId)

// 清除所有数据
clearAllData()
```

#### 3. 游戏模块
```javascript
// 颜色辨识游戏
startGame(countryId)

// 国旗点击游戏
TapGame.start(countryId, callback)

// 拼图游戏
PuzzleGame.start(countryId, callback)

// 翻牌配对游戏
MatchGame.start(countryId, callback)
MatchGame.showDifficultySelect()  // 独立模式

// 涂色创作游戏
ColoringGame.start(countryId, callback)
```

#### 4. 语音引导 (`voice.js`)
```javascript
// 播放语音
VoiceManager.speak('欢迎来到小小环球旅行家！')

// 模板语音
VoiceManager.templates.welcome()
VoiceManager.templates.continentIntro(continent)
```

### 添加新国家

在 `js/data.js` 中添加国家数据：

```javascript
{ 
  id: 'country-id', 
  name: { zh: '中文名', en: 'English Name' }, 
  fullName: '国家全称',
  continent: 'asia',              // 所属大洲
  flag: '🇨🇳',                     // 国旗 emoji
  icon: '🐼',                      // 代表图标
  capital: '首都',
  area: '面积',
  population: '人口',
  currency: '货币',
  language: '语言',
  flagColors: ['red', 'yellow'],  // 国旗颜色
  audioZh: 'assets/audio/voices/xxx_zh.m4a', 
  audioEn: 'assets/audio/voices/xxx_en.m4a' 
}
```

### 添加新游戏

1. 在 `js/` 目录创建新游戏模块文件
2. 在 `index.html` 中引入脚本
3. 在 `css/games.css` 中添加样式
4. 在 `js/app.js` 中初始化游戏模块

## 📱 设备适配

### 支持平台

- ✅ iPad (iOS 26+)

### 响应式设计

- 横屏优化
- 触摸手势优化

### 性能优化

- 静态资源懒加载
- 音频文件按需加载
- CSS 动画使用 GPU 加速

## 🐛 已知问题

- [ ] 部分老旧设备语音合成可能不支持
- [ ] 大量音频文件首次加载较慢

## 🗺️ 开发路线

### v2.0 当前版本（原生 APP 版本）

- [x] Capacitor 项目初始化
- [x] iOS 平台配置
- [x] 资源打包测试
- [x] iPad 安装验证
- [x] 移除 PWA 相关代码（Service Worker、manifest.json）
- [x] 账号/存档系统（多旅行家、独立存档、全局排行榜）
- [x] 清空存档功能

### v1.2 Web/PWA 最终版本（已归档）

- [x] 垃圾分类游戏（拖拽分类、4 种垃圾类型、200+ 物品）
- [x] 垃圾分类百科（详细的分类信息、图片展示）
- [x] 垃圾分类数据提取（从 EPUB 文件提取文字和图片）
- [x] 图片上色处理（有害垃圾红色、厨余垃圾绿色、可回收物蓝色）

### v1.1 已完成功能

- [x] 世界地图可视化（以亚洲为中心的太平洋视角）
- [x] 涂色游戏增强（橡皮擦、画笔粗细、16色、35国模板）
- [x] 语音反馈增强（随机化鼓励语、连击表扬）
- [x] 国旗连连看游戏（7级难度、急速榜单、连线特效）

### v2.1+ 后续功能规划

- [ ] 推送通知 - 提醒孩子学习
- [ ] 本地通知 - 定时提醒
- [ ] Game Center - 排行榜同步
- [ ] 增加国家音频讲解（真人录音）
- [ ] 增加家长控制面板
- [ ] 增加城市探索模块
- [ ] 增加著名景点介绍
- [ ] 增加世界美食介绍
- [ ] 增加动物世界模块

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 开发规范

- 代码风格：遵循 JavaScript Standard Style
- 注释规范：使用 JSDoc 格式
- 提交信息：使用语义化提交信息

## 📄 许可证

MIT License

## 👨‍💻 作者

- 开发团队：CodeBuddy AI + 项目所有者
- 创建日期：2026-03
- 最后更新：2026-04-10

## 🙏 致谢

- 感谢所有国旗 emoji 和图标的设计者
- 感谢 Web Speech API 提供语音支持
- 感谢所有测试用户的宝贵反馈

---

**让孩子在游戏中认识世界！** 🌍✨
