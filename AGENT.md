# 🤖 AI 开发助手指南

> 本文档专为 AI 编程助手（如 CodeBuddy、Claude、ChatGPT 等）设计，提供项目开发的完整上下文和规范。

**最后更新：2026-04-09**

---

## 🚀 项目运行规范

### 开发环境要求

- **Node.js** v18+
- **Xcode** 26+（仅 macOS）
- **npm** v9+

### 本地开发

```bash
# 1. 安装依赖
npm install

# 2. 本地预览（浏览器）
./start.sh
# 或
open www/index.html
```

### 构建 iOS APP

```bash
# 1. 同步 Web 资源到 iOS 项目
npx cap sync ios

# 2. 打开 Xcode
npx cap open ios

# 3. 在 Xcode 中构建并安装到 iPad
# - 选择开发团队（Signing & Capabilities）
# - 连接 iPad
# - 点击运行按钮
```

### 常用命令

```bash
# 同步资源到 iOS
npx cap sync ios

# 打开 Xcode
npx cap open ios

# 添加 iOS 平台（首次）
npx cap add ios
```

### 注意事项

- 修改 Web 代码后需执行 `npx cap sync ios` 同步到 iOS 项目
- iOS 项目文件在 `ios/` 目录，由 Capacitor 自动生成
- Web 资源目录为 `www/`

---

## 📋 项目概述

### 项目名称
小小环球旅行家（World Explorer）

### 项目类型
儿童教育类 iOS 原生应用（基于 Capacitor 打包）

### 核心功能
- 世界国旗认知教育
- 多种游戏化学习方式
- 亲子互动竞技模式
- 创作与展示功能
- 垃圾分类教育与游戏

### 目标用户
3-6 岁幼儿及其家长

### 目标平台
iPad (iOS 26+)

### 技术栈
- 原生 JavaScript（无框架）
- 原生 CSS3
- LocalStorage API
- Web Speech API
- Capacitor 8.x（原生打包）

---

## 🎯 AI 助手使用指南

### 修改代码前的检查清单

在修改任何代码前，请务必：

1. ✅ **阅读本文档** - 了解项目架构和规范
2. ✅ **检查相关文件** - 阅读涉及的模块代码
3. ✅ **理解数据流** - 确认数据存储和传递方式
4. ✅ **考虑多用户** - 所有数据操作都要考虑多旅行家场景
5. ✅ **保持一致性** - 遵循现有代码风格和命名规范

### 常见任务快速指南

#### 添加新国家
```javascript
// 文件：js/data.js
// 位置：COUNTRIES 数组中
{
  id: 'unique-id',           // 唯一标识符，使用英文短横线
  name: { zh: '中文名', en: 'English' },
  fullName: '国家全称',
  continent: 'asia',         // 大洲 ID
  flag: '🇨🇳',               // 国旗 emoji
  icon: '🐼',                // 代表性 emoji
  capital: '首都',
  area: '面积',
  population: '人口',
  currency: '货币',
  language: '语言',
  flagColors: ['red', 'yellow'],
  audioZh: 'assets/audio/voices/xxx_zh.m4a',
  audioEn: 'assets/audio/voices/xxx_en.m4a'
}
```

#### 添加新游戏模块
```javascript
// 1. 创建 js/game-xxx.js
const NewGame = {
  config: { /* 配置 */ },
  elements: {},
  
  init() {
    // 初始化 DOM 元素缓存
  },
  
  start(countryId, callback) {
    // 开始游戏
  },
  
  close() {
    // 关闭游戏
  }
};

window.NewGame = NewGame;

// 2. 在 index.html 中引入
<script src="js/game-xxx.js"></script>

// 3. 在 js/app.js 的 initApp() 中初始化
NewGame.init();
```

#### 修改存储结构
```javascript
// 文件：js/storage.js
// 注意：修改后要考虑数据迁移

// 添加新字段到 defaultSaveData
const defaultSaveData = {
  // ... 现有字段
  newField: []  // 新字段
};

// 数据迁移逻辑（在 loadTravelerData 中）
function migrateOldData(data) {
  if (!data.newField) {
    data.newField = [];  // 为旧数据添加新字段
  }
  return data;
}
```

---

## 🏗️ 架构说明

### 模块依赖关系

```
app.js (主应用)
  ├── voice.js (语音模块)
  ├── audio.js (音频管理)
  ├── storage.js (存储管理)
  ├── data.js (数据配置)
  ├── game.js (颜色辨识)
  ├── game-tap.js (点击游戏)
  ├── game-puzzle.js (拼图游戏)
  ├── game-match.js (翻牌配对)
  ├── game-coloring.js (涂色创作)
  └── game-garbage.js (垃圾分类)
```

### 数据流向

```
用户操作 
  → 游戏模块处理
    → storage.js 保存数据
      → localStorage 持久化
        → UI 更新
```

### 页面流转

```
旅行家选择页面
  ↓ 创建/选择旅行家
主页面（世界地图 - 以亚洲为中心的太平洋视角）
  ↓ 点击大洲
大洲国家列表
  ↓ 点击国家
国家详情弹窗
  ↓ 点击获取护照
游戏选择/启动
  ↓ 完成游戏
获得印章弹窗
```

---

## 🗺️ 世界地图设计

### 地图视角

项目采用**以亚洲为中心的太平洋视角**（东亚国家常用投影方式）：

```
布局示意：
┌─────────────────────────────────────┐
│  欧洲        亚洲         北美洲    │
│  🏰          🐼           🦅        │
│                                      │
│  非洲        大洋洲       南美洲    │
│  🦁          🦘           🦜        │
└─────────────────────────────────────┘
```

### 技术实现

- **格式**：SVG `<path>` 定义各大洲轮廓
- **交互**：hover 高亮、点击进入大洲国家列表
- **样式**：各大洲独立配色，儿童友好的柔和色彩
- **文件**：`index.html` 内嵌 SVG，`css/style.css` 定义样式

---

## 📐 代码规范

### 命名约定

#### JavaScript
```javascript
// 常量：大写下划线
const MAX_TRAVELERS = 3;
const STORAGE_KEY = 'world_explorer_data';

// 函数：驼峰命名
function getCountryById(id) { }
function updateHomeStatus() { }

// 对象/模块：帕斯卡命名
const MatchGame = { };
const VoiceManager = { };

// DOM 元素 ID：小写短横线
// <div id="match-game-modal">
// <button id="sound-btn">
```

#### CSS
```css
/* 类名：小写短横线 */
.match-game-modal { }
.player-avatar { }

/* BEM 命名（可选） */
.match__player--active { }

/* 状态类：使用形容词 */
.active, .disabled, .flipped, .matched

/* 动画类：动词 */
.slide-in, .fade-out
```

#### HTML
```html
<!-- 使用语义化标签 -->
<header>, <footer>, <main>, <section>

<!-- 按钮使用 button 而非 div -->
<button class="match-skip-btn">✕ 跳过</button>

<!-- 添加注释标注模块边界 -->
<!-- ===== 翻牌配对游戏弹窗 ===== -->
<div id="match-game-modal">
```

### 注释规范

```javascript
/**
 * 函数说明
 * @param {string} countryId - 国家ID
 * @param {function} callback - 回调函数，参数为成功与否
 * @returns {boolean} 是否成功启动
 */
function startGame(countryId, callback) {
  // 实现代码
}

// 单行注释：说明"为什么"而非"是什么"
const MAX_TRAVELERS = 3;  // 最多3个旅行家，避免数据过大

// TODO 注释
// TODO: 未来支持导入导出存档

// FIXME 注释
// FIXME: 某些设备语音合成不稳定，需要添加降级方案
```

### 代码组织

```javascript
// 模块标准结构
const ModuleName = {
  // 1. 配置
  config: { },
  
  // 2. 状态
  state: { },
  
  // 3. DOM 元素
  elements: { },
  
  // 4. 初始化
  init() { },
  
  // 5. 公共方法
  publicMethod() { },
  
  // 6. 私有方法（约定用下划线开头）
  _privateMethod() { },
  
  // 7. 事件处理
  handleEvent() { }
};

// 导出模块
window.ModuleName = ModuleName;
```

---

## 🐛 常见问题与解决方案

### 问题 1：多旅行家数据混乱

**症状**：切换旅行家后，数据未正确更新

**原因**：未使用 `getCurrentTraveler()` 获取当前旅行家

**解决方案**：
```javascript
// ❌ 错误示例
const data = loadGlobalData();

// ✅ 正确示例
const travelerId = getCurrentTraveler().id;
const data = loadTravelerData(travelerId);
```

### 问题 2：游戏卡死或无法关闭

**症状**：游戏界面卡住，无法退出

**原因**：`isProcessing` 状态未正确重置

**解决方案**：
```javascript
// 确保在所有分支都重置状态
handleCardClick() {
  if (this.isProcessing) return;
  
  this.isProcessing = true;
  
  try {
    // 游戏逻辑
  } finally {
    this.isProcessing = false;  // 始终重置
  }
}
```

### 问题 3：语音不播放

**症状**：点击语音按钮无反应

**原因**：
1. 浏览器不支持 Web Speech API
2. 用户未与页面交互（浏览器策略）

**解决方案**：
```javascript
// 检查浏览器支持
if (!('speechSynthesis' in window)) {
  console.warn('浏览器不支持语音合成');
  return;
}

// 用户交互后才播放
document.addEventListener('click', () => {
  VoiceManager.speak('欢迎！');
}, { once: true });
```

### 问题 4：PWA 安装后图标不显示

**症状**：添加到主屏幕后图标缺失

**原因**：manifest.json 配置错误或图标文件缺失

**解决方案**：
```json
// manifest.json
{
  "icons": [
    {
      "src": "assets/icons/icon-192.png",  // 确保路径正确
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

### 问题 5：触摸事件冲突

**症状**：移动端点击无响应或双击

**原因**：click 事件延迟或事件冒泡

**解决方案**：
```javascript
// 使用 touchend 替代 click
element.addEventListener('touchend', (e) => {
  e.preventDefault();  // 阻止默认行为
  e.stopPropagation(); // 阻止冒泡
  // 处理逻辑
});

// 或使用 touch-action CSS
.button {
  touch-action: manipulation;
}
```

---

## 🎮 游戏模块开发指南

### 游戏模块接口规范

所有游戏模块应遵循统一接口：

```javascript
const GameModule = {
  // 必需：游戏配置
  config: {
    // 游戏特定配置
  },
  
  // 必需：DOM 元素缓存
  elements: {},
  
  // 必需：初始化方法
  init() {
    // 缓存 DOM 元素
    this.elements.modal = document.getElementById('game-modal');
    console.log('🎮 游戏模块初始化完成');
  },
  
  // 必需：启动游戏
  // @param {string} countryId - 国家ID
  // @param {function|null} callback - 完成回调，null表示独立模式
  start(countryId, callback) {
    const country = getCountryById(countryId);
    if (!country) return false;
    
    // 设置游戏状态
    this.isPlaying = true;
    this.callback = callback;
    this.isStandalone = (callback === null);
    
    // 显示游戏界面
    this.elements.modal.classList.add('active');
    
    // 播放语音
    VoiceManager.speak('游戏开始！');
    
    return true;
  },
  
  // 必需：关闭游戏
  close() {
    this.isPlaying = false;
    this.elements.modal.classList.remove('active');
    
    // 调用回调（如果有且未成功）
    if (this.callback && !this.isSuccess) {
      this.callback(false);
    }
  },
  
  // 可选：独立模式入口
  showDifficultySelect() {
    // 显示难度选择等
  }
};
```

### 游戏状态管理

```javascript
// 游戏进行中的状态
isPlaying: false,      // 游戏是否进行中
isProcessing: false,   // 是否正在处理（防止重复操作）
isSuccess: false,      // 是否成功完成
isStandalone: false,   // 是否独立模式（不关联护照印章）

// 开始游戏时重置状态
start() {
  this.isPlaying = true;
  this.isProcessing = false;
  this.isSuccess = false;
}

// 成功完成时设置
handleSuccess() {
  this.isSuccess = true;
  if (this.callback) this.callback(true);
}
```

### 音效和语音

```javascript
// 播放点击音效
audioManager.playSound('tap');

// 播放正确音效
audioManager.playSound('correct');

// 播放错误音效
audioManager.playSound('wrong');

// 播放语音
VoiceManager.speak('配对成功！');

// 使用模板语音
VoiceManager.templates.welcome();
VoiceManager.templates.countryIntro(country);
```

---

## 📦 数据模型

### 国家数据模型

```typescript
interface Country {
  id: string;                  // 唯一标识符
  name: {
    zh: string;                // 中文名
    en: string;                // 英文名
  };
  fullName: string;            // 国家全称
  continent: string;           // 所属大洲 ID
  flag: string;                // 国旗 emoji
  icon: string;                // 代表性 emoji
  capital: string;             // 首都
  area: string;                // 面积
  population: string;          // 人口
  currency: string;            // 货币
  language: string;            // 语言
  flagColors: string[];        // 国旗颜色数组
  audioZh?: string;            // 中文发音音频路径
  audioEn?: string;            // 英文发音音频路径
}
```

### 旅行家数据模型

```typescript
interface Traveler {
  id: string;                  // 唯一标识符（UUID）
  name: string;                // 名字
  avatar: string;              // 头像 emoji
  createdAt: string;           // 创建时间
}

interface TravelerSave {
  collectedCountries: string[];          // 已收集国家 ID
  countryStamps: {
    [countryId: string]: {
      type: 'entry' | 'exit' | 'special';
      date: string;
    }
  };
  unlockedBadges: string[];              // 已解锁勋章 ID
  gallery: {                             // 画廊作品
    countryId: string;
    imageData: string;
    createdAt: string;
  }[];
  settings: {
    soundEnabled: boolean;
    bgmEnabled: boolean;
  };
}
```

### 全局数据模型

```typescript
interface GlobalData {
  travelers: Traveler[];        // 旅行家列表
  currentTravelerId: string;    // 当前登录的旅行家 ID
  saves: {
    [travelerId: string]: TravelerSave;
  };
}
```

---

## 🧪 测试要点

### 功能测试清单

#### 旅行家管理
- [ ] 创建旅行家（名字长度、头像选择）
- [ ] 切换旅行家（数据隔离）
- [ ] 删除旅行家（确认提示）
- [ ] 最多创建 3 个旅行家

#### 游戏功能
- [ ] 颜色辨识游戏（正确/错误反馈）
- [ ] 国旗点击游戏（选项随机性）
- [ ] 拼图游戏（拖拽功能）
- [ ] 翻牌配对游戏（双人对战、独立模式）
- [ ] 涂色创作游戏（颜色选择、撤销、保存）
- [ ] 国旗连连看游戏（连线消除、难度分级、急速榜单）
- [ ] 垃圾分类游戏（拖拽分类、4 种类型、200+ 物品）
- [ ] 垃圾分类百科（分类信息展示、图片显示）

#### 印章系统
- [ ] 入境章获取
- [ ] 出境章获取
- [ ] 纪念章获取
- [ ] 勋章解锁

#### 数据持久化
- [ ] 刷新页面数据保持
- [ ] 切换旅行家数据正确
- [ ] 清除数据功能

#### 语音功能
- [ ] 语音播放
- [ ] 音效开关
- [ ] 浏览器兼容性

#### PWA 功能
- [ ] 离线可用
- [ ] 添加到主屏幕
- [ ] 图标显示

### 设备兼容性测试

- [ ] iPhone (Safari)
- [ ] iPad (Safari)
- [ ] Android 手机 (Chrome)
- [ ] Android 平板 (Chrome)
- [ ] 桌面浏览器 (Chrome, Firefox, Safari, Edge)

---

## 🔐 安全注意事项

### 数据安全
- ✅ 所有数据存储在本地，不上传服务器
- ✅ 不收集用户个人信息
- ✅ 不使用第三方追踪 SDK

### 内容安全
- ✅ 无广告内容
- ✅ 无外部链接
- ✅ 无用户生成内容（UGC）

### 代码安全
- ✅ 不使用 `eval()` 或 `Function()`
- ✅ 不动态加载外部脚本
- ✅ 输入验证（旅行家名字长度等）

---

## 📝 开发日志模板

当 AI 助手完成开发任务后，请在 `.memory/YYYY-MM-DD.md` 中记录：

```markdown
## YYYY-MM-DD 开发日志

### 完成的任务
- [任务描述]
- [任务描述]

### 修改的文件
- `js/xxx.js` - [修改说明]
- `css/xxx.css` - [修改说明]

### 技术决策
- [决策说明及原因]

### 遗留问题
- [问题描述]

### 下一步计划
- [计划描述]
```

---

## 🚨 重要提醒

### 给 AI 助手的特别提示

1. **始终考虑多用户场景**
   - 任何数据操作都要先获取当前旅行家 ID
   - 使用 `getCurrentTraveler()` 和 `loadTravelerData()`

2. **保持代码风格一致**
   - 遵循现有命名规范
   - 使用项目已有的工具函数
   - 不要引入新的依赖库

3. **重视用户体验**
   - 幼儿用户，界面要简洁直观
   - 所有交互都有反馈（音效、动画、语音）
   - 错误处理要友好

4. **性能优化**
   - 避免频繁 DOM 操作
   - 使用事件委托
   - 图片和音频懒加载

5. **测试充分**
   - 在多个设备测试
   - 考虑边界情况
   - 验证数据持久化

---

## 📲 原生 APP 部署指南

### Capacitor 项目结构

```
world-explorer/
├── capacitor.config.json   # Capacitor 配置
├── package.json            # npm 依赖配置
├── www/                    # Web 资源目录
│   ├── index.html
│   ├── css/
│   ├── js/
│   ├── assets/
│   └── data/
└── ios/                    # iOS 原生项目
    └── App/
        └── App.xcodeproj
```

### 部署步骤

```bash
# 1. 安装依赖
npm install

# 2. 同步 Web 资源到 iOS 项目
npx cap sync ios

# 3. 打开 Xcode
npx cap open ios

# 4. 在 Xcode 中配置签名
# - Signing & Capabilities → 选择开发团队

# 5. 连接 iPad 并安装
# - 选择目标设备
# - 点击运行按钮
```

### 更新 APP

```bash
# 1. 修改 Web 代码后同步
npx cap sync ios

# 2. 在 Xcode 中重新构建
# Product → Clean Build Folder
# Product → Run
```

---

## 🐙 GitHub 仓库管理

### 仓库地址

**https://github.com/LedesmaYoung/world-explorer-app**

### 提交规范

使用语义化提交信息：

```
feat: 新功能
fix: 修复 Bug
docs: 文档更新
style: 代码格式（不影响功能）
refactor: 重构
perf: 性能优化
test: 测试相关
chore: 构建/工具变动
```

**示例**：
```
feat: 添加国旗连连看游戏
fix: 修复连连看排行榜保存失败的问题
docs: 更新 README 印章体系说明
```

### 推送代码

```bash
cd world-explorer

# 查看状态
git status

# 添加修改
git add .

# 提交
git commit -m "feat: 描述修改内容"

# 推送
git push origin main
```

### 分支策略

- `main` - 主分支，稳定版本
- `feature/*` - 新功能开发分支
- `fix/*` - Bug 修复分支

### 版本发布

1. 更新 `manifest.json` 和 `README.md` 中的版本号
2. 更新 `sw.js` 中的缓存版本号
3. 提交并打 tag：
```bash
git tag -a v1.0.0 -m "版本 1.0.0"
git push origin v1.0.0
```

---

## 📚 参考资源

- [MDN Web Docs](https://developer.mozilla.org/)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [PWA 文档](https://web.dev/progressive-web-apps/)
- [儿童 UI 设计指南](https://www.nngroup.com/articles/childrens-websites-usability-issues/)

---

**AI 助手，请仔细阅读本文档后再开始开发工作！** 🤖✨
