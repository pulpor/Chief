import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FavoriteAndDoneRecipes } from '../../utils/types';
import shareIcon from '../../images/share.png';

import all from '../../images/all_all.svg';
import meal from '../../images/meat/all.svg';
import drink from '../../images/drink/all.svg';

function DoneRecipes() {
  const [doneRecipes, setDoneRecipes] = useState<FavoriteAndDoneRecipes[]>([]);
  console.log(doneRecipes);
  
  const [filter, setFilter] = useState<any | null>(null);
  const [copy, setCopy] = useState(false)

  useEffect(() => {
    const DoneRecipesLS = localStorage.getItem('doneRecipes');
    if (DoneRecipesLS) {
      const newDoneRecipes: FavoriteAndDoneRecipes[] = JSON.parse(DoneRecipesLS);

      const filteredRecipes = filterRecipes(newDoneRecipes, filter);

      setDoneRecipes(filteredRecipes);
    }
  }, [filter]);

  const formated = (index: any) => {
    const finishRecipeDates = JSON.parse(localStorage.getItem('finishRecipeDates') || '[]') || [];
    const finishRecipeTimes = JSON.parse(localStorage.getItem('finishRecipeTimes') || '[]') || [];
  
    if (index >= 0 && index < finishRecipeDates.length && index < finishRecipeTimes.length) {
      const finishRecipe = `${finishRecipeDates[index]} - ${finishRecipeTimes[index]}`;
      return finishRecipe;
    }
  
    return '';
  };
  

  const filterRecipes = (
    recipes: FavoriteAndDoneRecipes[],
    selectedFilter: string | null,
  ) => {
    if (selectedFilter === 'meal') {
      return recipes.filter((recipe) => recipe.type === 'meal');
    } if (selectedFilter === 'drink') {
      return recipes.filter((recipe) => recipe.type === 'drink');
    }
    return recipes;
  };

  useEffect(() => {
    const DoneRecipesLS = localStorage.getItem('doneRecipes');
    if (DoneRecipesLS) {
      const newDoneRecipes: FavoriteAndDoneRecipes[] = JSON.parse(DoneRecipesLS);
      setDoneRecipes(newDoneRecipes);
    }
  }, []);

  const [url, setUrl] = useState('meals');

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

      {doneRecipes.map((recipe, index) => {
        console.log(recipe.doneDate)
        const handleShareClick = () => {
          const pathName = window.location.pathname;
          const urlType = pathName.includes('/meals') ? 'meals' : 'drinks';
          setUrl(urlType);
          const recipeURL = `http://localhost:3000/${url}/${recipe.id}`;
          navigator.clipboard.writeText(recipeURL);
          setCopy(true);
          setTimeout(() => {
            setCopy(false);
          }, 1000);
        };

        const recipeMatchesFilter = (filter === 'meal' && recipe.type === 'meal')
          || (filter === 'drink' && recipe.type === 'drink')
          || filter === null;

        return (
          <div key={ index }>
            
            {recipeMatchesFilter ? (
              <div>
                
                <Link to={ `/${recipe.type}s/${recipe.id}` }>
                  <div className="containerImgPrincipal">
                    <img
                      data-testid={ `${index}-horizontal-image` }
                      id="principalDetail"
                      alt={ recipe.name }
                      src={ recipe.image }
                    />
                  </div>
                </Link>

                <Link className='h2Details' to={ `/${recipe.type}s/${recipe.id}` }>
                  <h2 
                  className='h2Details' 
                  data-testid={ `${index}-horizontal-name` }>
                    {recipe.name}

                  </h2>
                </Link>               

                <p className='pDetails' data-testid={ `${index}-horizontal-top-text` }>
                  {`${recipe.nationality || recipe.name } - ${recipe.category || recipe.alcoholicOrNot}`}
                </p>

                <div className="containerFinal">

                  <p className="pDetails2" data-testid={ `${index}-horizontal-done-date` }>
                    <span id="done">Done on:</span> {formated(index)}
                  </p>

                  {recipe.tags && Array.isArray(recipe.tags) && recipe.tags
                    .slice(0, 2).map((tag: any, tagIndex: any) => (
                      <p
                        key={ `${index}-${tagIndex}` }
                        data-testid={ `${index}-${tag}-horizontal-tag` }
                      >
                        {tag}
                      </p>
                    ))}

                  <button onClick={ () => handleShareClick() }>

                    <img
                      className="shareIcon"
                      src={ shareIcon }
                      alt="Share"
                      data-testid={ `${index}-horizontal-share-btn` }
                    />

                  </button>

                  {copy && <span className="linkCopied">Link copied!</span>}

                </div>
                {' '}

              </div>
            ) : null}
          </div>
        );
      })}
    </>
  );
}

export default DoneRecipes;
