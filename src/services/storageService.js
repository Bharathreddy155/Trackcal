// src/services/storageService.js
import { DEFAULT_PROFILE, DEFAULT_TARGETS, INITIAL_FOODS, DEFAULT_MEAL_TEMPLATES } from '../data/initialData';
import { getFormattedDateString } from './dateService';

const STORAGE_KEYS = {
  PROFILE: 'bulktrack_profile_v1',
  TARGETS: 'bulktrack_targets_v1',
  FOODS: 'bulktrack_foods_v1',
  MEAL_TEMPLATES: 'bulktrack_meal_templates_v1',
  DAILY_LOGS: 'bulktrack_daily_logs_v1',
  WEIGHT_LOGS: 'bulktrack_weight_logs_v1',
  WORKOUT_LOGS: 'bulktrack_workout_logs_v1'
};

export function loadProfile() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return data ? JSON.parse(data) : DEFAULT_PROFILE;
  } catch (e) {
    console.error('Error loading profile:', e);
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(profile) {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Error saving profile:', e);
  }
}

export function loadTargets() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TARGETS);
    return data ? JSON.parse(data) : DEFAULT_TARGETS;
  } catch (e) {
    return DEFAULT_TARGETS;
  }
}

export function saveTargets(targets) {
  try {
    localStorage.setItem(STORAGE_KEYS.TARGETS, JSON.stringify(targets));
  } catch (e) {
    console.error('Error saving targets:', e);
  }
}

export function loadFoods() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.FOODS);
    return data ? JSON.parse(data) : INITIAL_FOODS;
  } catch (e) {
    return INITIAL_FOODS;
  }
}

export function saveFoods(foods) {
  try {
    localStorage.setItem(STORAGE_KEYS.FOODS, JSON.stringify(foods));
  } catch (e) {
    console.error('Error saving foods:', e);
  }
}

export function loadMealTemplates() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.MEAL_TEMPLATES);
    return data ? JSON.parse(data) : DEFAULT_MEAL_TEMPLATES;
  } catch (e) {
    return DEFAULT_MEAL_TEMPLATES;
  }
}

export function saveMealTemplates(templates) {
  try {
    localStorage.setItem(STORAGE_KEYS.MEAL_TEMPLATES, JSON.stringify(templates));
  } catch (e) {
    console.error('Error saving meal templates:', e);
  }
}

export function loadDailyLogs() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.DAILY_LOGS);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    return {};
  }
}

export function saveDailyLogs(logs) {
  try {
    localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(logs));
  } catch (e) {
    console.error('Error saving daily logs:', e);
  }
}

/**
 * Creates default daily log structure if missing for given date
 */
export function createEmptyDailyLog(dateStr = getFormattedDateString(), dayType = 'non-chicken') {
  return {
    date: dateStr,
    dayType: dayType, // 'non-chicken' | 'chicken'
    chickenQuantity: 175,
    curryQuantityLunch: 60,
    curryQuantityDinner: 60,
    meals: {
      breakfast: { isLogged: false, loggedAt: null, items: [] },
      lunch: { isLogged: false, loggedAt: null, items: [] },
      snack: { isLogged: false, loggedAt: null, items: [] },
      dinner: { isLogged: false, loggedAt: null, items: [] }
    },
    supplements: {
      whey: { taken: false, scoops: 1, explicitExtra: false, loggedAt: null },
      creatine: { taken: false, grams: 3, loggedAt: null }
    },
    workout: {
      completed: false,
      name: '',
      durationMinutes: 0,
      notes: '',
      exercises: []
    },
    weight: null,
    notes: ''
  };
}

/**
 * Exports all application data to downloadable JSON
 */
export function exportAllData() {
  const exportPayload = {
    appName: 'BulkTrack',
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    profile: loadProfile(),
    targets: loadTargets(),
    foods: loadFoods(),
    mealTemplates: loadMealTemplates(),
    dailyLogs: loadDailyLogs()
  };

  const jsonStr = JSON.stringify(exportPayload, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `bulktrack_backup_${getFormattedDateString()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Restores data from imported JSON file object
 */
export function importAllData(jsonData) {
  if (!jsonData || !jsonData.appName === 'BulkTrack') {
    throw new Error('Invalid BulkTrack backup file format.');
  }

  if (jsonData.profile) saveProfile(jsonData.profile);
  if (jsonData.targets) saveTargets(jsonData.targets);
  if (jsonData.foods) saveFoods(jsonData.foods);
  if (jsonData.mealTemplates) saveMealTemplates(jsonData.mealTemplates);
  if (jsonData.dailyLogs) saveDailyLogs(jsonData.dailyLogs);

  return true;
}

/**
 * Clears all LocalStorage data and re-initializes defaults
 */
export function resetAllData() {
  Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
}
