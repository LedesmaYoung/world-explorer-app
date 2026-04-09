#!/usr/bin/env node

// EPUB 解析脚本（简化版）
// 使用正则表达式直接提取图片和文字信息

const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');

// 确保输出目录存在
const outputDir = path.join(__dirname, 'data', 'garbage');
const imagesDir = path.join(outputDir, 'images');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// EPUB 文件路径
const epubPath = path.join(__dirname, 'data', '垃圾分类立体拼插游戏书.epub');

async function parseEpub() {
  try {
    console.log('=== 开始解析 EPUB 文件 ===');
    console.log('文件路径:', epubPath);
    
    // 读取 EPUB 文件
    const epubBuffer = fs.readFileSync(epubPath);
    
    // 使用 JSZip 解压 EPUB 文件
    const zip = new JSZip();
    await zip.loadAsync(epubBuffer);
    
    console.log('=== EPUB 文件解压完成 ===');
    
    // 提取所有图片
    console.log('开始提取图片...');
    const imageMap = {};
    const imageFiles = Object.keys(zip.files).filter(name => 
      name.includes('Images/') && name.endsWith('.jpg')
    );
    
    for (const imagePath of imageFiles) {
      const imageData = await zip.file(imagePath).async('nodebuffer');
      const imageFileName = path.basename(imagePath);
      const localImagePath = path.join(imagesDir, imageFileName);
      fs.writeFileSync(localImagePath, imageData);
      const relativePath = imagePath.replace('OEBPS/', '');
      imageMap[relativePath] = `data/garbage/images/${imageFileName}`;
    }
    
    console.log(`提取了 ${imageFiles.length} 张图片`);
    
    // 提取所有 HTML 文件内容
    console.log('开始提取 HTML 内容...');
    const htmlFiles = Object.keys(zip.files).filter(name => 
      name.includes('Text/') && name.endsWith('.xhtml')
    );
    
    const allItems = [];
    
    for (const htmlFile of htmlFiles) {
      const content = await zip.file(htmlFile).async('string');
      
      // 根据章节文件名确定垃圾类型
      let garbageType = 'other';
      if (htmlFile.includes('chapter3.xhtml')) {
        garbageType = 'recyclable';
      } else if (htmlFile.includes('chapter4.xhtml')) {
        garbageType = 'hazardous';
      } else if (htmlFile.includes('chapter5.xhtml')) {
        garbageType = 'kitchen';
      } else if (htmlFile.includes('chapter6.xhtml')) {
        garbageType = 'other';
      }
      
      const items = extractItemsFromHtml(content, imageMap, garbageType);
      allItems.push(...items);
      console.log(`提取文件: ${htmlFile}, 找到 ${items.length} 个物品, 类型: ${garbageType}`);
    }
    
    // 构建垃圾数据结构
    const garbageData = buildGarbageData(allItems, imageMap);
    
    // 保存数据为 JSON 文件
    const dataPath = path.join(outputDir, 'garbage-data.json');
    fs.writeFileSync(dataPath, JSON.stringify(garbageData, null, 2));
    console.log('=== 数据保存完成 ===');
    console.log('数据文件路径:', dataPath);
    
    console.log('=== 解析完成 ===');
    console.log(`提取了 ${garbageData.items.length} 个垃圾物品`);
    console.log(`保存了 ${imageFiles.length} 张图片`);
  } catch (error) {
    console.error('解析 EPUB 文件时出错:', error);
    process.exit(1);
  }
}

function extractItemsFromHtml(html, imageMap, garbageType = 'other') {
  const items = [];
  
  // 使用正则表达式提取图片和文字
  const imgRegex = /<img[^>]+src="([^"]+)"[^>]*>/g;
  const boldRegex = /<b>([^<]+)<\/b>/g;
  const leftParaRegex = /<p class="left">([^<]+)<\/p>/g;
  
  // 提取所有图片
  const imgMatches = html.match(imgRegex) || [];
  
  for (let i = 0; i < imgMatches.length; i++) {
    const imgTag = imgMatches[i];
    const srcMatch = imgTag.match(/src="([^"]+)"/);
    if (!srcMatch) continue;
    
    const imgSrc = srcMatch[1];
    
    // 获取图片后面的内容
    const afterImg = html.substring(html.indexOf(imgTag) + imgTag.length);
    
    // 提取物品名称（加粗文字）
    const boldMatch = afterImg.match(boldRegex);
    if (!boldMatch || !boldMatch[1]) continue;
    
    let itemName = boldMatch[1].trim();
    
    // 清理 HTML 标签
    itemName = itemName.replace(/<[^>]+>/g, '').trim();
    
    // 过滤掉一些非物品名称的文字
    if (itemName.length === 0 || itemName.length > 20 ||
        itemName.includes('Recyclable') || itemName.includes('Hazardous') ||
        itemName.includes('Kitchen') || itemName.includes('Other') ||
        itemName.includes('投放') || itemName.includes('小贴士')) {
      continue;
    }
    
    // 提取描述文字（左对齐段落）
    const leftParaMatch = afterImg.match(leftParaRegex);
    let itemDesc = leftParaMatch ? leftParaMatch[1].trim() : '';
    
    // 清理 HTML 标签
    itemDesc = itemDesc.replace(/<[^>]+>/g, '').trim();
    
    // 处理图片路径
    let imagePath = '';
    if (imgSrc.startsWith('../Images/')) {
      const relativePath = imgSrc.replace('../', '');
      imagePath = imageMap[relativePath] || '';
    } else if (imgSrc.startsWith('Images/')) {
      imagePath = imageMap[imgSrc] || '';
    }
    
    items.push({
      name: itemName,
      desc: itemDesc,
      image: imagePath,
      type: garbageType  // 添加类型信息
    });
  }
  
  return items;
}

function buildGarbageData(garbageItems, imageMap) {
  // 初始化数据结构
  const garbageData = {
    types: {
      hazardous: {
        name: '有害垃圾',
        color: '#F94343',
        desc: '有害垃圾是指含有对人体健康有害的重金属、有毒的物质或者对环境造成现实危害或者潜在危害的废弃物。',
        examples: [],
        icon: '⚠️',
        image: ''
      },
      kitchen: {
        name: '厨余垃圾',
        color: '#52C41A',
        desc: '厨余垃圾是指居民日常生活及食品加工、饮食服务、单位供餐等活动中产生的垃圾。',
        examples: [],
        icon: '🍎',
        image: ''
      },
      recyclable: {
        name: '可回收物',
        color: '#4B9CD3',
        desc: '可回收物是指适宜回收循环使用和资源利用的废物。',
        examples: [],
        icon: '♻️',
        image: ''
      },
      other: {
        name: '其他垃圾',
        color: '#9E9E9E',
        desc: '其他垃圾是指危害较小，但无再次利用价值的垃圾。',
        examples: [],
        icon: '🗑️',
        image: ''
      }
    },
    items: []
  };
  
  // 定义垃圾物品及其类型
  const garbageItemsWithType = {
    '电池': { type: 'hazardous', icon: '🔋', defaultDesc: '电池中含有汞、镉等有害物质，随意丢弃会污染土壤和水源。废弃电池应投放到有害垃圾桶中。' },
    '灯泡': { type: 'hazardous', icon: '💡', defaultDesc: '灯泡中含有汞等有害物质，破碎后会释放有毒气体。废弃灯泡应小心包装后投放到有害垃圾桶中。' },
    '灯管': { type: 'hazardous', icon: '💡', defaultDesc: '荧光灯管含有汞蒸气，破碎后会释放有毒物质。废弃灯管应完整包装后投放到有害垃圾桶中。' },
    '药品': { type: 'hazardous', icon: '💊', defaultDesc: '过期药品含有有害成分，随意丢弃会污染环境。废弃药品宜连带包装一并投放到有害垃圾桶中。' },
    '油漆': { type: 'hazardous', icon: '🎨', defaultDesc: '油漆中含有挥发性有机化合物，对人体和环境有害。废弃油漆及其容器应投放到有害垃圾桶中。' },
    '温度计': { type: 'hazardous', icon: '🌡️', defaultDesc: '体温计中含有水银，破碎后会释放有毒物质。废弃体温计应小心包装后投放到有害垃圾桶中。' },
    '体温计': { type: 'hazardous', icon: '🌡️', defaultDesc: '体温计中含有水银，破碎后会释放有毒物质。废弃体温计应小心包装后投放到有害垃圾桶中。' },
    '杀虫剂': { type: 'hazardous', icon: '🐛', defaultDesc: '杀虫剂含有有毒化学成分，对人体和环境有害。废弃杀虫剂等压力罐装容器，应排空内容物后投放到有害垃圾桶中。' },
    '化妆品': { type: 'hazardous', icon: '💄', defaultDesc: '过期化妆品含有有害成分，随意丢弃会污染环境。废弃化妆品应投放到有害垃圾桶中。' },
    '苹果核': { type: 'kitchen', icon: '🍎', defaultDesc: '苹果核是有机废弃物，可以通过堆肥转化为肥料。应投放到厨余垃圾桶中。' },
    '剩菜': { type: 'kitchen', icon: '🍱', defaultDesc: '剩菜属于有机垃圾，可通过堆肥处理。应沥干水分后投放到厨余垃圾桶中。' },
    '蛋壳': { type: 'kitchen', icon: '🥚', defaultDesc: '蛋壳富含钙质，是良好的有机肥料原料。应投放到厨余垃圾桶中。' },
    '骨头': { type: 'kitchen', icon: '🍖', defaultDesc: '骨头是有机废弃物，可通过堆肥处理。大骨头难以降解，应投放到其他垃圾桶中。' },
    '蔬菜': { type: 'kitchen', icon: '🥬', defaultDesc: '蔬菜残渣是有机垃圾，可通过堆肥转化为肥料。应投放到厨余垃圾桶中。' },
    '水果': { type: 'kitchen', icon: '🍎', defaultDesc: '水果残渣是有机垃圾，可通过堆肥转化为肥料。应投放到厨余垃圾桶中。' },
    '茶叶': { type: 'kitchen', icon: '🍵', defaultDesc: '茶叶渣是有机垃圾，可通过堆肥转化为肥料。应投放到厨余垃圾桶中。' },
    '果皮': { type: 'kitchen', icon: '🍎', defaultDesc: '果皮是有机废弃物，可以通过堆肥转化为肥料。应投放到厨余垃圾桶中。' },
    '废纸': { type: 'recyclable', icon: '📄', defaultDesc: '废纸可以回收再利用，减少树木砍伐。废纸应保持平整，轻投轻放到可回收物桶中。' },
    '塑料瓶': { type: 'recyclable', icon: '🥤', defaultDesc: '塑料瓶可以回收再利用，减少塑料污染。应清空内容物，压扁后投放到可回收物桶中。' },
    '玻璃瓶': { type: 'recyclable', icon: '🍾', defaultDesc: '玻璃瓶可以多次回收利用，节约资源。应小心轻放，避免破碎，投放到可回收物桶中。' },
    '易拉罐': { type: 'recyclable', icon: '🥫', defaultDesc: '易拉罐可以回收再利用，节约金属资源。罐头盒的主要材质为金属，可以回收利用。' },
    '纸箱': { type: 'recyclable', icon: '📦', defaultDesc: '纸箱可以回收再利用，减少树木砍伐。应拆开压平后投放到可回收物桶中。' },
    '旧衣服': { type: 'recyclable', icon: '👕', defaultDesc: '旧衣服可以回收再利用，制作成新的纺织品。应清洗干净后投放到可回收物桶中。' },
    '电子产品': { type: 'recyclable', icon: '📱', defaultDesc: '电子产品含有贵重金属，可以回收再利用。应投放到可回收物桶中或专门的电子垃圾回收点。' },
    '轮胎': { type: 'recyclable', icon: '🚗', defaultDesc: '废轮胎可以回收再利用，制作成橡胶制品。应投放到专门的废轮胎回收点。' },
    '烟头': { type: 'other', icon: '🚬', defaultDesc: '烟头含有有害物质，无法回收利用。应熄灭后投放到其他垃圾桶中。' },
    '纸巾': { type: 'other', icon: '🧻', defaultDesc: '纸巾已被污染，无法回收利用。应投放到其他垃圾桶中。' },
    '尿布': { type: 'other', icon: '👶', defaultDesc: '尿布已被污染，无法回收利用。应投放到其他垃圾桶中。' },
    '陶瓷': { type: 'other', icon: '🍶', defaultDesc: '陶瓷无法回收利用，属于其他垃圾。应投放到其他垃圾桶中。' },
    '塑料袋': { type: 'other', icon: '🛍️', defaultDesc: '塑料袋难以降解，属于其他垃圾。应投放到其他垃圾桶中。' },
    '建筑垃圾': { type: 'other', icon: '🏗️', defaultDesc: '建筑垃圾无法回收利用，需要特殊处理。应投放到专门的建筑垃圾堆放点。' },
    '卫生间废纸': { type: 'other', icon: '🚽', defaultDesc: '卫生间废纸已被污染，无法回收利用。应投放到其他垃圾桶中。' }
  };
  
  // 处理提取的物品
  const processedItems = new Set();
  
  for (const item of garbageItems) {
    // 使用从 EPUB 中提取的类型
    let itemType = item.type || 'other';
    let itemIcon = '🗑️';
    
    // 根据类型设置图标
    if (itemType === 'hazardous') {
      itemIcon = '⚠️';
    } else if (itemType === 'kitchen') {
      itemIcon = '🍎';
    } else if (itemType === 'recyclable') {
      itemIcon = '♻️';
    }
    
    // 避免重复添加
    if (!processedItems.has(item.name)) {
      processedItems.add(item.name);
      
      garbageData.items.push({
        id: item.name.toLowerCase().replace(/\s+/g, '-'),
        name: item.name,
        type: itemType,
        icon: itemIcon,
        desc: item.desc || `${item.name}的相关描述`,
        image: item.image
      });
    }
  }
  
  // 为每个垃圾类型分配代表性图片
  const typeImageMap = {
    'hazardous': ['red', 'hazard', '有害'],
    'kitchen': ['green', 'kitchen', '厨余', '湿垃圾'],
    'recyclable': ['blue', 'recycle', '可回收'],
    'other': ['grey', 'gray', 'other', '其他', '干垃圾']
  };
  
  for (const [type, keywords] of Object.entries(typeImageMap)) {
    // 首先尝试从已提取的物品中找到该类型的图片
    const typeItems = garbageData.items.filter(item => item.type === type && item.image);
    if (typeItems.length > 0) {
      garbageData.types[type].image = typeItems[0].image;
    } else {
      // 如果没有找到，从图片列表中随机选择一张
      for (const [href, path] of Object.entries(imageMap)) {
        const hrefLower = href.toLowerCase();
        if (keywords.some(keyword => hrefLower.includes(keyword.toLowerCase()))) {
          garbageData.types[type].image = path;
          break;
        }
      }
    }
  }
  
  // 更新垃圾类型示例
  for (const [type, info] of Object.entries(garbageData.types)) {
    const typeItems = garbageData.items.filter(item => item.type === type);
    if (typeItems.length > 0) {
      info.examples = typeItems.slice(0, 7).map(item => item.name);
    }
  }
  
  // 如果没有提取到任何物品，使用默认数据
  if (garbageData.items.length === 0) {
    console.log('未能从 EPUB 中提取到垃圾物品，使用默认数据');
    return getDefaultData();
  }
  
  return garbageData;
}

function getDefaultData() {
  // 默认垃圾分类数据
  return {
    types: {
      hazardous: {
        name: '有害垃圾',
        color: '#F94343',
        desc: '有害垃圾是指含有对人体健康有害的重金属、有毒的物质或者对环境造成现实危害或者潜在危害的废弃物。',
        examples: ['电池', '灯管', '药品', '油漆及其容器', '温度计'],
        icon: '⚠️',
        image: ''
      },
      kitchen: {
        name: '厨余垃圾',
        color: '#52C41A',
        desc: '厨余垃圾是指居民日常生活及食品加工、饮食服务、单位供餐等活动中产生的垃圾。',
        examples: ['剩菜剩饭', '果皮', '蛋壳', '骨头', '菜叶'],
        icon: '🍎',
        image: ''
      },
      recyclable: {
        name: '可回收物',
        color: '#4B9CD3',
        desc: '可回收物是指适宜回收循环使用和资源利用的废物。',
        examples: ['纸类', '塑料', '玻璃', '金属', '织物'],
        icon: '♻️',
        image: ''
      },
      other: {
        name: '其他垃圾',
        color: '#9E9E9E',
        desc: '其他垃圾是指危害较小，但无再次利用价值的垃圾。',
        examples: ['烟头', '一次性餐具', '污损纸张', '砖瓦陶瓷'],
        icon: '🗑️',
        image: ''
      }
    },
    items: [
      { id: 'battery', name: '电池', type: 'hazardous', icon: '🔋', desc: '电池中含有汞、镉等有害物质。', image: '' },
      { id: 'light-bulb', name: '灯泡', type: 'hazardous', icon: '💡', desc: '灯泡中含有汞等有害物质。', image: '' },
      { id: 'medicine', name: '药品', type: 'hazardous', icon: '💊', desc: '过期药品含有有害成分。', image: '' },
      { id: 'apple-core', name: '苹果核', type: 'kitchen', icon: '🍎', desc: '苹果核是有机废弃物。', image: '' },
      { id: 'leftovers', name: '剩菜', type: 'kitchen', icon: '🍱', desc: '剩菜属于有机垃圾。', image: '' },
      { id: 'paper', name: '废纸', type: 'recyclable', icon: '📄', desc: '废纸可以回收再利用。', image: '' },
      { id: 'plastic-bottle', name: '塑料瓶', type: 'recyclable', icon: '🥤', desc: '塑料瓶可以回收再利用。', image: '' },
      { id: 'cigarette', name: '烟头', type: 'other', icon: '🚬', desc: '烟头含有有害物质。', image: '' },
      { id: 'tissue', name: '纸巾', type: 'other', icon: '🧻', desc: '纸巾已被污染。', image: '' }
    ]
  };
}

// 运行解析脚本
parseEpub();
