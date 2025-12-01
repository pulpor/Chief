import { MealDBRecipe, DrinkDBRecipe, Category } from '@/types/themealdb';

const MEAL_API_BASE = 'https://www.themealdb.com/api/json/v1/1';
const DRINK_API_BASE = 'https://www.thecocktaildb.com/api/json/v1/1';

// Meals API
export const getMealCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${MEAL_API_BASE}/categories.php`);
  const data = await response.json();
  return data.categories || [];
};

export const getMealsByCategory = async (category: string): Promise<MealDBRecipe[]> => {
  // Use multiple strategies to get more meals
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
  const allMeals: MealDBRecipe[] = [];
  const seenIds = new Set<string>();

  // Strategy 1: Search by first letter
  for (const letter of alphabet) {
    try {
      const response = await fetch(`${MEAL_API_BASE}/search.php?f=${letter}`);
      const data = await response.json();
      if (data.meals) {
        for (const meal of data.meals) {
          // Filter by category and avoid duplicates
          if (meal.strCategory === category && !seenIds.has(meal.idMeal)) {
            seenIds.add(meal.idMeal);
            allMeals.push(meal);
          }
        }
      }
    } catch (error) {
      console.warn(`Failed to fetch meals starting with ${letter}:`, error);
    }
  }

  return allMeals.filter((meal: any) => meal.strMealThumb && meal.strMeal);
};

export const getAllMeals = async (): Promise<MealDBRecipe[]> => {
  // Get ALL meals without category filter
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
  const allMeals: MealDBRecipe[] = [];
  const seenIds = new Set<string>();

  for (const letter of alphabet) {
    try {
      const response = await fetch(`${MEAL_API_BASE}/search.php?f=${letter}`);
      const data = await response.json();
      if (data.meals) {
        for (const meal of data.meals) {
          if (!seenIds.has(meal.idMeal)) {
            seenIds.add(meal.idMeal);
            allMeals.push(meal);
          }
        }
      }
    } catch (error) {
      console.warn(`Failed to fetch meals starting with ${letter}:`, error);
    }
  }

  return allMeals.filter((meal: any) => meal.strMealThumb && meal.strMeal);
};

export const searchMeals = async (query: string): Promise<MealDBRecipe[]> => {
  const response = await fetch(`${MEAL_API_BASE}/search.php?s=${query}`);
  const data = await response.json();
  return data.meals || [];
};

export const getMealById = async (id: string): Promise<MealDBRecipe | null> => {
  const response = await fetch(`${MEAL_API_BASE}/lookup.php?i=${id}`);
  const data = await response.json();
  return data.meals?.[0] || null;
};

// Drinks API
export const getDrinkCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${DRINK_API_BASE}/list.php?c=list`);
  const data = await response.json();
  return (data.drinks || []).map((drink: any, index: number) => ({
    idCategory: String(index),
    strCategory: drink.strCategory,
    strCategoryThumb: '',
    strCategoryDescription: '',
  }));
};

export const getDrinksByCategory = async (category: string): Promise<DrinkDBRecipe[]> => {
  // Use multiple strategies to get more drinks
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
  const allDrinks: DrinkDBRecipe[] = [];
  const seenIds = new Set<string>();

  // Strategy 1: Search by first letter
  for (const letter of alphabet) {
    try {
      const response = await fetch(`${DRINK_API_BASE}/search.php?f=${letter}`);
      const data = await response.json();
      if (data.drinks) {
        for (const drink of data.drinks) {
          // Filter by category and avoid duplicates
          if (drink.strCategory === category && !seenIds.has(drink.idDrink)) {
            seenIds.add(drink.idDrink);
            allDrinks.push(drink);
          }
        }
      }
    } catch (error) {
      console.warn(`Failed to fetch drinks starting with ${letter}:`, error);
    }
  }

  return allDrinks.filter((drink: any) => drink.strDrinkThumb && drink.strDrink);
};

export const getAllDrinks = async (): Promise<DrinkDBRecipe[]> => {
  // Get ALL drinks without category filter
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
  const allDrinks: DrinkDBRecipe[] = [];
  const seenIds = new Set<string>();

  for (const letter of alphabet) {
    try {
      const response = await fetch(`${DRINK_API_BASE}/search.php?f=${letter}`);
      const data = await response.json();
      if (data.drinks) {
        for (const drink of data.drinks) {
          if (!seenIds.has(drink.idDrink)) {
            seenIds.add(drink.idDrink);
            allDrinks.push(drink);
          }
        }
      }
    } catch (error) {
      console.warn(`Failed to fetch drinks starting with ${letter}:`, error);
    }
  }

  return allDrinks.filter((drink: any) => drink.strDrinkThumb && drink.strDrink);
};

export const searchDrinks = async (query: string): Promise<DrinkDBRecipe[]> => {
  const response = await fetch(`${DRINK_API_BASE}/search.php?s=${query}`);
  const data = await response.json();
  return data.drinks || [];
};

export const getDrinkById = async (id: string): Promise<DrinkDBRecipe | null> => {
  const response = await fetch(`${DRINK_API_BASE}/lookup.php?i=${id}`);
  const data = await response.json();
  return data.drinks?.[0] || null;
};
