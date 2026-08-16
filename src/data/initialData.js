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
  calories: 2725, // range 2700 - 2750
  caloriesMin: 2700,
  caloriesMax: 2750,
  protein: 105,   // range 100 - 110
  proteinMin: 100,
  proteinMax: 110,
  carbs: 395,     // range 390 - 400
  carbsMin: 390,
  carbsMax: 400,
  fat: 77,        // range 75 - 80
  fatMin: 75,
  fatMax: 80,
  fiber: 33,      // range 30 - 35
  fiberMin: 30,
  fiberMax: 35
};

export const INITIAL_FOODS = [
  {
    id: 'food_yogabar_oats',
    name: 'YogaBar 26g High Protein Oats - Dark Chocolate',
    brand: 'YogaBar',
    servingSize: 75,
    servingUnit: 'g',
    calories: 310,
    protein: 19.5,
    carbs: 45.0,
    fat: 6.0,
    fiber: 6.0,
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
    calories: 214,
    protein: 8.6,
    carbs: 10.4,
    fat: 15.6,
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
    fat: 1.5,
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
    carbs: 1.1,
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
    servingSize: 10,
    servingUnit: 'g',
    calories: 30,
    protein: 0.0,
    carbs: 8.2,
    fat: 0.0,
    fiber: 0.0,
    category: 'Fixed',
    isFavorite: false,
    isCustom: false
  },
  {
    id: 'food_cooked_rice',
    name: 'Cooked Rice',
    brand: '',
    servingSize: 225,
    servingUnit: 'g',
    calories: 292,
    protein: 5.4,
    carbs: 63.0,
    fat: 0.7,
    fiber: 0.9,
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
    carbs: 40.2,
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
    servingSize: 125,
    servingUnit: 'g',
    calories: 25,
    protein: 0.8,
    carbs: 5.5,
    fat: 0.2,
    fiber: 2.2,
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
    calories: 75,
    protein: 1.5,
    carbs: 4.0,
    fat: 6.0,
    fiber: 1.0,
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
    servingSize: 2,
    servingUnit: 'slice',
    calories: 140,
    protein: 5.0,
    carbs: 26.0,
    fat: 1.8,
    fiber: 2.0,
    category: 'Fixed',
    isFavorite: true,
    isCustom: false
  },
  {
    id: 'food_groundnuts',
    name: 'Groundnuts (Peanuts)',
    brand: '',
    servingSize: 20,
    servingUnit: 'g',
    calories: 113,
    protein: 5.2,
    carbs: 3.2,
    fat: 9.8,
    fiber: 1.7,
    category: 'Fixed',
    isFavorite: false,
    isCustom: false
  },
  {
    id: 'food_pintola_pb',
    name: 'Pintola High Protein Dark Chocolate Peanut Butter',
    brand: 'Pintola',
    servingSize: 10,
    servingUnit: 'g',
    calories: 63,
    protein: 3.4,
    carbs: 2.3,
    fat: 4.5,
    fiber: 0.6,
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
  },
  {
    id: 'food_apple',
    name: 'Apple',
    brand: 'Local',
    servingSize: 150,
    servingUnit: 'g',
    calories: 78,
    protein: 0.4,
    carbs: 21.0,
    fat: 0.3,
    fiber: 3.6,
    category: 'Fruit',
    isFavorite: false,
    isCustom: true
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
      { foodId: 'food_honey', quantity: 10, unit: 'g' }
    ],
    lunch: [
      { foodId: 'food_cooked_rice', quantity: 225, unit: 'g' },
      { foodId: 'food_egg', quantity: 2, unit: 'piece' },
      { foodId: 'food_sweet_potato', quantity: 200, unit: 'g' },
      { foodId: 'food_carrot_cucumber', quantity: 125, unit: 'g' },
      { foodId: 'food_homemade_curry', quantity: 60, unit: 'g' }
    ],
    snack: [
      { foodId: 'food_whey_leanfit', quantity: 1, unit: 'scoop' },
      { foodId: 'food_bread', quantity: 2, unit: 'slice' },
      { foodId: 'food_groundnuts', quantity: 20, unit: 'g' },
      { foodId: 'food_pintola_pb', quantity: 10, unit: 'g' },
      { foodId: 'food_chia_seeds', quantity: 5, unit: 'g' }
    ],
    dinner: [
      { foodId: 'food_cooked_rice', quantity: 225, unit: 'g' },
      { foodId: 'food_egg', quantity: 2, unit: 'piece' },
      { foodId: 'food_sweet_potato', quantity: 200, unit: 'g' },
      { foodId: 'food_amul_rose_lassi', quantity: 200, unit: 'ml' },
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
      { foodId: 'food_honey', quantity: 10, unit: 'g' }
    ],
    lunch: [
      { foodId: 'food_cooked_rice', quantity: 225, unit: 'g' },
      { foodId: 'food_cooked_chicken', quantity: 175, unit: 'g' }, // Default 175g
      { foodId: 'food_sweet_potato', quantity: 200, unit: 'g' },
      { foodId: 'food_carrot_cucumber', quantity: 125, unit: 'g' },
      { foodId: 'food_homemade_curry', quantity: 60, unit: 'g' }
    ],
    snack: [
      { foodId: 'food_whey_leanfit', quantity: 1, unit: 'scoop' },
      { foodId: 'food_bread', quantity: 2, unit: 'slice' },
      { foodId: 'food_groundnuts', quantity: 20, unit: 'g' },
      { foodId: 'food_pintola_pb', quantity: 10, unit: 'g' },
      { foodId: 'food_chia_seeds', quantity: 5, unit: 'g' }
    ],
    dinner: [
      { foodId: 'food_cooked_rice', quantity: 225, unit: 'g' },
      { foodId: 'food_cooked_chicken', quantity: 175, unit: 'g' }, // Default 175g
      { foodId: 'food_sweet_potato', quantity: 200, unit: 'g' },
      { foodId: 'food_amul_rose_lassi', quantity: 200, unit: 'ml' },
      { foodId: 'food_homemade_curry', quantity: 60, unit: 'g' }
    ]
  }
};
