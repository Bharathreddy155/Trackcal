// src/services/storageService.js
import { DEFAULT_PROFILE, DEFAULT_TARGETS, INITIAL_FOODS, DEFAULT_MEAL_TEMPLATES } from '../data/initialData';
import { getFormattedDateString } from './dateService';

const STORAGE_KEYS = {
  PROFILE: 'trackcal_profile_v1',
  TARGETS: 'trackcal_targets_v1',
  FOODS: 'trackcal_foods_v1',
  MEAL_TEMPLATES: 'trackcal_meal_templates_v1',
  DAILY_LOGS: 'trackcal_daily_logs_v1',
  WEIGHT_LOGS: 'trackcal_weight_logs_v1',
  WORKOUT_LOGS: 'trackcal_workout_logs_v1'
};

const LEGACY_KEYS = {
  PROFILE: 'bulktrack_profile_v1',
  TARGETS: 'bulktrack_targets_v1',
  FOODS: 'bulktrack_foods_v1',
  MEAL_TEMPLATES: 'bulktrack_meal_templates_v1',
  DAILY_LOGS: 'bulktrack_daily_logs_v1',
  WEIGHT_LOGS: 'bulktrack_weight_logs_v1',
  WORKOUT_LOGS: 'bulktrack_workout_logs_v1'
};

function getStoredItem(key, legacyKey, fallback) {
  try {
    const data = localStorage.getItem(key) || localStorage.getItem(legacyKey);
    return data ? JSON.parse(data) : fallback;
  } catch (e) {
    return fallback;
  }
}

export function loadProfile() {
  return getStoredItem(STORAGE_KEYS.PROFILE, LEGACY_KEYS.PROFILE, DEFAULT_PROFILE);
}

export function saveProfile(profile) {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Error saving profile:', e);
  }
}

export function loadTargets() {
  return getStoredItem(STORAGE_KEYS.TARGETS, LEGACY_KEYS.TARGETS, DEFAULT_TARGETS);
}

export function saveTargets(targets) {
  try {
    localStorage.setItem(STORAGE_KEYS.TARGETS, JSON.stringify(targets));
  } catch (e) {
    console.error('Error saving targets:', e);
  }
}

export function loadFoods() {
  return getStoredItem(STORAGE_KEYS.FOODS, LEGACY_KEYS.FOODS, INITIAL_FOODS);
}

export function saveFoods(foods) {
  try {
    localStorage.setItem(STORAGE_KEYS.FOODS, JSON.stringify(foods));
  } catch (e) {
    console.error('Error saving foods:', e);
  }
}

export function loadMealTemplates() {
  return getStoredItem(STORAGE_KEYS.MEAL_TEMPLATES, LEGACY_KEYS.MEAL_TEMPLATES, DEFAULT_MEAL_TEMPLATES);
}

export function saveMealTemplates(templates) {
  try {
    localStorage.setItem(STORAGE_KEYS.MEAL_TEMPLATES, JSON.stringify(templates));
  } catch (e) {
    console.error('Error saving meal templates:', e);
  }
}

export function loadDailyLogs() {
  return getStoredItem(STORAGE_KEYS.DAILY_LOGS, LEGACY_KEYS.DAILY_LOGS, {});
}

export function saveDailyLogs(dailyLogs) {
  try {
    localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(dailyLogs));
  } catch (e) {
    console.error('Error saving daily logs:', e);
  }
}

export function createEmptyDailyLog(dateString) {
  return {
    date: dateString,
    dayType: 'non-chicken',
    chickenQuantity: 175,
    curryQuantityLunch: 60,
    curryQuantityDinner: 60,
    weight: null,
    waterIntakeLiters: 0,
    supplements: {
      whey: { taken: false, scoops: 1, loggedAt: null },
      creatine: { taken: false, grams: 3, loggedAt: null }
    },
    meals: {
      breakfast: { isLogged: false, loggedAt: null, items: [] },
      lunch: { isLogged: false, loggedAt: null, items: [] },
      snack: { isLogged: false, loggedAt: null, items: [] },
      dinner: { isLogged: false, loggedAt: null, items: [] }
    },
    workout: {
      completed: false,
      name: '',
      durationMinutes: 0,
      notes: '',
      exercises: []
    }
  };
}

export function exportAllData() {
  const exportPayload = {
    appName: 'Trackcal',
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
  a.download = `trackcal_backup_${getFormattedDateString()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importAllData(jsonData) {
  if (!jsonData || (jsonData.appName !== 'Trackcal' && jsonData.appName !== 'BulkTrack')) {
    throw new Error('Invalid Trackcal backup file format.');
  }

  if (jsonData.profile) saveProfile(jsonData.profile);
  if (jsonData.targets) saveTargets(jsonData.targets);
  if (jsonData.foods) saveFoods(jsonData.foods);
  if (jsonData.mealTemplates) saveMealTemplates(jsonData.mealTemplates);
  if (jsonData.dailyLogs) saveDailyLogs(jsonData.dailyLogs);
}

export function resetAllData() {
  Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
  Object.values(LEGACY_KEYS).forEach(k => localStorage.removeItem(k));
  saveProfile(DEFAULT_PROFILE);
  saveTargets(DEFAULT_TARGETS);
  saveFoods(INITIAL_FOODS);
  saveMealTemplates(DEFAULT_MEAL_TEMPLATES);
  saveDailyLogs({});
}
