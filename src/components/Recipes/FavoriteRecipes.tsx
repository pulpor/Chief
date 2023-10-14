import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { FavoriteAndDoneRecipes } from '../../utils/types';

import all from '../../images/all_all.svg';
import meal from '../../images/meat/all.svg';
import drink from '../../images/drink/all.svg';


import aberto from '../../images/coracaoAberto.png'
import fechado from '../../images/coracaoFechado.png'


function FavoriteRecipes() {
  const [favorites, setFavorites] = useState<FavoriteAndDoneRecipes[]>([]);
  const [filter, setFilter] = useState<any | null>(null);
  const [copy, setCopy] = useState('');


  const handleFavorite = (recipe: FavoriteAndDoneRecipes) => {
    if (localStorage.getItem('favoriteRecipes')) {
      const newFavorites = favorites
        .filter((e) => e.id !== recipe.id) as FavoriteAndDoneRecipes[];
      localStorage.setItem('favoriteRecipes', JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    }
  };

  const handleLinkCopy = (recipe: FavoriteAndDoneRecipes) => {
    const newLink = `${window.location.origin}/${recipe.type}s/${recipe.id}`;
    navigator.clipboard.writeText(newLink).then(() => {
      setCopy(recipe.id);
    });
  };

  useEffect(() => {
    setFavorites(JSON.parse(localStorage
      .getItem('favoriteRecipes') || '[]') as FavoriteAndDoneRecipes[]);
  }, []);


  const filterMeals = () => {
    setFilter('meal');
  };

  const filterDrinks = () => {
    setFilter('drink');
  };

  const clearFilter = () => {
    setFilter(null);
  };

  return (
    <>

      <div className="containerDone">
        
        <button
          data-testid="filter-by-all-btn"
          id="AllButtonRecipe"
          onClick={ clearFilter }
        >
          <img src={ all } title="All"/>
        </button>

        <button
          data-testid="filter-by-meal-btn"
          id="MealButtonRecipe"
          onClick={ filterMeals }
        >
          <img src={ meal } title="Meals"/>
        </button>

        <button
          data-testid="filter-by-drink-btn"
          id="DrinksButtonRecipe"
          onClick={ filterDrinks }
        >
          <img src={ drink } title="Drinks"/>
        </button>
      
      </div>

      
      {favorites.filter((recipe) => (
        filter === 'meal' && recipe.type === 'meal')
        || (filter === 'drink' && recipe.type === 'drink') || filter === '')
        .map((recipe, index) => (
          <div key={ index }>

            <Link to={ `/${recipe.type}s/${recipe.id}` }>
              <div data-testid={ `${index}-horizontal-name` }>{recipe.name}</div>
            </Link>

            <Link to={ `/${recipe.type}s/${recipe.id}` }>
              <img
                data-testid={ `${index}-horizontal-image` }
                alt={ recipe.name }
                src={ recipe.image }
              />
            </Link>

            <div data-testid={ `${index}-horizontal-top-text` }>
              {recipe.type === 'meal'
                ? `${recipe.nationality} - ${recipe.category}`
                : `${recipe.alcoholicOrNot}`}
            </div>

            <div>
              { copy === recipe.id ? <p>Link copied!</p> : null }

              <button onClick={ () => handleLinkCopy(recipe) }>
                <img
                  data-testid={ `${index}-horizontal-share-btn` }
                  src={ aberto }
                  alt="shareIcon"
                />
              </button>

              <button onClick={ () => handleFavorite(recipe) }>
                <img
                  data-testid={ `${index}-horizontal-favorite-btn` }
                  src={ fechado }
                  alt="blackHeart"
                />
              </button>

            </div>

          </div>

        ))}
    </>
  );
}

export default FavoriteRecipes;
