// src/context/BulkTrackContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
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

const BulkTrackContext = createContext();

export function BulkTrackProvider({ children }) {
  const [currentDate, setCurrentDate] = useState(getFormattedDateString());
  const [profile, setProfileState] = useState(loadProfile);
  const [targets, setTargetsState] = useState(loadTargets);
  const [foods, setFoodsState] = useState(loadFoods);
  const [mealTemplates, setMealTemplatesState] = useState(loadMealTemplates);
  const [dailyLogs, setDailyLogsState] = useState(loadDailyLogs);
  const [toastMessage, setToastMessage] = useState(null);

  // Sync to LocalStorage on changes
  useEffect(() => saveProfile(profile), [profile]);
  useEffect(() => saveTargets(targets), [targets]);
  useEffect(() => saveFoods(foods), [foods]);
  useEffect(() => saveMealTemplates(mealTemplates), [mealTemplates]);
  useEffect(() => saveDailyLogs(dailyLogs), [dailyLogs]);

  // Toast Helper
  const showToast = (message, type = 'info') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => setToastMessage(null), 3500);
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
      return { ...prev, [currentDate]: updated };
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

  // Log Meal Action (populates fixed foods if list is empty)
  const logMeal = (mealType) => {
    const currentLog = getCurrentDailyLog();
    const existingMeal = currentLog.meals[mealType] || {};

    let itemsToLog = existingMeal.items || [];
    // If meal has no items yet, load default planned template items
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

  // Add Food to Meal
  const addFoodToMeal = (mealType, foodId, quantity, unit) => {
    const food = getFoodById(foods, foodId);
    if (!food) return;

    const newItem = { foodId, quantity: Number(quantity), unit: unit || food.servingUnit };

    updateCurrentDailyLog(log => {
      const meal = log.meals[mealType] || { isLogged: false, items: [] };
      const currentItems = meal.items || [];
      const updatedItems = [...currentItems, newItem];

      return {
        ...log,
        meals: {
          ...log.meals,
          [mealType]: {
            ...meal,
            // If adding food to a non-logged meal, keep items ready
            items: updatedItems
          }
        }
      };
    });

    showToast(`Added ${food.name} (${quantity}${newItem.unit}) to ${mealType}`, 'success');
  };

  // Edit Food Quantity in Meal
  const updateFoodInMeal = (mealType, itemIndex, newQuantity, newUnit) => {
    updateCurrentDailyLog(log => {
      const meal = log.meals[mealType];
      if (!meal || !meal.items) return log;

      const updatedItems = [...meal.items];
      updatedItems[itemIndex] = {
        ...updatedItems[itemIndex],
        quantity: Number(newQuantity),
        unit: newUnit || updatedItems[itemIndex].unit
      };

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
      const meal = log.meals[mealType];
      if (!meal || !meal.items) return log;

      const updatedItems = meal.items.filter((_, idx) => idx !== itemIndex);

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

    setMealTemplatesState(prev => ({
      ...prev,
      [currentLog.dayType]: {
        ...prev[currentLog.dayType],
        [mealType]: currentItems
      }
    }));

    showToast(`Saved current ${mealType} as new default for ${currentLog.dayType === 'chicken' ? 'Chicken Day' : 'Non-Chicken Day'}!`, 'success');
  };

  // Supplement Logging - Whey with Double-Counting Check!
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

    // Also update profile current weight
    setProfileState(prev => ({ ...prev, currentWeightKg: val }));
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
      const existsIndex = prev.findIndex(f => f.id === newFood.id);
      if (existsIndex >= 0) {
        const updated = [...prev];
        updated[existsIndex] = newFood;
        return updated;
      }
      return [...prev, newFood];
    });

    showToast(`Custom food "${newFood.name}" saved! 🍎`, 'success');
    return newFood;
  };

  const toggleFavoriteFood = (foodId) => {
    setFoodsState(prev => prev.map(f => f.id === foodId ? { ...f, isFavorite: !f.isFavorite } : f));
  };

  const deleteFood = (foodId) => {
    setFoodsState(prev => prev.filter(f => f.id !== foodId));
    showToast(`Food deleted`, 'info');
  };

  // Profile & Target Updates
  const updateProfile = (newProfile) => {
    setProfileState(prev => ({ ...prev, ...newProfile }));
    showToast(`Profile updated`, 'success');
  };

  const updateTargets = (newTargets) => {
    setTargetsState(prev => ({ ...prev, ...newTargets }));
    showToast(`Nutrition targets updated`, 'success');
  };

  // Data Reset & Backup
  const handleExport = () => {
    exportAllData();
    showToast(`Data exported as JSON file`, 'success');
  };

  const handleImport = (jsonData) => {
    try {
      importAllData(jsonData);
      setProfileState(loadProfile());
      setTargetsState(loadTargets());
      setFoodsState(loadFoods());
      setMealTemplatesState(loadMealTemplates());
      setDailyLogsState(loadDailyLogs());
      showToast(`Data restored successfully!`, 'success');
    } catch (e) {
      showToast(`Error restoring backup: ${e.message}`, 'warning');
    }
  };

  const handleReset = () => {
    resetAllData();
    setProfileState(loadProfile());
    setTargetsState(loadTargets());
    setFoodsState(loadFoods());
    setMealTemplatesState(loadMealTemplates());
    setDailyLogsState(loadDailyLogs());
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
    handleExport,
    handleImport,
    handleReset,
    toastMessage,
    showToast
  };

  return (
    <BulkTrackContext.Provider value={value}>
      {children}
    </BulkTrackContext.Provider>
  );
}

export function useBulkTrack() {
  const context = useContext(BulkTrackContext);
  if (!context) {
    throw new Error('useBulkTrack must be used within a BulkTrackProvider');
  }
  return context;
}
