// bot/services/commandHandler.js
import { updateTodayLog, getTrackcalData, getTodayDateStr } from './firebaseService.js';

/**
 * Calculates consumed macros from daily log
 */
function calculateMacros(log, foodsList) {
  const foodsMap = {};
  if (Array.isArray(foodsList)) {
    foodsList.forEach(f => { foodsMap[f.id] = f; });
  }

  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;

  if (log?.meals) {
    for (const mealKey of ['breakfast', 'lunch', 'snack', 'dinner']) {
      const meal = log.meals[mealKey];
      if (meal?.isLogged && Array.isArray(meal.items)) {
        meal.items.forEach(item => {
          const food = foodsMap[item.foodId];
          if (food) {
            const factor = (Number(item.quantity) || 100) / (Number(food.servingSize) || 100);
            totalCalories += Math.round((food.calories || 0) * factor);
            totalProtein += Number(((food.protein || 0) * factor).toFixed(1));
            totalCarbs += Number(((food.carbs || 0) * factor).toFixed(1));
            totalFat += Number(((food.fat || 0) * factor).toFixed(1));
          }
        });
      }
    }
  }

  // Supplement Whey (LeanFit 1 scoop = 140 kcal, 24g protein)
  if (log?.supplements?.whey?.taken) {
    const scoops = log.supplements.whey.scoops || 1;
    totalCalories += 140 * scoops;
    totalProtein += 24 * scoops;
    totalCarbs += 3 * scoops;
    totalFat += 3.5 * scoops;
  }

  return {
    calories: Math.round(totalCalories),
    protein: Number(totalProtein.toFixed(1)),
    carbs: Number(totalCarbs.toFixed(1)),
    fat: Number(totalFat.toFixed(1))
  };
}

/**
 * Handles incoming WhatsApp message and returns bot response string (or null if not a recognized command)
 */
export async function handleWhatsAppMessage(bodyText, syncCode) {
  const text = (bodyText || '').trim().toLowerCase();
  const todayStr = getTodayDateStr();

  // 1. HELP / MENU / HI / START
  if (text === 'help' || text === 'menu' || text === 'start' || text === 'commands' || text === 'trackcal' || text === 'hi' || text === 'hello') {
    return (
      `🤖 *Trackcal WhatsApp Assistant*\n\n` +
      `Here is what you can text me:\n\n` +
      `📊 *status* or *today* — View today's calories & macros\n` +
      `⚡ *creatine* — Log 3g Creatine\n` +
      `🥛 *whey* (or *whey 2*) — Log Whey Protein\n` +
      `⚖️ *weight 58.2* — Log today's weight\n` +
      `🍳 *log breakfast* — Mark breakfast as logged\n` +
      `🍗 *log lunch* — Mark lunch as logged\n` +
      `🥪 *log snack* — Mark snack as logged\n` +
      `🍛 *log dinner* — Mark dinner as logged\n` +
      `💪 *workout* — Log today's workout completed`
    );
  }

  // 2. LOG CREATINE
  if (text.includes('creatine')) {
    const res = await updateTodayLog(syncCode, (log) => {
      log.supplements = log.supplements || {};
      log.supplements.creatine = {
        taken: true,
        grams: 3,
        loggedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      return log;
    });

    if (res.success) {
      return `⚡ *Creatine Logged!* (3g)\nGreat job staying consistent with your daily creatine, Bharath! 🚀`;
    }
    return `⚠️ Could not update Creatine in cloud. Please check cloud connection.`;
  }

  // 3. LOG WHEY
  if (text.includes('whey')) {
    const scoopsMatch = text.match(/(\d+(\.\d+)?)\s*(scoop|scoops)/) || text.match(/whey\s*(\d+(\.\d+)?)/);
    const scoops = scoopsMatch ? parseFloat(scoopsMatch[1]) : 1;

    const res = await updateTodayLog(syncCode, (log) => {
      log.supplements = log.supplements || {};
      log.supplements.whey = {
        taken: true,
        scoops: scoops,
        loggedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      return log;
    });

    if (res.success) {
      return `🥛 *Whey Protein Logged!* (${scoops} scoop${scoops > 1 ? 's' : ''})\n+${26 * scoops}g Protein added to your daily total! 💪`;
    }
    return `⚠️ Could not update Whey in cloud.`;
  }

  // 4. LOG WEIGHT
  if (text.startsWith('weight') || text.includes('kg') || (text.match(/^\d+(\.\d+)?$/) && parseFloat(text) >= 40 && parseFloat(text) <= 120)) {
    const numMatch = text.match(/(\d+(\.\d+)?)/);
    if (numMatch) {
      const weightVal = parseFloat(numMatch[1]);
      if (weightVal >= 30 && weightVal <= 150) {
        const res = await updateTodayLog(syncCode, (log, data) => {
          log.weight = weightVal;
          if (data.profile) {
            data.profile.currentWeightKg = weightVal;
          }
          return log;
        });

        if (res.success) {
          const remaining = (70.0 - weightVal).toFixed(1);
          return `⚖️ *Weight Recorded:* *${weightVal} kg*\n🎯 Goal: 70.0 kg (${remaining > 0 ? `${remaining} kg to gain` : 'Goal Reached! 🎉'})`;
        }
      }
    }
  }

  // 5. LOG MEALS (breakfast, lunch, snack, dinner)
  if (text.startsWith('log ') || text.startsWith('eaten ') || text.startsWith('ate ') || text === 'breakfast' || text === 'lunch' || text === 'dinner' || text === 'snack') {
    let mealType = null;
    if (text.includes('breakfast')) mealType = 'breakfast';
    else if (text.includes('lunch')) mealType = 'lunch';
    else if (text.includes('snack')) mealType = 'snack';
    else if (text.includes('dinner')) mealType = 'dinner';

    if (mealType) {
      const res = await updateTodayLog(syncCode, (log, data) => {
        log.meals = log.meals || {};
        const existing = log.meals[mealType] || {};
        log.meals[mealType] = {
          ...existing,
          isLogged: true,
          loggedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        return log;
      });

      if (res.success) {
        const mealName = mealType.charAt(0).toUpperCase() + mealType.slice(1);
        return `✅ *${mealName} Logged Successfully!*\nYour dashboard has been updated.`;
      }
    }
  }

  // 6. LOG WORKOUT
  if (text.includes('workout') || text.includes('gym')) {
    const res = await updateTodayLog(syncCode, (log) => {
      log.workout = {
        completed: true,
        name: 'Workout Session',
        durationMinutes: 50,
        notes: 'Logged via WhatsApp',
        exercises: log.workout?.exercises || []
      };
      return log;
    });

    if (res.success) {
      return `💪 *Workout Completed!* (50 mins)\nAwesome session logged for today, Bharath! 🔥`;
    }
  }

  // 7. STATUS / TODAY / SUMMARY
  if (text === 'status' || text === 'today' || text === 'summary' || text === 'report') {
    const data = await getTrackcalData(syncCode);
    const todayLog = data?.dailyLogs?.[todayStr] || {};
    const targets = data?.targets || { calories: 2815, protein: 105, carbs: 415, fat: 73, fiber: 35 };
    const macros = calculateMacros(todayLog, data?.foods);

    const caloriesLeft = Math.max(0, targets.calories - macros.calories);
    const proteinLeft = Math.max(0, targets.protein - macros.protein);

    const creatineStatus = todayLog?.supplements?.creatine?.taken ? '✅ Taken (3g)' : '❌ Not taken';
    const wheyStatus = todayLog?.supplements?.whey?.taken ? `✅ Taken (${todayLog.supplements.whey.scoops || 1} scoop)` : '❌ Not taken';
    const workoutStatus = todayLog?.workout?.completed ? '✅ Completed' : '❌ Not yet';

    return (
      `📊 *Trackcal Daily Status (${todayStr})*\n\n` +
      `🔥 *Calories:* ${macros.calories} / ${targets.calories} kcal (${caloriesLeft} kcal left)\n` +
      `🥩 *Protein:* ${macros.protein}g / ${targets.protein}g (${proteinLeft}g left)\n` +
      `🍞 *Carbs:* ${macros.carbs}g / ${targets.carbs}g\n` +
      `🥑 *Fat:* ${macros.fat}g / ${targets.fat}g\n\n` +
      `⚡ *Creatine:* ${creatineStatus}\n` +
      `🥛 *Whey:* ${wheyStatus}\n` +
      `💪 *Workout:* ${workoutStatus}\n` +
      `⚖️ *Weight:* ${todayLog?.weight ? `${todayLog.weight} kg` : 'Not recorded'}\n\n` +
      `_Reply "help" for quick logging commands._`
    );
  }

  // If text is not a command, do not respond (return null)
  return null;
}
