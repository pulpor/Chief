import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FavoriteAndDoneRecipes } from '../../utils/types';

import all from '../../images/all_all.svg';
import meal from '../../images/meat/all.svg';
import drink from '../../images/drink/all.svg';
import shareIcon from '../../images/share.png';
import trash from  '../../images/lixeira.png';

function FavoriteRecipes() {
  const [favorites, setFavorites] = useState<FavoriteAndDoneRecipes[]>([]);
  const [filter, setFilter] = useState<string | null>(null);
  const [copiedRecipeIndex, setCopiedRecipeIndex] = useState<number | null>(null);

  const handleLinkCopy = (recipe: FavoriteAndDoneRecipes) => {
    const newLink = `${window.location.origin}/${recipe.type}s/${recipe.id}`;
    navigator.clipboard.writeText(newLink).then(() => {
      setCopiedRecipeIndex(favorites.indexOf(recipe));
      setTimeout(() => {
        setCopiedRecipeIndex(null);
      }, 1000);
    });
  };

  const removeRecipe = (recipeId: string) => {
    const updatedRecipes = favorites.filter((recipe) => recipe.id !== recipeId);
    setFavorites(updatedRecipes);
    localStorage.setItem('favoriteRecipes', JSON.stringify(updatedRecipes));
  };

  useEffect(() => {
    const favoriteLS = localStorage.getItem('favoriteRecipes');
    if (favoriteLS) {
      const newFav: FavoriteAndDoneRecipes[] = JSON.parse(favoriteLS);
      setFavorites(newFav);
    }
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

  // const [url, setUrl] = useState('meals');

  return (
    <>
      <div className="favoriteBody">
        <div className="containerDone">
          <button
            data-testid="filter-by-all-btn"
            id="AllButtonRecipe"
            onClick={clearFilter}
          >
            <img src={all} title="All" />
          </button>
          <button
            data-testid="filter-by-meal-btn"
            id="MealButtonRecipe"
            onClick={filterMeals}
          >
            <img src={meal} title="Meals" />
          </button>
          <button
            data-testid="filter-by-drink-btn"
            id="DrinksButtonRecipe"
            onClick={filterDrinks}
          >
            <img src={drink} title="Drinks" />
          </button>
        </div>

        {favorites
          .filter(
            (recipe) =>
              (recipe.type === 'meal' || recipe.type === 'drink') &&
              (filter === recipe.type || filter === null)
          )
          .map((recipe, index) => (
            <div key={index}>
              <Link to={`/${recipe.type}s/${recipe.id}`}>
                <div className="containerImgPrincipal">
                  <img
                    data-testid={`${index}-horizontal-image`}
                    id="principalDetail"
                    alt={recipe.name}
                    src={recipe.image}
                  />
                </div>
              </Link>
              <div className="agrupamentoFinal2">
                <Link className="h2Details" to={`/${recipe.type}s/${recipe.id}`}>
                  <h2 className="h2Details" data-testid={`${index}-horizontal-name`}>
                    {recipe.name}
                  </h2>
                </Link>
                <p className="pDetails" data-testid={`${index}-horizontal-top-text`}>
                  {`${recipe.nationality || recipe.name} - ${recipe.category || recipe.alcoholicOrNot}`}
                </p>
                <div className="containerFinal2">
                  <div className="agrupadorIcons2">
                    <button onClick={() => handleLinkCopy(recipe)}>
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
                        src={trash}
                        alt="Excluir"
                        data-testid={`${index}-horizontal-trash-btn`}
                      />
                    </button>
                  </div>
                  {copiedRecipeIndex === index && (
                    <span className="linkCopied">Link copied!</span>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}

export default FavoriteRecipes;
