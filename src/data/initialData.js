// src/data/initialData.js

export const DEFAULT_PROFILE = {
  name: 'Bharath',
  age: 20,
  heightCm: 179,
  currentWeightKg: 57.5,
  goalWeightKg: 70.0,
  bodyFatPercentage: 18.0,
  workoutDaysPerWeek: 4,
  goal: 'Bulking / gradual weight gain'
};

export const DEFAULT_TARGETS = {
  calories: 2815, // range 2800 - 2850 (~2,825 kcal planned)
  caloriesMin: 2800,
  caloriesMax: 2850,
  protein: 105,   // target 100 - 110 (~137g actual whole food + whey)
  proteinMin: 100,
  proteinMax: 140,
  carbs: 415,     // ~400+ g (~415g planned)
  carbsMin: 400,
  carbsMax: 430,
  fat: 73,        // range 70 - 80 (~73g planned)
  fatMin: 70,
  fatMax: 80,
  fiber: 35,      // range 30 - 35 (~40g planned)
  fiberMin: 30,
  fiberMax: 45
};

export const INITIAL_FOODS = [
  {
    id: 'food_yogabar_oats',
    name: 'YogaBar 26g High Protein Oats - Dark Chocolate',
    brand: 'YogaBar',
    servingSize: 75,
    servingUnit: 'g',
    calories: 270,
    protein: 19.5,
    carbs: 39.0,
    fat: 5.7,
    fiber: 8.3,
    category: 'Fixed',
    isFavorite: true,
    isCustom: false
  },
  {
    id: 'food_buffalo_milk',
    name: 'Buffalo Milk',
    brand: 'Fresh',
    servingSize: 200,
    servingUnit: 'ml',
    calories: 180,
    protein: 6.5,
    carbs: 10.0,
    fat: 12.0,
    fiber: 0.0,
    category: 'Fixed',
    isFavorite: true,
    isCustom: false
  },
  {
    id: 'food_banana',
    name: 'Banana',
    brand: '',
    servingSize: 1,
    servingUnit: 'piece',
    calories: 105,
    protein: 1.3,
    carbs: 27.0,
    fat: 0.3,
    fiber: 3.1,
    category: 'Fixed',
    isFavorite: true,
    isCustom: false
  },
  {
    id: 'food_chia_seeds',
    name: 'Chia Seeds',
    brand: '',
    servingSize: 5,
    servingUnit: 'g',
    calories: 24,
    protein: 0.8,
    carbs: 2.1,
    fat: 1.6,
    fiber: 1.7,
    category: 'Fixed',
    isFavorite: false,
    isCustom: false
  },
  {
    id: 'food_pumpkin_seeds',
    name: 'Pumpkin Seeds',
    brand: '',
    servingSize: 10,
    servingUnit: 'g',
    calories: 56,
    protein: 3.0,
    carbs: 1.5,
    fat: 4.9,
    fiber: 0.6,
    category: 'Fixed',
    isFavorite: false,
    isCustom: false
  },
  {
    id: 'food_honey',
    name: 'Honey',
    brand: '',
    servingSize: 7,
    servingUnit: 'g',
    calories: 21,
    protein: 0.0,
    carbs: 5.7,
    fat: 0.0,
    fiber: 0.0,
    category: 'Fixed',
    isFavorite: false,
    isCustom: false
  },
  {
    id: 'food_cooked_rice',
    name: 'Cooked White Rice',
    brand: '',
    servingSize: 100,
    servingUnit: 'g',
    calories: 130,
    protein: 2.69,
    carbs: 28.23,
    fat: 0.29,
    fiber: 0.4,
    category: 'Fixed',
    isFavorite: true,
    isCustom: false
  },
  {
    id: 'food_egg',
    name: 'Whole Egg',
    brand: '',
    servingSize: 1,
    servingUnit: 'piece',
    calories: 72,
    protein: 6.3,
    carbs: 0.4,
    fat: 4.8,
    fiber: 0.0,
    category: 'Fixed',
    isFavorite: true,
    isCustom: false
  },
  {
    id: 'food_sweet_potato',
    name: 'Sweet Potato (Cooked)',
    brand: '',
    servingSize: 200,
    servingUnit: 'g',
    calories: 172,
    protein: 3.2,
    carbs: 40.0,
    fat: 0.2,
    fiber: 6.0,
    category: 'Fixed',
    isFavorite: true,
    isCustom: false
  },
  {
    id: 'food_carrot_cucumber',
    name: 'Carrot + Cucumber Salad',
    brand: '',
    servingSize: 100,
    servingUnit: 'g',
    calories: 35,
    protein: 1.0,
    carbs: 7.0,
    fat: 0.2,
    fiber: 2.5,
    category: 'Fixed',
    isFavorite: false,
    isCustom: false
  },
  {
    id: 'food_homemade_curry',
    name: 'Homemade Curry',
    brand: 'Homemade',
    servingSize: 60,
    servingUnit: 'g',
    calories: 42,
    protein: 1.2,
    carbs: 5.0,
    fat: 1.8,
    fiber: 1.2,
    category: 'Fixed',
    isFavorite: true,
    isCustom: false
  },
  {
    id: 'food_whey_leanfit',
    name: 'LeanFit Chocolate Whey Protein',
    brand: 'LeanFit',
    servingSize: 1,
    servingUnit: 'scoop',
    calories: 140,
    protein: 24.0,
    carbs: 3.0,
    fat: 3.5,
    fiber: 0.0,
    bcaaGrams: 4.8,
    category: 'Supplement',
    isFavorite: true,
    isCustom: false
  },
  {
    id: 'food_bread',
    name: 'Whole Wheat Bread',
    brand: 'Standard',
    servingSize: 1,
    servingUnit: 'slice',
    calories: 70,
    protein: 3.0,
    carbs: 13.0,
    fat: 1.0,
    fiber: 1.0,
    category: 'Fixed',
    isFavorite: true,
    isCustom: false
  },
  {
    id: 'food_myfitness_pb',
    name: 'MyFitness Crunchy Peanut Butter',
    brand: 'MyFitness',
    servingSize: 25,
    servingUnit: 'g',
    calories: 156,
    protein: 6.5,
    carbs: 4.8,
    fat: 12.5,
    fiber: 2.0,
    category: 'Fixed',
    isFavorite: true,
    isCustom: false
  },
  {
    id: 'food_amul_rose_lassi',
    name: 'Amul High Protein Rose Lassi',
    brand: 'Amul',
    servingSize: 200,
    servingUnit: 'ml',
    calories: 107,
    protein: 15.0,
    carbs: 12.0,
    fat: 1.7,
    fiber: 0.0,
    category: 'Fixed',
    isFavorite: true,
    isCustom: false
  },
  {
    id: 'food_cooked_chicken',
    name: 'Cooked Chicken Breast',
    brand: '',
    servingSize: 100,
    servingUnit: 'g',
    calories: 165,
    protein: 31.0,
    carbs: 0.0,
    fat: 3.6,
    fiber: 0.0,
    category: 'Fixed',
    isFavorite: true,
    isCustom: false
  }
];

// Fixed Meal Templates for Non-Chicken vs Chicken Day
export const DEFAULT_MEAL_TEMPLATES = {
  nonChicken: {
    breakfast: [
      { foodId: 'food_yogabar_oats', quantity: 75, unit: 'g' },
      { foodId: 'food_buffalo_milk', quantity: 200, unit: 'ml' },
      { foodId: 'food_banana', quantity: 2, unit: 'piece' },
      { foodId: 'food_chia_seeds', quantity: 5, unit: 'g' },
      { foodId: 'food_pumpkin_seeds', quantity: 10, unit: 'g' },
      { foodId: 'food_honey', quantity: 7, unit: 'g' }
    ],
    lunch: [
      { foodId: 'food_cooked_rice', quantity: 350, unit: 'g' },
      { foodId: 'food_egg', quantity: 2, unit: 'piece' },
      { foodId: 'food_amul_rose_lassi', quantity: 200, unit: 'ml' },
      { foodId: 'food_carrot_cucumber', quantity: 100, unit: 'g' },
      { foodId: 'food_homemade_curry', quantity: 60, unit: 'g' }
    ],
    snack: [
      { foodId: 'food_whey_leanfit', quantity: 1, unit: 'scoop' },
      { foodId: 'food_bread', quantity: 3, unit: 'slice' },
      { foodId: 'food_myfitness_pb', quantity: 25, unit: 'g' },
      { foodId: 'food_chia_seeds', quantity: 5, unit: 'g' },
      { foodId: 'food_sweet_potato', quantity: 200, unit: 'g' }
    ],
    dinner: [
      { foodId: 'food_cooked_rice', quantity: 275, unit: 'g' },
      { foodId: 'food_egg', quantity: 2, unit: 'piece' },
      { foodId: 'food_carrot_cucumber', quantity: 100, unit: 'g' },
      { foodId: 'food_homemade_curry', quantity: 60, unit: 'g' }
    ]
  },
  chicken: {
    breakfast: [
      { foodId: 'food_yogabar_oats', quantity: 75, unit: 'g' },
      { foodId: 'food_buffalo_milk', quantity: 200, unit: 'ml' },
      { foodId: 'food_banana', quantity: 2, unit: 'piece' },
      { foodId: 'food_chia_seeds', quantity: 5, unit: 'g' },
      { foodId: 'food_pumpkin_seeds', quantity: 10, unit: 'g' },
      { foodId: 'food_honey', quantity: 7, unit: 'g' }
    ],
    lunch: [
      { foodId: 'food_cooked_rice', quantity: 350, unit: 'g' },
      { foodId: 'food_cooked_chicken', quantity: 175, unit: 'g' },
      { foodId: 'food_amul_rose_lassi', quantity: 200, unit: 'ml' },
      { foodId: 'food_carrot_cucumber', quantity: 100, unit: 'g' },
      { foodId: 'food_homemade_curry', quantity: 60, unit: 'g' }
    ],
    snack: [
      { foodId: 'food_whey_leanfit', quantity: 1, unit: 'scoop' },
      { foodId: 'food_bread', quantity: 3, unit: 'slice' },
      { foodId: 'food_myfitness_pb', quantity: 25, unit: 'g' },
      { foodId: 'food_chia_seeds', quantity: 5, unit: 'g' },
      { foodId: 'food_sweet_potato', quantity: 200, unit: 'g' }
    ],
    dinner: [
      { foodId: 'food_cooked_rice', quantity: 275, unit: 'g' },
      { foodId: 'food_cooked_chicken', quantity: 175, unit: 'g' },
      { foodId: 'food_carrot_cucumber', quantity: 100, unit: 'g' },
      { foodId: 'food_homemade_curry', quantity: 60, unit: 'g' }
    ]
  }
};
