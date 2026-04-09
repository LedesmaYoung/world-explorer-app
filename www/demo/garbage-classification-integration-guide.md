# 垃圾分类功能集成指南

## 项目概述

本指南将帮助您将垃圾分类知识探索功能集成到世界探险家（world-explorer）项目中。该功能包括：

- 📚 垃圾分类百科：展示四大垃圾类型的详细信息
- 🎮 垃圾分类游戏：互动式拖拽游戏，测试垃圾分类知识

## 集成步骤

### 步骤 1：创建垃圾分类相关文件

在 `world-explorer/js/` 目录下创建以下文件：

#### 1.1 garbage-data.js

```javascript
// 垃圾分类数据

// 垃圾类型定义
const GARBAGE_TYPES = {
  RECYCLABLE: 'recyclable',      // 可回收物
  HAZARDOUS: 'hazardous',        // 有害垃圾
  KITCHEN: 'kitchen',            // 厨余垃圾
  OTHER: 'other'                 // 其他垃圾
};

// 垃圾类型信息
const GARBAGE_TYPE_INFO = {
  [GARBAGE_TYPES.RECYCLABLE]: {
    name: '可回收物',
    color: '#4B9CD3',
    desc: '可回收物是指适宜回收循环使用和资源利用的废物',
    examples: ['纸类', '塑料', '玻璃', '金属', '织物'],
    icon: '♻️'
  },
  [GARBAGE_TYPES.HAZARDOUS]: {
    name: '有害垃圾',
    color: '#F94343',
    desc: '有害垃圾是指含有对人体健康有害的重金属、有毒的物质或者对环境造成现实危害或者潜在危害的废弃物',
    examples: ['电池', '灯管', '药品', '油漆及其容器'],
    icon: '⚠️'
  },
  [GARBAGE_TYPES.KITCHEN]: {
    name: '厨余垃圾',
    color: '#52C41A',
    desc: '厨余垃圾是指居民日常生活及食品加工、饮食服务、单位供餐等活动中产生的垃圾',
    examples: ['剩菜剩饭', '果皮', '蛋壳', '骨头', '菜叶'],
    icon: '🍎'
  },
  [GARBAGE_TYPES.OTHER]: {
    name: '其他垃圾',
    color: '#9E9E9E',
    desc: '其他垃圾是指危害较小，但无再次利用价值的垃圾',
    examples: ['烟头', '一次性餐具', '污损纸张', '砖瓦陶瓷'],
    icon: '🗑️'
  }
};

// 游戏物品数据
const GARBAGE_ITEMS = [
  // 可回收物
  { id: 'paper', name: '废纸', type: GARBAGE_TYPES.RECYCLABLE, icon: '📄' },
  { id: 'plastic-bottle', name: '塑料瓶', type: GARBAGE_TYPES.RECYCLABLE, icon: '🥤' },
  { id: 'glass', name: '玻璃瓶', type: GARBAGE_TYPES.RECYCLABLE, icon: '🍾' },
  { id: 'can', name: '易拉罐', type: GARBAGE_TYPES.RECYCLABLE, icon: '🥫' },
  { id: 'cardboard', name: '纸箱', type: GARBAGE_TYPES.RECYCLABLE, icon: '📦' },
  { id: 'textile', name: '旧衣服', type: GARBAGE_TYPES.RECYCLABLE, icon: '👕' },
  
  // 有害垃圾
  { id: 'battery', name: '电池', type: GARBAGE_TYPES.HAZARDOUS, icon: '🔋' },
  { id: 'light-bulb', name: '灯泡', type: GARBAGE_TYPES.HAZARDOUS, icon: '💡' },
  { id: 'medicine', name: '药品', type: GARBAGE_TYPES.HAZARDOUS, icon: '💊' },
  { id: 'paint', name: '油漆', type: GARBAGE_TYPES.HAZARDOUS, icon: '🎨' },
  { id: 'thermometer', name: '体温计', type: GARBAGE_TYPES.HAZARDOUS, icon: '🌡️' },
  
  // 厨余垃圾
  { id: 'apple-core', name: '苹果核', type: GARBAGE_TYPES.KITCHEN, icon: '🍎' },
  { id: 'leftovers', name: '剩菜', type: GARBAGE_TYPES.KITCHEN, icon: '🍱' },
  { id: 'egg-shell', name: '蛋壳', type: GARBAGE_TYPES.KITCHEN, icon: '🥚' },
  { id: 'bone', name: '骨头', type: GARBAGE_TYPES.KITCHEN, icon: '🍖' },
  { id: 'vegetable', name: '蔬菜', type: GARBAGE_TYPES.KITCHEN, icon: '🥬' },
  
  // 其他垃圾
  { id: 'cigarette', name: '烟头', type: GARBAGE_TYPES.OTHER, icon: '🚬' },
  { id: 'tissue', name: '纸巾', type: GARBAGE_TYPES.OTHER, icon: '🧻' },
  { id: 'diaper', name: '尿布', type: GARBAGE_TYPES.OTHER, icon: '👶' },
  { id: 'ceramic', name: '陶瓷', type: GARBAGE_TYPES.OTHER, icon: '🍶' },
  { id: 'plastic-bag', name: '塑料袋', type: GARBAGE_TYPES.OTHER, icon: '🛍️' }
];

// 游戏难度配置
const GARBAGE_GAME_LEVELS = {
  easy: {
    name: '简单',
    itemCount: 6,
    timeLimit: 60,
    scorePerItem: 10
  },
  medium: {
    name: '中等',
    itemCount: 10,
    timeLimit: 90,
    scorePerItem: 15
  },
  hard: {
    name: '困难',
    itemCount: 14,
    timeLimit: 120,
    scorePerItem: 20
  }
};
```

#### 1.2 garbage-encyclopedia.js

```javascript
// 垃圾分类百科功能

class GarbageEncyclopedia {
  static init() {
    console.log('=== 初始化垃圾分类百科 ===');
  }

  static showEncyclopedia() {
    // 创建百科弹窗
    const modal = document.createElement('div');
    modal.className = 'garbage-encyclopedia-modal active';
    modal.id = 'garbage-encyclopedia-modal';
    modal.onclick = (e) => {
      if (e.target === modal) {
        this.closeEncyclopedia();
      }
    };

    // 渲染垃圾类型列表
    const garbageTypesHtml = Object.entries(GARBAGE_TYPE_INFO).map(([type, info]) => `
      <div class="garbage-type-card" data-type="${type}" onclick="GarbageEncyclopedia.showGarbageTypeDetail('${type}')">
        <div class="garbage-type-icon" style="background-color: ${info.color}">
          ${info.icon}
        </div>
        <div class="garbage-type-name">${info.name}</div>
        <div class="garbage-type-desc">${info.desc}</div>
      </div>
    `).join('');

    modal.innerHTML = `
      <div class="garbage-encyclopedia-content">
        <div class="garbage-encyclopedia-header">
          <h2>垃圾分类百科</h2>
          <button class="close-btn" onclick="GarbageEncyclopedia.closeEncyclopedia()">✕</button>
        </div>
        <div class="garbage-types-grid">
          ${garbageTypesHtml}
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    
    // 播放点击音效
    if (typeof audioManager !== 'undefined') {
      audioManager.playSound('tap');
    }
  }

  static showGarbageTypeDetail(type) {
    const info = GARBAGE_TYPE_INFO[type];
    if (!info) return;

    // 过滤该类型的垃圾物品
    const items = GARBAGE_ITEMS.filter(item => item.type === type);

    // 创建详情弹窗
    const modal = document.createElement('div');
    modal.className = 'garbage-detail-modal active';
    modal.id = 'garbage-detail-modal';
    modal.onclick = (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    };

    // 渲染物品列表
    const itemsHtml = items.map(item => `
      <div class="garbage-item">
        <span class="garbage-item-icon">${item.icon}</span>
        <span class="garbage-item-name">${item.name}</span>
      </div>
    `).join('');

    modal.innerHTML = `
      <div class="garbage-detail-content">
        <div class="garbage-detail-header" style="border-bottom-color: ${info.color}">
          <div class="garbage-detail-icon" style="background-color: ${info.color}">
            ${info.icon}
          </div>
          <h3>${info.name}</h3>
          <button class="close-btn" onclick="document.getElementById('garbage-detail-modal').remove()">✕</button>
        </div>
        <div class="garbage-detail-body">
          <div class="garbage-detail-desc">${info.desc}</div>
          <div class="garbage-detail-examples">
            <h4>常见物品：</h4>
            <div class="garbage-items-list">
              ${itemsHtml}
            </div>
          </div>
        </div>
        <button class="garbage-detail-close" onclick="document.getElementById('garbage-detail-modal').remove()">我知道了 👍</button>
      </div>
    `;

    document.body.appendChild(modal);
    
    // 播放点击音效
    if (typeof audioManager !== 'undefined') {
      audioManager.playSound('tap');
    }
  }

  static closeEncyclopedia() {
    const modal = document.getElementById('garbage-encyclopedia-modal');
    if (modal) {
      modal.remove();
    }
    
    // 播放点击音效
    if (typeof audioManager !== 'undefined') {
      audioManager.playSound('tap');
    }
  }
}
```

#### 1.3 game-garbage.js

```javascript
// 垃圾分类游戏功能

class GarbageGame {
  static init() {
    console.log('=== 初始化垃圾分类游戏 ===');
  }

  static showDifficultySelect() {
    // 创建难度选择弹窗
    const modal = document.createElement('div');
    modal.className = 'garbage-game-modal active';
    modal.id = 'garbage-game-modal';
    modal.onclick = (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    };

    modal.innerHTML = `
      <div class="garbage-game-content">
        <div class="garbage-game-header">
          <h2>垃圾分类挑战</h2>
          <button class="close-btn" onclick="document.getElementById('garbage-game-modal').remove()">✕</button>
        </div>
        <div class="difficulty-select">
          ${Object.entries(GARBAGE_GAME_LEVELS).map(([level, config]) => `
            <div class="difficulty-option" onclick="GarbageGame.start('${level}')">
              <div class="difficulty-name">${config.name}</div>
              <div class="difficulty-info">
                <span>物品数量: ${config.itemCount}</span>
                <span>时间限制: ${config.timeLimit}秒</span>
                <span>每题得分: ${config.scorePerItem}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    
    // 播放点击音效
    if (typeof audioManager !== 'undefined') {
      audioManager.playSound('tap');
    }
  }

  static start(level) {
    const config = GARBAGE_GAME_LEVELS[level];
    if (!config) return;

    // 关闭难度选择弹窗
    const modal = document.getElementById('garbage-game-modal');
    if (modal) {
      modal.remove();
    }

    // 创建游戏弹窗
    const gameModal = document.createElement('div');
    gameModal.className = 'garbage-game-modal active';
    gameModal.id = 'garbage-game-play-modal';

    // 生成游戏物品
    const items = this.generateGameItems(config.itemCount);
    
    // 渲染游戏界面
    gameModal.innerHTML = `
      <div class="garbage-game-content">
        <div class="garbage-game-header">
          <h2>垃圾分类挑战 - ${config.name}</h2>
          <div class="game-stats">
            <span class="score">得分: <span id="garbage-score">0</span></span>
            <span class="time">时间: <span id="garbage-time">${config.timeLimit}</span>秒</span>
          </div>
        </div>
        <div class="garbage-game-play-area">
          <div class="garbage-items-container" id="garbage-items-container">
            ${items.map(item => `
              <div class="garbage-item" draggable="true" data-type="${item.type}" data-id="${item.id}">
                <span class="garbage-item-icon">${item.icon}</span>
                <span class="garbage-item-name">${item.name}</span>
              </div>
            `).join('')}
          </div>
          <div class="garbage-bins">
            ${Object.entries(GARBAGE_TYPE_INFO).map(([type, info]) => `
              <div class="garbage-bin" data-type="${type}" style="border-color: ${info.color}">
                <div class="garbage-bin-icon" style="background-color: ${info.color}">
                  ${info.icon}
                </div>
                <div class="garbage-bin-name">${info.name}</div>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="game-message" id="game-message"></div>
      </div>
    `;

    document.body.appendChild(gameModal);
    
    // 绑定拖拽事件
    this.bindDragEvents();
    
    // 开始游戏
    this.startGame(config, items);
  }

  static generateGameItems(count) {
    // 随机选择指定数量的垃圾物品
    const shuffled = [...GARBAGE_ITEMS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  static bindDragEvents() {
    const items = document.querySelectorAll('.garbage-item');
    const bins = document.querySelectorAll('.garbage-bin');

    items.forEach(item => {
      item.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', item.dataset.type);
        item.classList.add('dragging');
      });

      item.addEventListener('dragend', () => {
        item.classList.remove('dragging');
      });
    });

    bins.forEach(bin => {
      bin.addEventListener('dragover', (e) => {
        e.preventDefault();
        bin.classList.add('hover');
      });

      bin.addEventListener('dragleave', () => {
        bin.classList.remove('hover');
      });

      bin.addEventListener('drop', (e) => {
        e.preventDefault();
        bin.classList.remove('hover');
        
        const itemType = e.dataTransfer.getData('text/plain');
        const binType = bin.dataset.type;
        
        this.checkAnswer(itemType, binType);
      });
    });
  }

  static startGame(config, items) {
    let score = 0;
    let timeLeft = config.timeLimit;
    let itemsLeft = items.length;
    
    const scoreElement = document.getElementById('garbage-score');
    const timeElement = document.getElementById('garbage-time');
    const messageElement = document.getElementById('game-message');

    // 倒计时
    const timer = setInterval(() => {
      timeLeft--;
      timeElement.textContent = timeLeft;
      
      if (timeLeft <= 0) {
        clearInterval(timer);
        this.endGame(score, false);
      }
    }, 1000);

    // 保存游戏状态
    this.gameState = {
      config,
      score,
      timeLeft,
      itemsLeft,
      timer,
      scoreElement,
      timeElement,
      messageElement
    };
  }

  static checkAnswer(itemType, binType) {
    const isCorrect = itemType === binType;
    const messageElement = this.gameState.messageElement;
    
    if (isCorrect) {
      // 正确
      this.gameState.score += this.gameState.config.scorePerItem;
      this.gameState.scoreElement.textContent = this.gameState.score;
      this.gameState.itemsLeft--;
      
      messageElement.textContent = '✅ 分类正确！';
      messageElement.className = 'game-message correct';
      
      // 播放正确音效
      if (typeof audioManager !== 'undefined') {
        audioManager.playSound('badge');
      }
      
      // 检查是否完成游戏
      if (this.gameState.itemsLeft === 0) {
        clearInterval(this.gameState.timer);
        this.endGame(this.gameState.score, true);
      }
    } else {
      // 错误
      messageElement.textContent = '❌ 分类错误，再试一次！';
      messageElement.className = 'game-message error';
      
      // 播放错误音效
      if (typeof audioManager !== 'undefined') {
        audioManager.playSound('error');
      }
    }
    
    // 3秒后清除消息
    setTimeout(() => {
      messageElement.textContent = '';
      messageElement.className = 'game-message';
    }, 3000);
  }

  static endGame(score, isComplete) {
    // 关闭游戏弹窗
    const modal = document.getElementById('garbage-game-play-modal');
    if (modal) {
      modal.remove();
    }
    
    // 创建结果弹窗
    const resultModal = document.createElement('div');
    resultModal.className = 'garbage-game-modal active';
    resultModal.id = 'garbage-game-result-modal';
    resultModal.onclick = (e) => {
      if (e.target === resultModal) {
        resultModal.remove();
      }
    };

    const message = isComplete ? '🎉 挑战完成！' : '⏰ 时间到！';

    resultModal.innerHTML = `
      <div class="garbage-game-content">
        <div class="garbage-game-header">
          <h2>游戏结果</h2>
          <button class="close-btn" onclick="document.getElementById('garbage-game-result-modal').remove()">✕</button>
        </div>
        <div class="game-result">
          <div class="result-message">${message}</div>
          <div class="result-score">得分：<span>${score}</span></div>
          <div class="result-buttons">
            <button class="play-again-btn" onclick="GarbageGame.showDifficultySelect(); document.getElementById('garbage-game-result-modal').remove()">再玩一次</button>
            <button class="back-btn" onclick="document.getElementById('garbage-game-result-modal').remove()">返回</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(resultModal);
    
    // 播放结束音效
    if (typeof audioManager !== 'undefined') {
      audioManager.playSound('badge');
    }
  }
}
```

### 步骤 2：修改 index.html

在 `index.html` 文件中添加垃圾分类功能的脚本引用：

```html
<!-- 游戏模块脚本 -->
<script src="js/game.js?v=2026032424"></script>
<script src="js/game-tap.js"></script>
<script src="js/game-puzzle.js"></script>
<script src="js/game-match.js"></script>
<script src="js/game-coloring.js"></script>
<script src="js/game-link.js"></script>

<!-- 垃圾分类功能 -->
<script src="js/garbage-data.js"></script>
<script src="js/garbage-encyclopedia.js"></script>
<script src="js/game-garbage.js"></script>
```

### 步骤 3：修改 app.js

在 `app.js` 文件中初始化垃圾分类模块：

```javascript
// 初始化连连看游戏
LinkGame.init();

// 初始化垃圾分类百科
if (typeof GarbageEncyclopedia !== 'undefined') {
  GarbageEncyclopedia.init();
}

// 初始化垃圾分类游戏
if (typeof GarbageGame !== 'undefined') {
  GarbageGame.init();
}

// 检查是否有当前旅行家
```

### 步骤 4：更新游戏中心

在 `app.js` 文件中更新游戏中心，添加垃圾分类游戏：

```javascript
// 游戏列表配置
const GAME_CENTER_GAMES = [
  { id: 'tap', name: '天梯挑战', icon: '🎯', desc: '国旗识别', action: () => TapGame.startChallenge() },
  { id: 'puzzle', name: '拼图挑战', icon: '🧩', desc: '国旗拼图', action: () => PuzzleGame.startChallenge() },
  { id: 'match', name: '翻牌配对', icon: '🃏', desc: '记忆配对', action: () => MatchGame.showDifficultySelect() },
  { id: 'link', name: '连连看', icon: '🔗', desc: '连接消除', action: () => LinkGame.showDifficultySelect() },
  { id: 'garbage', name: '垃圾分类', icon: '🗑️', desc: '垃圾识别', action: () => GarbageGame.showDifficultySelect() }
];
```

### 步骤 5：添加 CSS 样式

在 `css/games.css` 文件中添加垃圾分类功能的样式：

```css
/* 垃圾分类功能样式 */

/* 百科弹窗 */
.garbage-encyclopedia-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.garbage-encyclopedia-modal.active {
  display: flex;
}

.garbage-encyclopedia-content {
  background: white;
  border-radius: 10px;
  padding: 20px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
}

.garbage-encyclopedia-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.garbage-types-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.garbage-type-card {
  background: #f9f9f9;
  border-radius: 10px;
  padding: 15px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #eee;
}

.garbage-type-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.garbage-type-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin: 0 auto 10px;
}

.garbage-type-name {
  font-weight: bold;
  margin-bottom: 5px;
}

.garbage-type-desc {
  font-size: 14px;
  color: #666;
}

/* 垃圾类型详情弹窗 */
.garbage-detail-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.garbage-detail-modal.active {
  display: flex;
}

.garbage-detail-content {
  background: white;
  border-radius: 10px;
  padding: 20px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
}

.garbage-detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #ccc;
}

.garbage-detail-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin-right: 10px;
}

.garbage-detail-body {
  margin-bottom: 20px;
}

.garbage-detail-desc {
  margin-bottom: 15px;
  line-height: 1.5;
}

.garbage-items-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 10px;
  margin-top: 10px;
}

.garbage-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  background: #f9f9f9;
  border-radius: 8px;
}

.garbage-item-icon {
  font-size: 24px;
  margin-bottom: 5px;
}

.garbage-item-name {
  font-size: 14px;
  text-align: center;
}

.garbage-detail-close {
  width: 100%;
  padding: 10px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.garbage-detail-close:hover {
  background: #45a049;
}

/* 游戏弹窗 */
.garbage-game-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.garbage-game-modal.active {
  display: flex;
}

.garbage-game-content {
  background: white;
  border-radius: 10px;
  padding: 20px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
}

.garbage-game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.game-stats {
  display: flex;
  gap: 20px;
  font-size: 16px;
  font-weight: bold;
}

.difficulty-select {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.difficulty-option {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #eee;
}

.difficulty-option:hover {
  transform: translateX(5px);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

.difficulty-name {
  font-weight: bold;
  margin-bottom: 5px;
}

.difficulty-info {
  font-size: 14px;
  color: #666;
}

.garbage-game-play-area {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.garbage-items-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 10px;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 10px;
}

.garbage-item {
  cursor: grab;
  transition: all 0.2s ease;
}

.garbage-item:hover {
  transform: scale(1.05);
}

.garbage-item.dragging {
  opacity: 0.5;
  transform: scale(1.1);
}

.garbage-bins {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.garbage-bin {
  border: 2px dashed #ccc;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.garbage-bin.hover {
  border-style: solid;
  transform: scale(1.05);
}

.garbage-bin-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin-bottom: 10px;
}

.game-message {
  text-align: center;
  padding: 10px;
  border-radius: 5px;
  margin-top: 20px;
  font-weight: bold;
}

.game-message.correct {
  background-color: #d4edda;
  color: #155724;
}

.game-message.error {
  background-color: #f8d7da;
  color: #721c24;
}

.game-result {
  text-align: center;
  margin-top: 20px;
}

.result-message {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #4CAF50;
}

.result-score {
  font-size: 20px;
  margin-bottom: 30px;
}

.result-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.play-again-btn, .back-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.play-again-btn {
  background: #4CAF50;
  color: white;
}

.play-again-btn:hover {
  background: #45a049;
}

.back-btn {
  background: #f1f1f1;
  color: #333;
}

.back-btn:hover {
  background: #e0e0e0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  transition: color 0.3s ease;
}

.close-btn:hover {
  color: #333;
}
```

## 如何使用

1. **启动项目**：
   ```bash
   cd world-explorer
   ./start.sh
   ```

2. **访问应用**：
   - 本地：`http://localhost:50895`
   - 局域网：`http://[你的IP]:50895`

3. **使用垃圾分类功能**：
   - 在游戏中心中找到「垃圾分类」游戏
   - 点击「📚 垃圾分类百科」查看垃圾分类知识
   - 点击「🎮 垃圾分类游戏」开始互动游戏

## 功能特点

- 📚 **垃圾分类百科**：详细介绍四大垃圾类型
- 🎮 **互动游戏**：拖拽式垃圾分类游戏
- 🏆 **多难度级别**：简单、中等、困难
- 🔊 **音效反馈**：正确/错误音效提示
- 📱 **响应式设计**：适配不同设备

## 技术实现

- **前端**：原生 JavaScript + CSS
- **数据存储**：内存数据结构
- **交互**：HTML5 拖拽 API
- **集成**：无缝集成到现有项目

## 后续扩展

- 添加垃圾分类成就系统
- 增加更多垃圾物品和类型
- 添加语音识别垃圾分类功能
- 实现垃圾分类知识测验

---

通过以上步骤，您可以成功将垃圾分类知识探索功能集成到世界探险家项目中，为儿童提供一个有趣的垃圾分类学习工具。