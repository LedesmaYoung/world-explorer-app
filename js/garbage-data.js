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