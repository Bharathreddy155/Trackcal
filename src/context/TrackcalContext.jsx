// src/context/TrackcalContext.jsx
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  loadProfile, saveProfile,
  loadTargets, saveTargets,
  loadFoods, saveFoods,
  loadMealTemplates, saveMealTemplates,
  loadDailyLogs, saveDailyLogs,
  createEmptyDailyLog,
  exportAllData, importAllData, resetAllData
} from '../services/storageService';
import { getFormattedDateString, addDaysToDate } from '../services/dateService';
import { getPlannedMealItems, getFoodById } from '../services/nutritionEngine';
import { subscribeToCloudSync, pushToCloudSync } from '../services/firebase';

const TrackcalContext = createContext();

export function TrackcalProvider({ children }) {
  const [currentDate, setCurrentDate] = useState(getFormattedDateString());
  const [profile, setProfileState] = useState(loadProfile);
  const [targets, setTargetsState] = useState(loadTargets);
  const [foods, setFoodsState] = useState(loadFoods);
  const [mealTemplates, setMealTemplatesState] = useState(loadMealTemplates);
  const [dailyLogs, setDailyLogsState] = useState(loadDailyLogs);

  // Cloud Sync State
  const [syncCode, setSyncCode] = useState(() => {
    return localStorage.getItem('trackcal_sync_code') || localStorage.getItem('bulktrack_sync_code') || 'bharath-bulking-70kg';
  });
  const [isCloudConnected, setIsCloudConnected] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState(null);

  const [toastMessage, setToastMessage] = useState(null);
  const isRemoteUpdatingRef = useRef(false);

  // Sync state to LocalStorage
  useEffect(() => saveProfile(profile), [profile]);
  useEffect(() => saveTargets(targets), [targets]);
  useEffect(() => saveFoods(foods), [foods]);
  useEffect(() => saveMealTemplates(mealTemplates), [mealTemplates]);
  useEffect(() => saveDailyLogs(dailyLogs), [dailyLogs]);
  useEffect(() => {
    localStorage.setItem('trackcal_sync_code', syncCode);
    localStorage.setItem('bulktrack_sync_code', syncCode);
  }, [syncCode]);

  // Theme State ('light' | 'dark')
  const [theme, setThemeState] = useState(() => {
    const saved = localStorage.getItem('trackcal_theme') || localStorage.getItem('bulktrack_theme');
    if (saved) return saved;
    return 'light';
  });

  useEffect(() => {
    localStorage.setItem('trackcal_theme', theme);
    localStorage.setItem('bulktrack_theme', theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setThemeState(next);
    showToast(`Switched to ${next === 'dark' ? '🌙 Night Mode' : '☀️ Normal Mode'}`, 'info');
  };

  const setTheme = (newTheme) => {
    if (newTheme === 'dark' || newTheme === 'light') {
      setThemeState(newTheme);
      showToast(`Switched to ${newTheme === 'dark' ? '🌙 Night Mode' : '☀️ Normal Mode'}`, 'info');
    }
  };

  // Toast Helper
  const showToast = (message, type = 'info') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Real-time Cloud Sync Listener (Firebase Firestore onSnapshot)
  useEffect(() => {
    if (!syncCode) return;

    const unsubscribe = subscribeToCloudSync(
      syncCode,
      (remoteData) => {
        if (!remoteData) return;
        isRemoteUpdatingRef.current = true;

        if (remoteData.profile) setProfileState(remoteData.profile);
        if (remoteData.targets) setTargetsState(remoteData.targets);
        if (remoteData.foods) setFoodsState(remoteData.foods);
        if (remoteData.mealTemplates) setMealTemplatesState(remoteData.mealTemplates);
        if (remoteData.dailyLogs) setDailyLogsState(remoteData.dailyLogs);

        setIsCloudConnected(true);
        setLastSyncTime(new Date().toLocaleTimeString());

        setTimeout(() => {
          isRemoteUpdatingRef.current = false;
        }, 500);
      },
      (err) => {
        setIsCloudConnected(false);
      }
    );

    return () => unsubscribe();
  }, [syncCode]);

  // Helper to push local data to Firebase Cloud
  const syncToCloud = async (overrideLogs, overrideProfile, overrideTargets, overrideFoods, overrideTemplates) => {
    if (isRemoteUpdatingRef.current || !syncCode) return;

    const payload = {
      profile: overrideProfile || profile,
      targets: overrideTargets || targets,
      foods: overrideFoods || foods,
      mealTemplates: overrideTemplates || mealTemplates,
      dailyLogs: overrideLogs || dailyLogs
    };

    const success = await pushToCloudSync(syncCode, payload);
    if (success) {
      setIsCloudConnected(true);
      setLastSyncTime(new Date().toLocaleTimeString());
    }
  };

  // Helper to ensure current date log exists
  const getCurrentDailyLog = () => {
    if (!dailyLogs[currentDate]) {
      return createEmptyDailyLog(currentDate);
    }
    return dailyLogs[currentDate];
  };

  // Helper to update current daily log state
  const updateCurrentDailyLog = (updaterFn) => {
    setDailyLogsState(prev => {
      const current = prev[currentDate] || createEmptyDailyLog(currentDate);
      const updated = typeof updaterFn === 'function' ? updaterFn(current) : { ...current, ...updaterFn };
      const nextLogs = { ...prev, [currentDate]: updated };
      syncToCloud(nextLogs);
      return nextLogs;
    });
  };

  // Date Navigation
  const goToNextDay = () => setCurrentDate(prev => addDaysToDate(prev, 1));
  const goToPrevDay = () => setCurrentDate(prev => addDaysToDate(prev, -1));
  const goToToday = () => setCurrentDate(getFormattedDateString());

  // Day Type Toggle ('non-chicken' | 'chicken')
  const setDayType = (dayType) => {
    updateCurrentDailyLog(log => ({ ...log, dayType }));
    showToast(`Switched to ${dayType === 'chicken' ? 'Chicken Day 🍗' : 'Non-Chicken Day 🥚'}`, 'success');
  };

  // Chicken Portion Selection (150, 175, 200g)
  const setChickenQty = (qty) => {
    updateCurrentDailyLog(log => ({ ...log, chickenQuantity: qty }));
    showToast(`Set chicken portion to ${qty}g`, 'info');
  };

  // Curry Portion Selection (50, 60, 70g)
  const setCurryQty = (mealType, qty) => {
    updateCurrentDailyLog(log => {
      if (mealType === 'lunch') return { ...log, curryQuantityLunch: qty };
      if (mealType === 'dinner') return { ...log, curryQuantityDinner: qty };
      return log;
    });
  };

  // Log Meal Action
  const logMeal = (mealType) => {
    const currentLog = getCurrentDailyLog();
    const existingMeal = currentLog.meals[mealType] || {};

    let itemsToLog = existingMeal.items || [];
    if (itemsToLog.length === 0) {
      itemsToLog = getPlannedMealItems(
        currentLog.dayType,
        mealType,
        currentLog.chickenQuantity || 175,
        currentLog.curryQuantityLunch || 60,
        currentLog.curryQuantityDinner || 60,
        mealTemplates
      );
    }

    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    updateCurrentDailyLog(log => ({
      ...log,
      meals: {
        ...log.meals,
        [mealType]: {
          isLogged: true,
          loggedAt: nowStr,
          items: itemsToLog
        }
      }
    }));

    showToast(`${mealType.charAt(0).toUpperCase() + mealType.slice(1)} logged successfully! ✅`, 'success');
  };

  // Undo Meal Action
  const undoMeal = (mealType) => {
    updateCurrentDailyLog(log => ({
      ...log,
      meals: {
        ...log.meals,
        [mealType]: {
          ...log.meals[mealType],
          isLogged: false
        }
      }
    }));
    showToast(`Unlogged ${mealType}`, 'info');
  };

  // Helper to get effective meal items for mutation
  const getEffectiveMealItems = (log, mealType) => {
    const meal = log.meals?.[mealType];
    if (meal?.items && meal.items.length > 0) {
      return meal.items;
    }
    return getPlannedMealItems(
      log.dayType,
      mealType,
      log.chickenQuantity || 175,
      log.curryQuantityLunch || 60,
      log.curryQuantityDinner || 60,
      mealTemplates
    );
  };

  // Add Food to Meal
  const addFoodToMeal = (mealType, foodId, quantity, unit) => {
    const food = getFoodById(foods, foodId);
    if (!food) return;

    const newItem = { foodId, quantity: Number(quantity), unit: unit || food.servingUnit };

    updateCurrentDailyLog(log => {
      const meal = log.meals?.[mealType] || { isLogged: false, items: [] };
      const currentItems = getEffectiveMealItems(log, mealType);
      const updatedItems = [...currentItems, newItem];

      return {
        ...log,
        meals: {
          ...log.meals,
          [mealType]: { ...meal, items: updatedItems }
        }
      };
    });

    showToast(`Added ${food.name} (${quantity}${newItem.unit}) to ${mealType}`, 'success');
  };

  // Edit Food Quantity in Meal
  const updateFoodInMeal = (mealType, itemIndex, newQuantity, newUnit) => {
    updateCurrentDailyLog(log => {
      const meal = log.meals?.[mealType] || { isLogged: false, items: [] };
      const currentItems = getEffectiveMealItems(log, mealType);
      const updatedItems = [...currentItems];

      if (updatedItems[itemIndex]) {
        updatedItems[itemIndex] = {
          ...updatedItems[itemIndex],
          quantity: Number(newQuantity),
          unit: newUnit || updatedItems[itemIndex].unit
        };
      }

      return {
        ...log,
        meals: {
          ...log.meals,
          [mealType]: { ...meal, items: updatedItems }
        }
      };
    });
    showToast(`Updated food quantity`, 'info');
  };

  // Remove Food from Meal
  const removeFoodFromMeal = (mealType, itemIndex) => {
    updateCurrentDailyLog(log => {
      const meal = log.meals?.[mealType] || { isLogged: false, items: [] };
      const currentItems = getEffectiveMealItems(log, mealType);
      const updatedItems = currentItems.filter((_, idx) => idx !== itemIndex);

      return {
        ...log,
        meals: {
          ...log.meals,
          [mealType]: { ...meal, items: updatedItems }
        }
      };
    });
    showToast(`Removed item from ${mealType}`, 'info');
  };

  // Save Current Meal Items as Default Template
  const saveMealAsDefault = (mealType) => {
    const currentLog = getCurrentDailyLog();
    const currentItems = currentLog.meals[mealType]?.items;
    if (!currentItems || currentItems.length === 0) return;

    setMealTemplatesState(prev => {
      const nextTemplates = {
        ...prev,
        [currentLog.dayType]: {
          ...prev[currentLog.dayType],
          [mealType]: currentItems
        }
      };
      syncToCloud(null, null, null, null, nextTemplates);
      return nextTemplates;
    });

    showToast(`Saved current ${mealType} as new default for ${currentLog.dayType === 'chicken' ? 'Chicken Day' : 'Non-Chicken Day'}!`, 'success');
  };

  // Supplement Logging - Whey
  const logWhey = (scoops = 1, forceExtra = false) => {
    const currentLog = getCurrentDailyLog();
    const isSnackLogged = currentLog.meals.snack?.isLogged;
    const snackHasWhey = currentLog.meals.snack?.items?.some(i => i.foodId === 'food_whey_leanfit');

    if (isSnackLogged && snackHasWhey && !forceExtra && !currentLog.supplements?.whey?.taken) {
      showToast(`Whey is already included in your logged Snack meal! Tap again if logging an extra scoop.`, 'warning');
    }

    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    updateCurrentDailyLog(log => ({
      ...log,
      supplements: {
        ...log.supplements,
        whey: {
          taken: true,
          scoops: scoops,
          explicitExtra: forceExtra,
          loggedAt: nowStr
        }
      }
    }));

    showToast(`Whey Protein (${scoops} scoop${scoops > 1 ? 's' : ''}) logged! 🥛`, 'success');
  };

  const undoWhey = () => {
    updateCurrentDailyLog(log => ({
      ...log,
      supplements: {
        ...log.supplements,
        whey: { taken: false, scoops: 1, explicitExtra: false, loggedAt: null }
      }
    }));
    showToast(`Whey log undone`, 'info');
  };

  // Supplement Logging - Creatine
  const logCreatine = (grams = 3) => {
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    updateCurrentDailyLog(log => ({
      ...log,
      supplements: {
        ...log.supplements,
        creatine: {
          taken: true,
          grams: grams,
          loggedAt: nowStr
        }
      }
    }));

    showToast(`Creatine (${grams}g) logged! ⚡`, 'success');
  };

  const undoCreatine = () => {
    updateCurrentDailyLog(log => ({
      ...log,
      supplements: {
        ...log.supplements,
        creatine: { taken: false, grams: 3, loggedAt: null }
      }
    }));
    showToast(`Creatine log undone`, 'info');
  };

  // Workout Logging
  const logWorkout = (workoutData) => {
    updateCurrentDailyLog(log => ({
      ...log,
      workout: {
        completed: workoutData.completed ?? true,
        name: workoutData.name || 'Workout',
        durationMinutes: workoutData.durationMinutes || 45,
        notes: workoutData.notes || '',
        exercises: workoutData.exercises || []
      }
    }));
    showToast(`Workout "${workoutData.name || 'Workout'}" saved! 💪`, 'success');
  };

  const undoWorkout = () => {
    updateCurrentDailyLog(log => ({
      ...log,
      workout: { completed: false, name: '', durationMinutes: 0, notes: '', exercises: [] }
    }));
    showToast(`Workout log cleared`, 'info');
  };

  // Weight Logging
  const logWeight = (weightKg) => {
    const val = Number(weightKg);
    if (!val || val <= 0) return;

    updateCurrentDailyLog(log => ({ ...log, weight: val }));

    setProfileState(prev => {
      const nextProfile = { ...prev, currentWeightKg: val };
      syncToCloud(null, nextProfile);
      return nextProfile;
    });
    showToast(`Weight recorded: ${val} kg ⚖️`, 'success');
  };

  // Custom Food CRUD
  const saveCustomFood = (foodData) => {
    const newFood = {
      id: foodData.id || `custom_food_${Date.now()}`,
      name: foodData.name,
      brand: foodData.brand || '',
      servingSize: Number(foodData.servingSize) || 100,
      servingUnit: foodData.servingUnit || 'g',
      calories: Number(foodData.calories) || 0,
      protein: Number(foodData.protein) || 0,
      carbs: Number(foodData.carbs) || 0,
      fat: Number(foodData.fat) || 0,
      fiber: Number(foodData.fiber) || 0,
      category: foodData.category || 'My Foods',
      isFavorite: Boolean(foodData.isFavorite),
      isCustom: true
    };

    setFoodsState(prev => {
      let updated;
      const existsIndex = prev.findIndex(f => f.id === newFood.id);
      if (existsIndex >= 0) {
        updated = [...prev];
        updated[existsIndex] = newFood;
      } else {
        updated = [...prev, newFood];
      }
      syncToCloud(null, null, null, updated);
      return updated;
    });

    showToast(`Custom food "${newFood.name}" saved! 🍎`, 'success');
    return newFood;
  };

  const toggleFavoriteFood = (foodId) => {
    setFoodsState(prev => {
      const updated = prev.map(f => f.id === foodId ? { ...f, isFavorite: !f.isFavorite } : f);
      syncToCloud(null, null, null, updated);
      return updated;
    });
  };

  const deleteFood = (foodId) => {
    setFoodsState(prev => {
      const updated = prev.filter(f => f.id !== foodId);
      syncToCloud(null, null, null, updated);
      return updated;
    });
    showToast(`Food deleted`, 'info');
  };

  // Profile & Target Updates
  const updateProfile = (newProfile) => {
    setProfileState(prev => {
      const updated = { ...prev, ...newProfile };
      syncToCloud(null, updated);
      return updated;
    });
    showToast(`Profile updated`, 'success');
  };

  const updateTargets = (newTargets) => {
    setTargetsState(prev => {
      const updated = { ...prev, ...newTargets };
      syncToCloud(null, null, updated);
      return updated;
    });
    showToast(`Nutrition targets updated`, 'success');
  };

  // Change Cloud Sync Code
  const updateSyncCode = (newCode) => {
    const cleanCode = newCode.toLowerCase().trim();
    if (!cleanCode) return;
    setSyncCode(cleanCode);
    showToast(`Cloud Sync Code updated to "${cleanCode}"!`, 'success');
  };

  const handleExport = () => {
    exportAllData();
    showToast(`Data exported as JSON file`, 'success');
  };

  const handleImport = (jsonData) => {
    try {
      importAllData(jsonData);
      const p = loadProfile();
      const t = loadTargets();
      const f = loadFoods();
      const m = loadMealTemplates();
      const d = loadDailyLogs();
      setProfileState(p);
      setTargetsState(t);
      setFoodsState(f);
      setMealTemplatesState(m);
      setDailyLogsState(d);
      syncToCloud(d, p, t, f, m);
      showToast(`Data restored successfully & synced!`, 'success');
    } catch (e) {
      showToast(`Error restoring backup: ${e.message}`, 'warning');
    }
  };

  const handleReset = () => {
    resetAllData();
    const p = loadProfile();
    const t = loadTargets();
    const f = loadFoods();
    const m = loadMealTemplates();
    const d = loadDailyLogs();
    setProfileState(p);
    setTargetsState(t);
    setFoodsState(f);
    setMealTemplatesState(m);
    setDailyLogsState(d);
    syncToCloud(d, p, t, f, m);
    showToast(`All data reset to initial defaults`, 'info');
  };

  const value = {
    currentDate,
    setCurrentDate,
    goToNextDay,
    goToPrevDay,
    goToToday,
    profile,
    updateProfile,
    targets,
    updateTargets,
    foods,
    saveCustomFood,
    toggleFavoriteFood,
    deleteFood,
    mealTemplates,
    dailyLogs,
    currentLog: getCurrentDailyLog(),
    setDayType,
    setChickenQty,
    setCurryQty,
    logMeal,
    undoMeal,
    addFoodToMeal,
    updateFoodInMeal,
    removeFoodFromMeal,
    saveMealAsDefault,
    logWhey,
    undoWhey,
    logCreatine,
    undoCreatine,
    logWorkout,
    undoWorkout,
    logWeight,
    syncCode,
    updateSyncCode,
    isCloudConnected,
    lastSyncTime,
    syncToCloud,
    handleExport,
    handleImport,
    handleReset,
    theme,
    setTheme,
    toggleTheme,
    toastMessage,
    showToast
  };

  return (
    <TrackcalContext.Provider value={value}>
      {children}
    </TrackcalContext.Provider>
  );
}

export function useTrackcal() {
  const context = useContext(TrackcalContext);
  if (!context) {
    throw new Error('useTrackcal must be used within a TrackcalProvider');
  }
  return context;
}

// Backward-compatible exports
export const BulkTrackProvider = TrackcalProvider;
export const useBulkTrack = useTrackcal;
export default TrackcalProvider;
