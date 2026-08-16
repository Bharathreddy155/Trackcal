// src/services/nutritionEngine.js
import { INITIAL_FOODS, DEFAULT_MEAL_TEMPLATES } from '../data/initialData';

/**
 * Calculates nutrition facts for a specific food item quantity
 */
export function calculateFoodItemNutrition(food, quantity, unit = null) {
  if (!food || !quantity || quantity <= 0) {
    return { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
  }

  // Base serving conversion factor
  const baseRatio = quantity / (food.servingSize || 1);

  return {
    calories: Math.round(food.calories * baseRatio),
    protein: Number((food.protein * baseRatio).toFixed(1)),
    carbs: Number((food.carbs * baseRatio).toFixed(1)),
    fat: Number((food.fat * baseRatio).toFixed(1)),
    fiber: Number((food.fiber * baseRatio).toFixed(1))
  };
}

/**
 * Gets food item object by ID from food database
 */
export function getFoodById(foods, id) {
  return foods.find(f => f.id === id) || INITIAL_FOODS.find(f => f.id === id);
}

/**
 * Calculates aggregate nutrition for an array of meal items:
 * item = { foodId, quantity, unit, customNutrition }
 */
export function calculateMealNutrition(items, foodsDatabase = INITIAL_FOODS) {
  let totals = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };

  if (!items || !Array.isArray(items)) return totals;

  for (const item of items) {
    const food = getFoodById(foodsDatabase, item.foodId);
    if (!food) continue;

    const itemNutr = calculateFoodItemNutrition(food, item.quantity, item.unit);
    totals.calories += itemNutr.calories;
    totals.protein += itemNutr.protein;
    totals.carbs += itemNutr.carbs;
    totals.fat += itemNutr.fat;
    totals.fiber += itemNutr.fiber;
  }

  // Round totals cleanly
  totals.protein = Number(totals.protein.toFixed(1));
  totals.carbs = Number(totals.carbs.toFixed(1));
  totals.fat = Number(totals.fat.toFixed(1));
  totals.fiber = Number(totals.fiber.toFixed(1));

  return totals;
}

/**
 * Generates the list of planned meal items based on Day Type (Chicken vs Non-Chicken),
 * Chicken quantity (150/175/200g), and Curry quantity (50/60/70g).
 */
export function getPlannedMealItems(
  dayType = 'non-chicken',
  mealType = 'breakfast',
  chickenQty = 175,
  curryQtyLunch = 60,
  curryQtyDinner = 60,
  userTemplates = null
) {
  const templates = userTemplates || DEFAULT_MEAL_TEMPLATES;
  const baseItems = templates[dayType]?.[mealType] || DEFAULT_MEAL_TEMPLATES.nonChicken[mealType] || [];

  return baseItems.map(item => {
    // Dynamically adjust chicken quantity on Chicken Day
    if (dayType === 'chicken' && item.foodId === 'food_cooked_chicken') {
      return { ...item, quantity: chickenQty };
    }
    // Dynamically adjust curry quantities
    if (item.foodId === 'food_homemade_curry') {
      const qty = mealType === 'lunch' ? curryQtyLunch : mealType === 'dinner' ? curryQtyDinner : item.quantity;
      return { ...item, quantity: qty };
    }
    return { ...item };
  });
}

/**
 * Calculates daily consumed totals from a daily log.
 * Checks for Whey double-counting!
 */
export function calculateDailyTotals(dailyLog, foodsDatabase = INITIAL_FOODS) {
  let totals = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
  if (!dailyLog || !dailyLog.meals) return totals;

  const mealTypes = ['breakfast', 'lunch', 'snack', 'dinner'];

  // Check if Whey is logged inside the Snack meal
  let wheyInSnackLogged = false;
  if (dailyLog.meals.snack?.isLogged && dailyLog.meals.snack?.items) {
    wheyInSnackLogged = dailyLog.meals.snack.items.some(i => i.foodId === 'food_whey_leanfit');
  }

  // 1. Add up logged meals
  for (const type of mealTypes) {
    const meal = dailyLog.meals[type];
    if (meal && meal.isLogged && meal.items) {
      const mealNutr = calculateMealNutrition(meal.items, foodsDatabase);
      totals.calories += mealNutr.calories;
      totals.protein += mealNutr.protein;
      totals.carbs += mealNutr.carbs;
      totals.fat += mealNutr.fat;
      totals.fiber += mealNutr.fiber;
    }
  }

  // 2. Add Whey supplement if logged via direct supplement button AND NOT already in logged Snack!
  const wheySupp = dailyLog.supplements?.whey;
  if (wheySupp && wheySupp.taken && wheySupp.scoops > 0) {
    if (!wheyInSnackLogged || wheySupp.explicitExtra) {
      const wheyFood = getFoodById(foodsDatabase, 'food_whey_leanfit');
      if (wheyFood) {
        const wheyNutr = calculateFoodItemNutrition(wheyFood, wheySupp.scoops, 'scoop');
        totals.calories += wheyNutr.calories;
        totals.protein += wheyNutr.protein;
        totals.carbs += wheyNutr.carbs;
        totals.fat += wheyNutr.fat;
        totals.fiber += wheyNutr.fiber;
      }
    }
  }

  totals.protein = Number(totals.protein.toFixed(1));
  totals.carbs = Number(totals.carbs.toFixed(1));
  totals.fat = Number(totals.fat.toFixed(1));
  totals.fiber = Number(totals.fiber.toFixed(1));

  return totals;
}
