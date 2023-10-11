import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FavoriteAndDoneRecipes } from '../../utils/types';
import shareIcon from '../../images/shareIcon.svg';

function DoneRecipes() {
  const [doneRecipes, setDoneRecipes] = useState<FavoriteAndDoneRecipes[]>([]);
  const [filter, setFilter] = useState<any | null>(null);
  const [copy, setCopy] = useState(false);
  // const [doneFiltered, setDoneFiltered] = useState<FavoriteAndDoneRecipes[]>([]);

  useEffect(() => {
    const DoneRecipesLS = localStorage.getItem('doneRecipes');
    if (DoneRecipesLS) {
      const newDoneRecipes: FavoriteAndDoneRecipes[] = JSON.parse(DoneRecipesLS);

      const filteredRecipes = filterRecipes(newDoneRecipes, filter);

      setDoneRecipes(filteredRecipes);
    }
  }, [filter]);

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
      <div>

        <button
          data-testid="filter-by-meal-btn"
          id="MealButtonRecipe"
          onClick={ filterMeals }
        >
          Meals
        </button>

        <button
          data-testid="filter-by-drink-btn"
          id="DrinksButtonRecipe"
          onClick={ filterDrinks }
        >
          Drinks
        </button>
      </div>

      <button
        data-testid="filter-by-all-btn"
        id="AllButtonRecipe"
        onClick={ clearFilter }
      >
        All
      </button>

      {doneRecipes.map((recipe, index) => {
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
                  <p data-testid={ `${index}-horizontal-name` }>{recipe.name}</p>
                </Link>

                <Link to={ `/${recipe.type}s/${recipe.id}` }>
                  <img
                    data-testid={ `${index}-horizontal-image` }
                    alt={ recipe.name }
                    src={ recipe.image }
                  />
                </Link>
                <p data-testid={ `${index}-horizontal-top-text` }>
                  {`${recipe.nationality} - ${recipe.category}`}
                </p>
                <div>
                  <p data-testid={ `${index}-horizontal-done-date` }>
                    Done on:
                    {' '}
                    { recipe.doneDate }
                  </p>
                  <p data-testid={ `${index}-horizontal-top-text` }>
                    {recipe.alcoholicOrNot}
                  </p>
                </div>
                {' '}

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
                    src={ shareIcon }
                    alt="Share"
                    data-testid={ `${index}-horizontal-share-btn` }

                  />

                </button>
                {copy && <p>Link copied!</p>}
              </div>
            ) : null}
          </div>
        );
      })}
    </>
  );
}

export default DoneRecipes;
