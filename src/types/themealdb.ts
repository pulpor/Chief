// TheMealDB API Types
export interface MealDBRecipe {
  idMeal: string;
  strMeal: string;
  strDrinkAlternate: string | null;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strTags: string | null;
  strYoutube: string;
  [key: `strIngredient${number}`]: string;
  [key: `strMeasure${number}`]: string;
}

export interface DrinkDBRecipe {
  idDrink: string;
  strDrink: string;
  strDrinkThumb: string;
  strCategory: string;
  strAlcoholic: string;
  strGlass: string;
  strInstructions: string;
  strDrinkAlternate: string | null;
  strTags: string | null;
  [key: `strIngredient${number}`]: string;
  [key: `strMeasure${number}`]: string;
}

export interface Category {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
}

export type RecipeType = 'meals' | 'drinks';
