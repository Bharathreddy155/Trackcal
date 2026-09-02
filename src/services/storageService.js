// src/services/storageService.js
import { DEFAULT_PROFILE, DEFAULT_TARGETS, INITIAL_FOODS, DEFAULT_MEAL_TEMPLATES } from '../data/initialData';
import { getFormattedDateString } from './dateService';

const STORAGE_KEYS = {
  PROFILE: 'trackcal_profile_v2',
  TARGETS: 'trackcal_targets_v2',
  FOODS: 'trackcal_foods_v2',
  MEAL_TEMPLATES: 'trackcal_meal_templates_v2',
  DAILY_LOGS: 'trackcal_daily_logs_v2',
  WEIGHT_LOGS: 'trackcal_weight_logs_v2',
  WORKOUT_LOGS: 'trackcal_workout_logs_v2'
};

const LEGACY_KEYS = {
  PROFILE: 'trackcal_profile_v1',
  TARGETS: 'trackcal_targets_v1',
  FOODS: 'trackcal_foods_v1',
  MEAL_TEMPLATES: 'trackcal_meal_templates_v1',
  DAILY_LOGS: 'trackcal_daily_logs_v1',
  WEIGHT_LOGS: 'trackcal_weight_logs_v1',
  WORKOUT_LOGS: 'trackcal_workout_logs_v1'
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
  // Always prioritize updated 2,815 kcal targets
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
  // Always load fresh INITIAL_FOODS combined with any custom foods created by user
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.FOODS);
    if (!saved) return INITIAL_FOODS;
    const parsed = JSON.parse(saved);
    const customFoods = Array.isArray(parsed) ? parsed.filter(f => f.isCustom) : [];
    return [...INITIAL_FOODS, ...customFoods];
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
    version: '2.0.0',
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
  try {
    const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
    if (data.profile) saveProfile(data.profile);
    if (data.targets) saveTargets(data.targets);
    if (data.foods) saveFoods(data.foods);
    if (data.mealTemplates) saveMealTemplates(data.mealTemplates);
    if (data.dailyLogs) saveDailyLogs(data.dailyLogs);
    return { success: true };
  } catch (e) {
    console.error('Import error:', e);
    return { success: false, error: e.message };
  }
}

export function resetAllData() {
  try {
    saveProfile(DEFAULT_PROFILE);
    saveTargets(DEFAULT_TARGETS);
    saveFoods(INITIAL_FOODS);
    saveMealTemplates(DEFAULT_MEAL_TEMPLATES);
    saveDailyLogs({});
    return { success: true };
  } catch (e) {
    console.error('Reset error:', e);
    return { success: false, error: e.message };
  }
}
