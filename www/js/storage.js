const STORAGE_KEY = 'world_explorer_data';
const MAX_TRAVELERS = 3;

const STAMP_TYPES = {
  ENTRY: 'entry',
  EXIT: 'exit',
  SPECIAL: 'special',
  CREATIVE: 'creative'
};

const AVATARS = [
  '🧑‍✈️', '👨‍✈️', '👩‍✈️', '🧒', '👦', '👧', 
  '🦸', '🧙', '🧚', '🦹', 
  '🐨', '🐼', '🦊', '🐯', '🦁', 
  '🐸', '🐻', '🐰', '🦄', '🦋'
];

const defaultSaveData = {
  collectedCountries: [],
  countryStamps: {},
  unlockedBadges: [],
  lastVisit: null,
  settings: {
    soundEnabled: true,
    bgmEnabled: false,
    voiceEnabled: true
  },
  gameStats: {
    tapGame: {
      totalCorrect: 0,
      highScore: 0
    },
    puzzleGame: {
      totalPlays: 0,
      bestTimes: {}
    },
    matchGame: {
      totalPlays: 0,
      bestTimes: {}
    },
    linkGame: {
      totalPlays: 0,
      bestTimes: {}
    },
    coloring: {
      totalSaved: 0
    }
  },
  gallery: []
};

const defaultGlobalData = {
  travelers: [],
  currentTravelerId: null,
  saves: {},
  leaderboards: {
    tapGame: [],
    puzzleGame: {
      easy: [],
      medium: [],
      hard: []
    },
    matchGame: {},
    linkGame: {}
  }
};

function saveGlobalData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error('保存数据失败:', e);
    return false;
  }
}

function loadGlobalData() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      return { 
        travelers: parsed.travelers || [],
        currentTravelerId: parsed.currentTravelerId || null,
        saves: parsed.saves || {},
        leaderboards: parsed.leaderboards || {
          tapGame: [],
          puzzleGame: { easy: [], medium: [], hard: [] },
          matchGame: {},
          linkGame: {}
        },
        tapGameLeaderboard: parsed.tapGameLeaderboard || [],
        puzzleGameLeaderboard: parsed.puzzleGameLeaderboard || []
      };
    }
    return { ...defaultGlobalData };
  } catch (e) {
    console.error('加载数据失败:', e);
    return { ...defaultGlobalData };
  }
}

function clearAllData() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (e) {
    console.error('清除数据失败:', e);
    return false;
  }
}

function getAllTravelers() {
  const data = loadGlobalData();
  return data.travelers || [];
}

function getCurrentTraveler() {
  const data = loadGlobalData();
  if (!data.currentTravelerId) return null;
  return data.travelers.find(t => t.id === data.currentTravelerId) || null;
}

function getCurrentTravelerId() {
  const data = loadGlobalData();
  return data.currentTravelerId;
}

function canCreateTraveler() {
  const travelers = getAllTravelers();
  return travelers.length < MAX_TRAVELERS;
}

function getRemainingTravelerSlots() {
  return MAX_TRAVELERS - getAllTravelers().length;
}

function createTraveler(name, avatar) {
  const data = loadGlobalData();
  
  if (data.travelers.length >= MAX_TRAVELERS) {
    return { success: false, error: '已达到旅行家数量上限' };
  }
  
  if (data.travelers.some(t => t.name === name)) {
    return { success: false, error: '旅行家名字已存在' };
  }
  
  const id = 'traveler_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  
  const traveler = {
    id: id,
    name: name,
    avatar: avatar || AVATARS[0],
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString()
  };
  
  data.travelers.push(traveler);
  data.saves[id] = { ...defaultSaveData, lastVisit: new Date().toISOString() };
  data.currentTravelerId = id;
  
  saveGlobalData(data);
  
  return { success: true, traveler: traveler };
}

function selectTraveler(travelerId) {
  const data = loadGlobalData();
  
  const traveler = data.travelers.find(t => t.id === travelerId);
  if (!traveler) {
    return { success: false, error: '旅行家不存在' };
  }
  
  traveler.lastLoginAt = new Date().toISOString();
  data.currentTravelerId = travelerId;
  
  saveGlobalData(data);
  
  return { success: true, traveler: traveler };
}

function deleteTraveler(travelerId) {
  const data = loadGlobalData();
  
  const index = data.travelers.findIndex(t => t.id === travelerId);
  if (index === -1) {
    return { success: false, error: '旅行家不存在' };
  }
  
  data.travelers.splice(index, 1);
  delete data.saves[travelerId];
  
  removeLeaderboardEntries(data, travelerId);
  
  if (data.currentTravelerId === travelerId) {
    data.currentTravelerId = data.travelers.length > 0 ? data.travelers[0].id : null;
  }
  
  saveGlobalData(data);
  
  return { success: true };
}

function clearTravelerSave(travelerId) {
  const data = loadGlobalData();
  
  if (!data.saves[travelerId]) {
    return { success: false, error: '旅行家存档不存在' };
  }
  
  data.saves[travelerId] = { ...defaultSaveData, lastVisit: new Date().toISOString() };
  
  removeLeaderboardEntries(data, travelerId);
  
  saveGlobalData(data);
  
  return { success: true };
}

function removeLeaderboardEntries(data, travelerId) {
  if (data.leaderboards) {
    if (data.leaderboards.tapGame) {
      data.leaderboards.tapGame = data.leaderboards.tapGame.filter(r => r.accountId !== travelerId);
    }
    
    ['easy', 'medium', 'hard'].forEach(diff => {
      if (data.leaderboards.puzzleGame && data.leaderboards.puzzleGame[diff]) {
        data.leaderboards.puzzleGame[diff] = data.leaderboards.puzzleGame[diff].filter(r => r.accountId !== travelerId);
      }
    });
    
    Object.keys(data.leaderboards.matchGame || {}).forEach(diff => {
      data.leaderboards.matchGame[diff] = data.leaderboards.matchGame[diff].filter(r => r.accountId !== travelerId);
    });
    
    Object.keys(data.leaderboards.linkGame || {}).forEach(diff => {
      data.leaderboards.linkGame[diff] = data.leaderboards.linkGame[diff].filter(r => r.accountId !== travelerId);
    });
  }
  
  if (data.tapGameLeaderboard) {
    data.tapGameLeaderboard = data.tapGameLeaderboard.filter(r => r.travelerId !== travelerId);
  }
  if (data.puzzleGameLeaderboard) {
    data.puzzleGameLeaderboard = data.puzzleGameLeaderboard.filter(r => r.travelerId !== travelerId);
  }
}

function logoutCurrentTraveler() {
  const data = loadGlobalData();
  data.currentTravelerId = null;
  saveGlobalData(data);
  return true;
}

function renameTraveler(travelerId, newName) {
  const data = loadGlobalData();
  
  const traveler = data.travelers.find(t => t.id === travelerId);
  if (!traveler) {
    return { success: false, error: '旅行家不存在' };
  }
  
  if (data.travelers.some(t => t.id !== travelerId && t.name === newName)) {
    return { success: false, error: '旅行家名字已存在' };
  }
  
  traveler.name = newName;
  
  saveGlobalData(data);
  
  return { success: true };
}

function changeTravelerAvatar(travelerId, newAvatar) {
  const data = loadGlobalData();
  
  const traveler = data.travelers.find(t => t.id === travelerId);
  if (!traveler) {
    return { success: false, error: '旅行家不存在' };
  }
  
  traveler.avatar = newAvatar;
  saveGlobalData(data);
  
  return { success: true };
}

function loadCurrentSaveData() {
  const data = loadGlobalData();
  const travelerId = data.currentTravelerId;
  
  if (!travelerId) {
    return { ...defaultSaveData };
  }
  
  const save = data.saves[travelerId];
  if (!save) {
    return { ...defaultSaveData };
  }
  
  const migratedStamps = {};
  if (save.countryStamps) {
    Object.keys(save.countryStamps).forEach(countryId => {
      const stamp = save.countryStamps[countryId];
      if (Array.isArray(stamp)) {
        migratedStamps[countryId] = stamp;
      } else if (stamp && stamp.type) {
        migratedStamps[countryId] = [stamp];
      }
    });
  }
  
  return { 
    ...defaultSaveData, 
    ...save, 
    countryStamps: migratedStamps,
    settings: { ...defaultSaveData.settings, ...save.settings },
    gameStats: { ...defaultSaveData.gameStats, ...save.gameStats }
  };
}

function saveCurrentSaveData(saveData) {
  const data = loadGlobalData();
  const travelerId = data.currentTravelerId;
  
  if (!travelerId) {
    console.error('没有当前旅行家，无法保存');
    return false;
  }
  
  saveData.lastVisit = new Date().toISOString();
  data.saves[travelerId] = saveData;
  
  return saveGlobalData(data);
}

function saveData(saveData) {
  return saveCurrentSaveData(saveData);
}

function loadData() {
  return loadCurrentSaveData();
}

function isCountryCollected(countryId) {
  const saveData = loadCurrentSaveData();
  return !!saveData.countryStamps[countryId];
}

function getCountryStamp(countryId) {
  const saveData = loadCurrentSaveData();
  const stamps = saveData.countryStamps[countryId];
  return stamps && stamps.length > 0 ? stamps : null;
}

function addStampToCountry(countryId) {
  const saveData = loadCurrentSaveData();
  
  if (!saveData.countryStamps[countryId]) {
    saveData.countryStamps[countryId] = [];
  }
  const stamps = saveData.countryStamps[countryId];
  
  if (stamps.length >= 4) {
    return { alreadyCompleted: true, stamps: stamps };
  }
  
  const stampOrder = [STAMP_TYPES.ENTRY, STAMP_TYPES.EXIT, STAMP_TYPES.SPECIAL, STAMP_TYPES.CREATIVE];
  const stampType = stampOrder[stamps.length];
  
  const stamp = {
    type: stampType,
    date: new Date().toISOString()
  };
  
  stamps.push(stamp);
  
  if (!saveData.collectedCountries.includes(countryId)) {
    saveData.collectedCountries.push(countryId);
  }
  
  saveCurrentSaveData(saveData);
  
  return {
    alreadyCompleted: false,
    newStamp: stamp,
    stamps: stamps,
    isCompleted: stamps.length >= 4
  };
}

function isCountryCompleted(countryId) {
  const stamps = getCountryStamp(countryId);
  return stamps && stamps.length >= 4;
}

function getCountryStampCount(countryId) {
  const stamps = getCountryStamp(countryId);
  return stamps ? stamps.length : 0;
}

function getStampCountByType(stampType) {
  const saveData = loadCurrentSaveData();
  let count = 0;
  Object.values(saveData.countryStamps).forEach(stamps => {
    if (Array.isArray(stamps)) {
      count += stamps.filter(s => s.type === stampType).length;
    }
  });
  return count;
}

function getTotalStampCount() {
  const saveData = loadCurrentSaveData();
  let count = 0;
  Object.values(saveData.countryStamps).forEach(stamps => {
    if (Array.isArray(stamps)) {
      count += stamps.length;
    }
  });
  return count;
}

function getAllStamps() {
  const saveData = loadCurrentSaveData();
  return saveData.countryStamps;
}

function getCollectedCount() {
  const saveData = loadCurrentSaveData();
  return Object.keys(saveData.countryStamps).length;
}

function getCompletedCount() {
  const saveData = loadCurrentSaveData();
  return Object.values(saveData.countryStamps).filter(stamps => 
    Array.isArray(stamps) && stamps.length >= 3
  ).length;
}

function getCollectedCountByContinent(continentId) {
  const saveData = loadCurrentSaveData();
  const countries = getCountriesByContinent(continentId);
  return countries.filter(c => saveData.countryStamps[c.id]).length;
}

function getCollectedCountriesByContinent(continentId) {
  const saveData = loadCurrentSaveData();
  const countries = getCountriesByContinent(continentId);
  return countries.filter(c => saveData.countryStamps[c.id]);
}

function isBadgeUnlocked(badgeId) {
  const saveData = loadCurrentSaveData();
  return saveData.unlockedBadges.includes(badgeId);
}

function unlockBadge(badgeId) {
  const saveData = loadCurrentSaveData();
  if (!saveData.unlockedBadges.includes(badgeId)) {
    saveData.unlockedBadges.push(badgeId);
    saveCurrentSaveData(saveData);
    return true;
  }
  return false;
}

function isSoundEnabled() {
  const saveData = loadCurrentSaveData();
  return saveData.settings.soundEnabled;
}

function setSoundEnabled(enabled) {
  const saveData = loadCurrentSaveData();
  saveData.settings.soundEnabled = enabled;
  saveCurrentSaveData(saveData);
}

function isBgmEnabled() {
  const saveData = loadCurrentSaveData();
  return saveData.settings.bgmEnabled;
}

function setBgmEnabled(enabled) {
  const saveData = loadCurrentSaveData();
  saveData.settings.bgmEnabled = enabled;
  saveCurrentSaveData(saveData);
}

function isVoiceEnabled() {
  const saveData = loadCurrentSaveData();
  return saveData.settings.voiceEnabled !== false;
}

function setVoiceEnabled(enabled) {
  const saveData = loadCurrentSaveData();
  saveData.settings.voiceEnabled = enabled;
  saveCurrentSaveData(saveData);
}

function saveGalleryItem(countryId, imageData) {
  const saveData = loadCurrentSaveData();
  
  if (!saveData.gallery) {
    saveData.gallery = [];
  }
  
  const item = {
    id: 'gallery_' + Date.now(),
    countryId: countryId,
    imageData: imageData,
    createdAt: new Date().toISOString()
  };
  
  saveData.gallery.push(item);
  saveData.gameStats.coloring.totalSaved++;
  
  saveCurrentSaveData(saveData);
  
  return item;
}

function getGallery() {
  const saveData = loadCurrentSaveData();
  return saveData.gallery || [];
}

function deleteGalleryItem(itemId) {
  const saveData = loadCurrentSaveData();
  
  if (!saveData.gallery) return false;
  
  const index = saveData.gallery.findIndex(item => item.id === itemId);
  if (index === -1) return false;
  
  saveData.gallery.splice(index, 1);
  saveData.gameStats.coloring.totalSaved = Math.max(0, saveData.gameStats.coloring.totalSaved - 1);
  
  saveCurrentSaveData(saveData);
  
  return true;
}

function updateLeaderboard(gameType, difficulty, entry) {
  const data = loadGlobalData();
  
  if (!data.leaderboards) {
    data.leaderboards = {
      tapGame: [],
      puzzleGame: { easy: [], medium: [], hard: [] },
      matchGame: {},
      linkGame: {}
    };
  }
  
  if (gameType === 'tapGame') {
    if (!data.leaderboards.tapGame) {
      data.leaderboards.tapGame = [];
    }
    data.leaderboards.tapGame.push(entry);
    data.leaderboards.tapGame.sort((a, b) => b.score - a.score);
    data.leaderboards.tapGame = data.leaderboards.tapGame.slice(0, 50);
  } else {
    if (!data.leaderboards[gameType]) {
      data.leaderboards[gameType] = {};
    }
    if (!data.leaderboards[gameType][difficulty]) {
      data.leaderboards[gameType][difficulty] = [];
    }
    
    data.leaderboards[gameType][difficulty].push(entry);
    data.leaderboards[gameType][difficulty].sort((a, b) => a.time - b.time);
    data.leaderboards[gameType][difficulty] = data.leaderboards[gameType][difficulty].slice(0, 50);
  }
  
  saveGlobalData(data);
  
  return getLeaderboardRank(gameType, difficulty, entry);
}

function getLeaderboardRank(gameType, difficulty, entry) {
  const data = loadGlobalData();
  
  if (gameType === 'tapGame') {
    const list = data.leaderboards?.tapGame || [];
    return list.findIndex(r => 
      r.accountId === entry.accountId && 
      r.score === entry.score && 
      r.date === entry.date
    ) + 1;
  } else {
    const list = data.leaderboards?.[gameType]?.[difficulty] || [];
    return list.findIndex(r => 
      r.accountId === entry.accountId && 
      r.time === entry.time && 
      r.date === entry.date
    ) + 1;
  }
}

function getLeaderboard(gameType, difficulty) {
  const data = loadGlobalData();
  
  if (gameType === 'tapGame') {
    return data.leaderboards?.tapGame || [];
  } else {
    return data.leaderboards?.[gameType]?.[difficulty] || [];
  }
}

function saveTapGameScore(score) {
  const data = loadGlobalData();
  const currentTraveler = getCurrentTraveler();
  
  if (!currentTraveler) {
    console.error('没有当前旅行家，无法保存分数');
    return -1;
  }
  
  if (!data.tapGameLeaderboard) {
    data.tapGameLeaderboard = [];
  }
  
  const record = {
    travelerId: currentTraveler.id,
    travelerName: currentTraveler.name,
    score: score,
    date: new Date().toISOString()
  };
  
  data.tapGameLeaderboard.push(record);
  data.tapGameLeaderboard.sort((a, b) => b.score - a.score);
  data.tapGameLeaderboard = data.tapGameLeaderboard.slice(0, 50);
  
  const newRecord = {
    accountId: currentTraveler.id,
    name: currentTraveler.name,
    avatar: currentTraveler.avatar,
    score: score,
    date: new Date().toISOString()
  };
  
  if (!data.leaderboards) {
    data.leaderboards = {
      tapGame: [],
      puzzleGame: { easy: [], medium: [], hard: [] },
      matchGame: {},
      linkGame: {}
    };
  }
  
  if (!data.leaderboards.tapGame) {
    data.leaderboards.tapGame = [];
  }
  
  data.leaderboards.tapGame.push(newRecord);
  data.leaderboards.tapGame.sort((a, b) => b.score - a.score);
  data.leaderboards.tapGame = data.leaderboards.tapGame.slice(0, 50);
  
  saveGlobalData(data);
  
  const rank = data.leaderboards.tapGame.findIndex(r => 
    r.accountId === currentTraveler.id && 
    r.score === score && 
    r.date === newRecord.date
  ) + 1;
  
  const saveData = loadCurrentSaveData();
  if (score > saveData.gameStats.tapGame.highScore) {
    saveData.gameStats.tapGame.highScore = score;
    saveCurrentSaveData(saveData);
  }
  saveData.gameStats.tapGame.totalCorrect++;
  saveCurrentSaveData(saveData);
  
  return rank;
}

function getTapGameLeaderboard() {
  const data = loadGlobalData();
  return data.leaderboards?.tapGame || data.tapGameLeaderboard || [];
}

function getTapGameHighScore(travelerId) {
  const data = loadGlobalData();
  
  if (travelerId) {
    const save = data.saves[travelerId];
    return save?.gameStats?.tapGame?.highScore || 0;
  }
  
  const leaderboard = getTapGameLeaderboard();
  const currentId = getCurrentTravelerId();
  const travelerRecords = leaderboard.filter(r => r.accountId === currentId || r.travelerId === currentId);
  
  if (travelerRecords.length === 0) return 0;
  
  return Math.max(...travelerRecords.map(r => r.score));
}

function savePuzzleGameTime(difficulty, time) {
  const currentTraveler = getCurrentTraveler();
  if (!currentTraveler) return -1;
  
  const entry = {
    accountId: currentTraveler.id,
    name: currentTraveler.name,
    avatar: currentTraveler.avatar,
    time: time,
    date: new Date().toISOString()
  };
  
  const rank = updateLeaderboard('puzzleGame', difficulty, entry);
  
  const saveData = loadCurrentSaveData();
  if (!saveData.gameStats.puzzleGame.bestTimes) {
    saveData.gameStats.puzzleGame.bestTimes = {};
  }
  if (!saveData.gameStats.puzzleGame.bestTimes[difficulty] || time < saveData.gameStats.puzzleGame.bestTimes[difficulty]) {
    saveData.gameStats.puzzleGame.bestTimes[difficulty] = time;
  }
  saveData.gameStats.puzzleGame.totalPlays++;
  saveCurrentSaveData(saveData);
  
  return rank;
}

function getPuzzleGameLeaderboard(difficulty) {
  return getLeaderboard('puzzleGame', difficulty);
}

function saveMatchGameTime(difficulty, time) {
  const currentTraveler = getCurrentTraveler();
  if (!currentTraveler) return -1;
  
  const entry = {
    accountId: currentTraveler.id,
    name: currentTraveler.name,
    avatar: currentTraveler.avatar,
    time: time,
    date: new Date().toISOString()
  };
  
  const rank = updateLeaderboard('matchGame', difficulty, entry);
  
  const saveData = loadCurrentSaveData();
  if (!saveData.gameStats.matchGame.bestTimes) {
    saveData.gameStats.matchGame.bestTimes = {};
  }
  if (!saveData.gameStats.matchGame.bestTimes[difficulty] || time < saveData.gameStats.matchGame.bestTimes[difficulty]) {
    saveData.gameStats.matchGame.bestTimes[difficulty] = time;
  }
  saveData.gameStats.matchGame.totalPlays++;
  saveCurrentSaveData(saveData);
  
  return rank;
}

function getMatchGameLeaderboard(difficulty) {
  return getLeaderboard('matchGame', difficulty);
}

function saveLinkGameTime(difficulty, time) {
  const currentTraveler = getCurrentTraveler();
  if (!currentTraveler) return -1;
  
  const entry = {
    accountId: currentTraveler.id,
    name: currentTraveler.name,
    avatar: currentTraveler.avatar,
    time: time,
    date: new Date().toISOString()
  };
  
  const rank = updateLeaderboard('linkGame', difficulty, entry);
  
  const saveData = loadCurrentSaveData();
  if (!saveData.gameStats.linkGame.bestTimes) {
    saveData.gameStats.linkGame.bestTimes = {};
  }
  if (!saveData.gameStats.linkGame.bestTimes[difficulty] || time < saveData.gameStats.linkGame.bestTimes[difficulty]) {
    saveData.gameStats.linkGame.bestTimes[difficulty] = time;
  }
  saveData.gameStats.linkGame.totalPlays++;
  saveCurrentSaveData(saveData);
  
  return rank;
}

function getLinkGameLeaderboard(difficulty) {
  return getLeaderboard('linkGame', difficulty);
}

function getAvatars() {
  return AVATARS;
}

function getTravelerStats(travelerId) {
  const data = loadGlobalData();
  const save = data.saves[travelerId];
  
  if (!save) {
    return {
      collectedCountries: 0,
      totalStamps: 0,
      unlockedBadges: 0,
      highScores: {}
    };
  }
  
  return {
    collectedCountries: Object.keys(save.countryStamps || {}).length,
    totalStamps: getTotalStampCountForTraveler(save),
    unlockedBadges: (save.unlockedBadges || []).length,
    highScores: {
      tapGame: save.gameStats?.tapGame?.highScore || 0,
      puzzleGame: save.gameStats?.puzzleGame?.bestTimes || {},
      matchGame: save.gameStats?.matchGame?.bestTimes || {},
      linkGame: save.gameStats?.linkGame?.bestTimes || {}
    }
  };
}

function getTotalStampCountForTraveler(save) {
  let count = 0;
  Object.values(save.countryStamps || {}).forEach(stamps => {
    if (Array.isArray(stamps)) {
      count += stamps.length;
    }
  });
  return count;
}
