export interface SearchBarProps {
  onSearch: (
    query: string, // consulta de busca.
    searchType: string, // tipo de busca, ingredientes, nome ou first letter
    setIsMeal: (meals: Meal[]) => void,
    /* função que recebe um array de (Meal[] ou
    Drink[]) como argumento e não retorna nada. */
    setIsDrink: (drinks: Drink[]) => void,
  ) => void; // sem retorno
}

export interface Meal {
  meals: string;
  key: string;
  idMeal: string;
  strMeal: string;
  isfood: string;
  strCategory: string;
  strArea:string;
  strInstructions:string;
  strMealThumb: string;
  strTags: string;
  strYoutube: string;
}

export interface Drink {
  idDrink: string;
  strDrink: string;
  strCategory: string;
  strInstructions: string;
  strDrinkThumb: string;
  strArea: string;
  strAlcoholic: string;
  strYoutube: string;

}

export type MealsContextTypes = {
  meals: Meal[];
  setMeals: React.Dispatch<React.SetStateAction<Meal[]>>
  mealsContext: Meal[];
  setMealsContext:React.Dispatch<React.SetStateAction<Meal[]>>
  favMeals: Meal[];
  setFavMeals:React.Dispatch<React.SetStateAction<Meal[]>>
};

export type DrinksContextTypes = {
  drinks: Drink[];
  setDrinks: React.Dispatch<React.SetStateAction<Drink[]>>
  recipeContext:Drink[];
  setRecipeContext:React.Dispatch<React.SetStateAction<Drink[]>>
  favDrinks: Drink[];
  setFavDrinks:React.Dispatch<React.SetStateAction<Drink[]>>
};

export type UtilsContextTypes = {
  myQuery: string;
  setMyQuery: React.Dispatch<React.SetStateAction<string>>;
  searchType: string;
  setSearchType: React.Dispatch<React.SetStateAction<string>>;
  isMeal: boolean;
  setIsMeal:React.Dispatch<React.SetStateAction<boolean>>
};

export type FavoriteAndDoneRecipes = {
  id: string,
  type: string,
  nationality: string,
  category: string,
  alcoholicOrNot: string,
  name: string,
  image:string,
  doneDate: string,
  tags: string[],
  strCategory: string;
  strDrink: string;
};

export interface CardProps {
  id: string,
  name: string,
  image: string;
  index: number;
}

export interface ListaMeals {
  receitinhas: Array<{
    idMeal: string;
    strMeal: string;
    strMealThumb: string;
  }>;
}

export type MealsIngredientes = {
  [key in `strIngredient${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20}`]: string | undefined;
};
