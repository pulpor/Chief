import { useEffect, useState } from 'react';
import MealsContext from './MealsContext';
import { Meal } from '../utils/types';

type MealsProviderType = {
  children:React.ReactNode
};

function MealsProvider({ children }: MealsProviderType) {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [mealsContext, setMealsContext] = useState<Meal[]>([]);

  const [favMeals, setFavMeals] = useState<Meal[]>([]);

  useEffect(() => {
    const getMealsInfo = async () => {
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=');
      const data = await response.json();

      setMeals(data.meals);
    };

    getMealsInfo();
  }, []);

  const contextValue = { meals,
    setMeals,
    mealsContext,
    setMealsContext,
    favMeals,
    setFavMeals };
  return (
    <MealsContext.Provider value={ contextValue }>
      {children}
    </MealsContext.Provider>
  );
}
export default MealsProvider;
