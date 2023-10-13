import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  searchRecipesByIngredient,
  searchRecipesByName,
  searchRecipesByFirstLetter,
  searchDrinksByName,
  searchDrinksByFirstLetter,
  searchDrinksByIngredient,
} from '../../utils/Api';

import { Drink, Meal } from '../../utils/types';
import Footer from '../Footer/Footer';
import DrinksContext from '../../context/DrinksContext';
import MealsContext from '../../context/MealsContext';

function SearchBar() {
  const FIRST_LETTER = 'first-letter';
  const navigate = useNavigate();
  const location = useLocation();

  const [myQuery, setMyQuery] = useState('');
  const [searchType, setSearchType] = useState('ingredient');
  const [isDrink, setIsDrink] = useState<Drink[]>([]);
  const [isMeal, setIsMeal] = useState<Meal[]>([]);

  const isDrinksPage = location.pathname === '/drinks';
  const isMealsPage = location.pathname === '/meals';

  const { setDrinks } = useContext(DrinksContext);
  const { setMeals } = useContext(MealsContext);

  useEffect(() => {
    if (isDrink && isDrink.length === 1 && isDrink[0].idDrink) {
      navigate(`/drinks/${isDrink[0].idDrink}`);
    }

    if (isMeal && isMeal.length === 1 && isMeal[0].idMeal) {
      navigate(`/meals/${isMeal[0].idMeal}`);
    }
  }, [isDrink, isMeal, navigate]);

  const fetchByFistLetter = async () => {
    if (isDrinksPage) {
      const recipes = await searchDrinksByFirstLetter(myQuery);
      setIsDrink(recipes);
      setDrinks(recipes);
    } else if (isMealsPage) {
      const recipes = await searchRecipesByFirstLetter(myQuery);
      setIsMeal(recipes);
      setMeals(recipes);
    }
  };

  const fetchByName = async () => {
    if (isDrinksPage) {
      const recipes = await searchDrinksByName(myQuery);
      setIsDrink(recipes);
      setDrinks(recipes);
    } else if (isMealsPage) {
      const recipes = await searchRecipesByName(myQuery);
      setIsMeal(recipes);
      setMeals(recipes);
    }
  };

  const fetchByIngredients = async () => {
    if (isDrinksPage) {
      const recipes = await searchDrinksByIngredient(myQuery);
      console.log(('fetchByIngredientsChamado2'));
      setIsDrink(recipes);
      setDrinks(recipes);
    } else if (isMealsPage) {
      const recipes = await searchRecipesByIngredient(myQuery);

      setIsMeal(recipes);
      setMeals(recipes);
    }
  };

  const HandleSearch = async () => {
    if (searchType === FIRST_LETTER && myQuery.length !== 1) {
      window.alert('Your search must have only 1 (one) character');
      return;
    }

    if (isMeal.length === 0 || isDrink.length === 0) {
      window.alert('Sorry, we havent found any recipes for these filters');
    }

    try {
      if (searchType === 'ingredient') {
        await fetchByIngredients();
      } else if (searchType === 'name') {
        await fetchByName();
      } else if (searchType === FIRST_LETTER) {
        await fetchByFistLetter();
      }
    } catch (error) {
      console.error('Error occurred:', error);
    }
  };

  return (
    <div className='searchContainer'>

      <input
        className='inputSearch'
        data-testid="search-input"
        type="text"
        value={ myQuery }
        onChange={ (e) => setMyQuery(e.target.value) }
        placeholder="Search"
      />

      <div className="radioContainer"> 

        <div className="radio1">
          <label htmlFor="radio1">
            <input
              id="radio1"
              data-testid="ingredient-search-radio"
              type="radio"
              value="ingredient"
              checked={ searchType === 'ingredient' }
              onChange={ () => setSearchType('ingredient') }
            />
            <div className="custom-radio">
              <span></span>
            </div>
            <span>Ingredient</span>
            
          </label>
        </div>

        <div className="radio2">
        <label htmlFor="radio2">
          <input
            id="radio2"
            data-testid="name-search-radio"
            type="radio"
            value="name"
            checked={ searchType === 'name' }
            onChange={ () => setSearchType('name') }
          />
          <div className="custom-radio">
            <span></span>
          </div>
          <span>Name</span>
        </label>
        </div>

        <div className="radio3">
          <label htmlFor="radio3">
            <input
              id="radio3"
              data-testid="first-letter-search-radio"
              type="radio"
              value={ FIRST_LETTER }
              checked={ searchType === FIRST_LETTER }
              onChange={ () => setSearchType(FIRST_LETTER) }
            />
            <div className="custom-radio">
              <span></span>
            </div><span>First Letter</span>
            
          </label>
        </div>

      </div>

      <button data-testid="exec-search-btn" className='btn-hover searchBtn' onClick={ HandleSearch }>
        Search
      </button>

      <Footer />

    </div>
  );
}

export default SearchBar;
