// EPUB 解析工具

class EpubParser {
  static async updateGarbageData() {
    console.log('=== 更新垃圾分类数据 ===');
    
    try {
      // 从本地 JSON 文件加载数据
      const dataPath = 'data/garbage/garbage-data.json';
      console.log('开始加载数据文件:', dataPath);
      
      const startTime = performance.now();
      const response = await fetch(dataPath);
      
      if (!response.ok) {
        throw new Error(`无法加载数据文件，状态码: ${response.status}`);
      }
      
      const extractedData = await response.json();
      const endTime = performance.now();
      console.log(`数据加载完成，耗时: ${endTime - startTime}ms`);
      
      // 更新全局数据
      if (typeof GARBAGE_TYPE_INFO !== 'undefined') {
        Object.assign(GARBAGE_TYPE_INFO, extractedData.types);
        console.log('垃圾类型数据更新完成');
      }
      
      if (typeof GARBAGE_ITEMS !== 'undefined') {
        GARBAGE_ITEMS.length = 0;
        extractedData.items.forEach(item => GARBAGE_ITEMS.push(item));
        console.log(`垃圾物品数据更新完成，共 ${extractedData.items.length} 个物品`);
      }
      
      console.log('=== 数据更新完成 ===');
      return extractedData;
    } catch (error) {
      console.error('更新垃圾分类数据时出错:', error);
      // 出错时使用默认数据
      const defaultData = this.getDefaultData();
      
      if (typeof GARBAGE_TYPE_INFO !== 'undefined') {
        Object.assign(GARBAGE_TYPE_INFO, defaultData.types);
      }
      
      if (typeof GARBAGE_ITEMS !== 'undefined') {
        GARBAGE_ITEMS.length = 0;
        defaultData.items.forEach(item => GARBAGE_ITEMS.push(item));
      }
      
      console.log('=== 使用默认数据完成更新 ===');
      return defaultData;
    }
  }
  
  static getDefaultData() {
    // 默认垃圾分类数据，包含详细的描述和图片
    return {
      types: {
        hazardous: {
          name: '有害垃圾',
          color: '#F94343',
          desc: '有害垃圾是指含有对人体健康有害的重金属、有毒的物质或者对环境造成现实危害或者潜在危害的废弃物。常见的有害垃圾包括废电池、废荧光灯管、废灯泡、废水银温度计、废油漆桶、过期药品等。',
          examples: ['电池', '灯管', '药品', '油漆及其容器', '温度计', '杀虫剂', '化妆品'],
          icon: '⚠️',
          image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=hazardous%20waste%20symbol%20with%20batteries%20and%20chemicals&image_size=square'
        },
        kitchen: {
          name: '厨余垃圾',
          color: '#52C41A',
          desc: '厨余垃圾是指居民日常生活及食品加工、饮食服务、单位供餐等活动中产生的垃圾，包括丢弃不用的菜叶、剩菜、剩饭、果皮、蛋壳、茶渣、骨头等。',
          examples: ['剩菜剩饭', '果皮', '蛋壳', '骨头', '菜叶', '水果核', '茶叶渣'],
          icon: '🍎',
          image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=kitchen%20waste%20with%20vegetable%20peels%20and%20food%20scraps&image_size=square'
        },
        recyclable: {
          name: '可回收物',
          color: '#4B9CD3',
          desc: '可回收物是指适宜回收循环使用和资源利用的废物。主要包括纸类、塑料、玻璃、金属和织物等。',
          examples: ['纸类', '塑料', '玻璃', '金属', '织物', '电子产品', '废轮胎'],
          icon: '♻️',
          image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=recyclable%20materials%20including%20paper%20plastic%20and%20metal&image_size=square'
        },
        other: {
          name: '其他垃圾',
          color: '#9E9E9E',
          desc: '其他垃圾是指危害较小，但无再次利用价值的垃圾，如建筑垃圾类，生活垃圾类等。',
          examples: ['烟头', '一次性餐具', '污损纸张', '砖瓦陶瓷', '渣土', '卫生间废纸'],
          icon: '🗑️',
          image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=other%20waste%20including%20cigarette%20butts%20and%20tissues&image_size=square'
        }
      },
      items: [
        // 有害垃圾
        { id: 'battery', name: '电池', type: 'hazardous', icon: '🔋', desc: '电池中含有汞、镉等有害物质，随意丢弃会污染土壤和水源。', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=batteries%20hazardous%20waste&image_size=square' },
        { id: 'light-bulb', name: '灯泡', type: 'hazardous', icon: '💡', desc: '灯泡中含有汞等有害物质，破碎后会释放有毒气体。', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=light%20bulbs%20hazardous%20waste&image_size=square' },
        { id: 'medicine', name: '药品', type: 'hazardous', icon: '💊', desc: '过期药品含有有害成分，随意丢弃会污染环境。', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=expired%20medicine%20hazardous%20waste&image_size=square' },
        { id: 'paint', name: '油漆', type: 'hazardous', icon: '🎨', desc: '油漆中含有挥发性有机化合物，对人体和环境有害。', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=paint%20cans%20hazardous%20waste&image_size=square' },
        { id: 'thermometer', name: '体温计', type: 'hazardous', icon: '🌡️', desc: '体温计中含有水银，破碎后会释放有毒物质。', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=thermometer%20hazardous%20waste&image_size=square' },
        { id: 'insecticide', name: '杀虫剂', type: 'hazardous', icon: '🐛', desc: '杀虫剂含有有毒化学成分，对人体和环境有害。', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=insecticide%20hazardous%20waste&image_size=square' },
        { id: 'cosmetic', name: '化妆品', type: 'hazardous', icon: '💄', desc: '过期化妆品含有有害成分，随意丢弃会污染环境。', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=expired%20cosmetics%20hazardous%20waste&image_size=square' },
        
        // 厨余垃圾
        { id: 'apple-core', name: '苹果核', type: 'kitchen', icon: '🍎', desc: '苹果核是有机废弃物，可以通过堆肥转化为肥料。', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=apple%20core%20kitchen%20waste&image_size=square' },
        { id: 'leftovers', name: '剩菜', type: 'kitchen', icon: '🍱', desc: '剩菜属于有机垃圾，可通过堆肥处理。', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=leftover%20food%20kitchen%20waste&image_size=square' },
        { id: 'egg-shell', name: '蛋壳', type: 'kitchen', icon: '🥚', desc: '蛋壳富含钙质，是良好的有机肥料原料。', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=egg%20shells%20kitchen%20waste&image_size=square' },
        { id: 'bone', name: '骨头', type: 'kitchen', icon: '🍖', desc: '骨头是有机废弃物，可通过堆肥处理。', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=animal%20bones%20kitchen%20waste&image_size=square' },
        { id: 'vegetable', name: '蔬菜', type: 'kitchen', icon: '🥬', desc: '蔬菜残渣是有机垃圾，可通过堆肥转化为肥料。', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=vegetable%20scraps%20kitchen%20waste&image_size=square' },
        { id: 'fruit-pit', name: '水果核', type: 'kitchen', icon: '🥑', desc: '水果核是有机废弃物，可通过堆肥处理。', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=fruit%20pits%20kitchen%20waste&image_size=square' },
        { id: 'tea-grounds', name: '茶叶渣', type: 'kitchen', icon: '🍵', desc: '茶叶渣是有机垃圾，可通过堆肥转化为肥料。', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=tea%20grounds%20kitchen%20waste&image_size=square' },
        
        // 可回收物
        { id: 'paper', name: '废纸', type: 'recyclable', icon: '📄', desc: '废纸可以回收再利用，减少树木砍伐。', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=waste%20paper%20recyclable&image_size=square' },
        { id: 'plastic-bottle', name: '塑料瓶', type: 'recyclable', icon: '🥤', desc: '塑料瓶可以回收再利用，减少塑料污染。', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=plastic%20bottles%20recyclable&image_size=square' },
        { id: 'glass', name: '玻璃瓶', type: 'recyclable', icon: '🍾', desc: '玻璃瓶可以多次回收利用，节约资源。', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=glass%20bottles%20recyclable&image_size=square' },
        { id: 'can', name: '易拉罐', type: 'recyclable', icon: '🥫', desc: '易拉罐可以回收再利用，节约金属资源。', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=aluminum%20cans%20recyclable&image_size=square' },
        { id: 'cardboard', name: '纸箱', type: 'recyclable', icon: '📦', desc: '纸箱可以回收再利用，减少树木砍伐。', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cardboard%20boxes%20recyclable&image_size=square' },
        { id: 'textile', name: '旧衣服', type: 'recyclable', icon: '👕', desc: '旧衣服可以回收再利用，制作成新的纺织品。', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=old%20clothes%20recyclable&image_size=square' },
        { id: 'electronics', name: '电子产品', type: 'recyclable', icon: '📱', desc: '电子产品含有 valuable metals，可以回收再利用。', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=electronic%20waste%20recyclable&image_size=square' },
        { id: 'tire', name: '废轮胎', type: 'recyclable', icon: '🚗', desc: '废轮胎可以回收再利用，制作成橡胶制品。', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=used%20tires%20recyclable&image_size=square' },
        
        // 其他垃圾
        { id: 'cigarette', name: '烟头', type: 'other', icon: '🚬', desc: '烟头含有有害物质，无法回收利用。', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cigarette%20butts%20other%20waste&image_size=square' },
        { id: 'tissue', name: '纸巾', type: 'other', icon: '🧻', desc: '纸巾已被污染，无法回收利用。', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=used%20tissues%20other%20waste&image_size=square' },
        { id: 'diaper', name: '尿布', type: 'other', icon: '👶', desc: '尿布已被污染，无法回收利用。', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=diapers%20other%20waste&image_size=square' },
        { id: 'ceramic', name: '陶瓷', type: 'other', icon: '🍶', desc: '陶瓷无法回收利用，属于其他垃圾。', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=ceramic%20waste%20other&image_size=square' },
        { id: 'plastic-bag', name: '塑料袋', type: 'other', icon: '🛍️', desc: '塑料袋难以降解，属于其他垃圾。', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=plastic%20bags%20other%20waste&image_size=square' },
        { id: 'construction', name: '建筑垃圾', type: 'other', icon: '🏗️', desc: '建筑垃圾无法回收利用，需要特殊处理。', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=construction%20waste%20other&image_size=square' },
        { id: 'toilet-paper', name: '卫生间废纸', type: 'other', icon: '🚽', desc: '卫生间废纸已被污染，无法回收利用。', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=toilet%20paper%20other%20waste&image_size=square' }
      ]
    };
  }
}