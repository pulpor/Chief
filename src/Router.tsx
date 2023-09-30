import { Route, Routes } from 'react-router-dom';
import { Login } from './pages/Login/Login';
import Profile from './components/Profile';
import DoneRecipes from './components/Recipes/DoneRecipes';
import FavoriteRecipes from './components/Recipes/FavoriteRecipes';
import MealDetails from './components/Recipes/Meals/MealsDetails';
import DrinkDetails from './components/Recipes/Drinks/DrinksDetails';
import MealsCategorys from './components/Recipes/Meals/MealsCategorys';
import DrinksCategorys from './components/Recipes/Drinks/DrinksCategorys';
import DrinksInProgress from './components/Recipes/Drinks/DrinksInProgress';
import MealsInProgress from './components/Recipes/Meals/MealsInProgress';
import PublicLayout from './pages/Login/Public';

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={ <Login /> } />

      <Route
        path="/meals"
        element={
          <PublicLayout>
            <MealsCategorys />
          </PublicLayout>
        }
      />
      <Route
        path="/drinks"
        element={
          <PublicLayout>
            <DrinksCategorys />
          </PublicLayout>
        }
      />
      <Route
        path="/meals/:recipeId"
        element={
          <PublicLayout>
            <MealDetails />
          </PublicLayout>
        }
      />
      <Route
        path="/drinks/:recipeId"
        element={
          <PublicLayout>
            <DrinkDetails />
          </PublicLayout>
        }
      />
      <Route
        path="/drinks/:recipeId/in-progress"
        element={
          <PublicLayout>
            <DrinksInProgress />
          </PublicLayout>
        }
      />
      <Route
        path="/meals/:recipeId/in-progress"
        element={
          <PublicLayout>
            <MealsInProgress />
          </PublicLayout>
        }
      />
      <Route
        path="/profile"
        element={
          <PublicLayout>
            <Profile />
          </PublicLayout>
        }
      />
      <Route
        path="/done-recipes"
        element={
          <PublicLayout>
            <DoneRecipes />
          </PublicLayout>
        }
      />
      <Route
        path="/favorite-recipes"
        element={
          <PublicLayout>
            <FavoriteRecipes />
          </PublicLayout>
        }
      />

    </Routes>
  );
}
