import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { FavoriteAndDoneRecipes } from '../../utils/types';

import all from '../../images/all_all.svg';
import meal from '../../images/meat/all.svg';
import drink from '../../images/drink/all.svg';
import shareIcon from '../../images/share.png';
import trash from  '../../images/lixeira.png';

function DoneRecipes() {
  const [doneRecipes, setDoneRecipes] = useState<FavoriteAndDoneRecipes[]>([]);
  const [filter, setFilter] = useState<string | null>(null);
  
  const [copiedRecipeIndex, setCopiedRecipeIndex] = useState<number | null>(null);

  useEffect(() => {
    const DoneRecipesLS = localStorage.getItem('doneRecipes');
    if (DoneRecipesLS) {
      const newDoneRecipes: FavoriteAndDoneRecipes[] = JSON.parse(DoneRecipesLS);

      const filteredRecipes = filterRecipes(newDoneRecipes, filter);

      setDoneRecipes(filteredRecipes);
    }
  }, [filter]);

  const formated = (index: number) => {
    const finishRecipeDates = JSON.parse(localStorage.getItem('finishRecipeDates') ?? '[]') || [];
    const finishRecipeTimes = JSON.parse(localStorage.getItem('finishRecipeTimes') ?? '[]') || [];
  
    if (index >= 0 && index < finishRecipeDates.length && index < finishRecipeTimes.length) {

      const brazilLocale = 'pt-BR';
      const dateParts = finishRecipeDates[index].split('/');
      const timeParts = finishRecipeTimes[index].split(':');
  
      if (dateParts.length === 3 && timeParts.length === 3) {
        const day = parseInt(dateParts[0], 10);
        const month = parseInt(dateParts[1], 10) - 1;
        const year = parseInt(dateParts[2], 10);
  
        const hours = parseInt(timeParts[0], 10);
        const minutes = parseInt(timeParts[1], 10);
        const seconds = parseInt(timeParts[2], 10);
  
        const date = new Date(year, month, day, hours, minutes, seconds);
        date.setUTCHours(date.getUTCHours()); // São Paulo (GMT-3)
  
        const formattedDate = date.toLocaleString(brazilLocale);
  
        return formattedDate;
      }
    }
  
    return '';
  };
  

  

  const filterRecipes = (
    recipes: FavoriteAndDoneRecipes[],
    selectedFilter: string | null,
  ) => {
    if (selectedFilter === 'meal') {
      return recipes.filter((recipe) => recipe.type === 'meal');
    } else if (selectedFilter === 'drink') {
      return recipes.filter((recipe) => recipe.type === 'drink');
    } else {
      return recipes;
    }
  };

  useEffect(() => {
    const DoneRecipesLS = localStorage.getItem('doneRecipes');
    if (DoneRecipesLS) {
      const newDoneRecipes: FavoriteAndDoneRecipes[] = JSON.parse(DoneRecipesLS);
      setDoneRecipes(newDoneRecipes);
    }
  }, []);

  const [url, setUrl] = useState('meals');
  console.log(url);
  

  const filterMeals = () => {
    setFilter('meal');
  };

  const filterDrinks = () => {
    setFilter('drink');
  };

  const clearFilter = () => {
    setFilter(null);
  };

  const removeRecipe = (recipeId: string) => {
    const updatedRecipes = doneRecipes.filter((recipe) => recipe.id !== recipeId);
    setDoneRecipes(updatedRecipes);
    localStorage.setItem('doneRecipes', JSON.stringify(updatedRecipes));
  };
  
  return (
    <>
    <div className="DoneRecipes">
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
          const isCopied = copiedRecipeIndex === index;
          
          const handleShareClick = (index: number, recipeType: string) => {
            setUrl(recipeType); 
            const recipeURL = `${window.location.origin}/${recipeType}s/${doneRecipes[index].id}`;
            navigator.clipboard.writeText(recipeURL);
          
            setCopiedRecipeIndex(index);
          
            setTimeout(() => {
              setCopiedRecipeIndex(null);
            }, 1000);
          };

        const recipeMatchesFilter = (filter === 'meal' && recipe.type === 'meal')
          || (filter === 'drink' && recipe.type === 'drink')
          || filter === null;

        return (
          <div key={ index } className="bodyDone">
            
            {recipeMatchesFilter ? (
              <div className="gridTester">
                
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

                <div className="agrupamentoFinal">

                  <div className="doneOn">

                    <p className="pDetails2" data-testid={ `${index}-horizontal-done-date` }>
                      <span id="done">Done on:</span> {formated(index)}
                    </p>

                    {recipe.tags && Array.isArray(recipe.tags) && recipe.tags
                      .slice(0, 2).map((tag: string) => (
                        <p
                          key={ `${recipe.id}-${tag}` }
                          data-testid={ `${recipe.id}-${tag}-horizontal-tag` }
                        >
                          {tag}
                        </p>
                      ))}
                      
                  </div>

                  <div className="agrupadorIcons">

                  <button onClick={() => handleShareClick(index, recipe.type)}>
                    <img
                      className="shareIcon"
                      src={shareIcon}
                      alt="Share"
                      data-testid={`${index}-horizontal-share-btn`}
                    />
                  </button>

                    <button onClick={() => removeRecipe(recipe.id)}>
                      <img
                        className="shareIcon"
                        src={ trash }
                        alt="Excluir"
                        data-testid={`${index}-horizontal-trash-btn`}
                      />
                    </button>        
              
                  </div>
                  
                  {isCopied && (
                        <span className="linkCopied2">Link copied!</span>
                      )}

                </div> 

             
              </div>
            ) : null}
          </div>
        );
      })}
      </div>
    </>
  );
}

export default DoneRecipes;
