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
        ${item.image ? `<img class="garbage-item-image" data-src="${item.image}" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%23f0f0f0'/%3E%3Ctext x='20' y='25' text-anchor='middle' font-size='12' fill='%23999'%3E加载中...%3C/text%3E%3C/svg%3E" alt="${item.name}" onload="this.src=this.dataset.src" />` : `<span class="garbage-item-icon">${item.icon}</span>`}
        <span class="garbage-item-name">${item.name}</span>
        ${item.desc ? `<span class="garbage-item-desc">${item.desc}</span>` : ''}
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