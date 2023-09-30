import { Drink, Meal } from './types';

const ALERT_ERROR = "Sorry, we haven't found any recipes for these filters.";

// Função para buscar receitas por ingrediente
export async function searchRecipesByIngredient(ingredient: string): Promise<Meal[]> {
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
  const data = await response.json();
  return data.meals;
}

// Função para buscar receitas por nome
export async function searchRecipesByName(name:string): Promise<Meal[]> {
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`);
  const data = await response.json();
  if (!data.meals) {
    alert(ALERT_ERROR);
    return [];
  }
  return data.meals;
}

// Função para buscar receitas por primeira letra
export async function searchRecipesByFirstLetter(letter: string): Promise<Meal[]> {
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
  const data = await response.json();
  console.log('api meals letra: ', data);
  if (!data.meals) {
    alert(ALERT_ERROR);
    return [];
  }
  return data.meals;
}

// Função para buscar Drinks por ingrediente
export async function searchDrinksByIngredient(ingredient: string): Promise<Drink[]> {
  const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${ingredient}`);
  const data = await response.json();
  if (!data.drinks) {
    alert(ALERT_ERROR);
    return [];
  }
  return data.drinks;
}

// Função para buscar Drinks por nome
export async function searchDrinksByName(name: string): Promise<Drink[]> {
  const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${name}`);
  const data = await response.json();
  if (!data.drinks) {
    alert(ALERT_ERROR);
    return [];
  }
  return data.drinks;
}

// Função para buscar Drinks por primeira letra
export async function searchDrinksByFirstLetter(letter: string): Promise<Drink[]> {
  const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${letter}`);
  const data = await response.json();
  return data.drinks;
}

export async function getMeals() {
  const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=');
  const data = await response.json();
  return data.meals;
}

export async function getDrinks() {
  const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=');
  const data = await response.json();
  return data.drinks;
}

export async function getMealById(id: string) {
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
  const data = await response.json();
  return data.meals;
}

export async function getDrinkById(id: string) {
  const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`);
  const data = await response.json();
  return data.drinks;
}
