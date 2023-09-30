import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import DrinksContext from '../../../context/DrinksContext';
import whiteHeartIcon from '../../../images/whiteHeartIcon.svg';
import blackHeartIcon from '../../../images/blackHeartIcon.svg';
import MealsContext from '../../../context/MealsContext';

function DrinkDetails() {
  const { recipeId } = useParams();
  const { setRecipeContext, recipeContext, setFavDrinks,
    favDrinks } = useContext(DrinksContext);
  const { meals } = useContext(MealsContext);

  const [recipe, setRecipe] = useState<any | null>('');
  const [copied, setCopied] = useState(false);
  const [favorite, setFavorite] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const response = await fetch(
          `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${recipeId}`,
        );
        const data = await response.json();
        setRecipe(data.drinks?.[0]);
        setRecipeContext([data.drinks?.[0]]);
      } catch (error) {
        console.error('deu zebra aqui: ', error);
      }
    };

    fetchRecipeDetails();
  }, [recipeId, setRecipeContext]);

  const HandleClick = () => {
    navigate(`/drinks/${recipeId}/in-progress`);
  };

  const handleShare = () => {
    const { location: { pathname } } = window;
    const link = `http://localhost:3000${pathname}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  useEffect(() => {
    if (favorite === true) {
      setFavDrinks(recipeContext);
    } else {
      setFavDrinks([]);
    }
  }, [favorite, recipeContext, setFavDrinks]);

  const handleFavoritre = () => {
    setFavorite(!favorite);
  };

  useEffect(() => {
    if (favorite) {
      localStorage.setItem('favoriteRecipes', JSON.stringify(favDrinks.map((r) => {
        return {
          id: r.idDrink,
          type: 'drink',
          nationality: '',
          category: r.strCategory,
          alcoholicOrNot: r.strAlcoholic,
          name: r.strDrink,
          image: r.strDrinkThumb,
        };
      })));
    }
  }, [favDrinks, favorite]);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favoriteRecipes') || '[]');
    setFavDrinks(favorites);

    // Verifique se a receita atual está na lista de favoritos
    const isFavorite = favorites.some((favRecipe:any) => favRecipe.id === recipe.idDrink);
    setFavorite(isFavorite);
  }, [recipe, setFavDrinks]);

  return (
    <div>
      {recipe ? ( // if
        <div>

          <img
            src={ recipe.strDrinkThumb }
            alt={ recipe.strDrink }
            data-testid="recipe-photo"
          />

          {/* passar o title para o meio da imagem dps no css, de acordo c figma */}
          <h2 data-testid="recipe-title">
            { recipe.strDrink}
          </h2>

          <p data-testid="recipe-category">
            {recipe.strAlcoholic}
          </p>

          <h3>Ingredients:</h3>

          <div>
            {Object.keys(recipe)
              .filter((key) => key.includes('Ingredient')
              && recipe[key]).map((key, index) => (
                <div key={ index } data-testid={ `${index}-ingredient-name-and-measure` }>
                  {recipe[key]}
                  {' '}
                  -
                  {' '}
                  {/* pega o proximo item da receita */}
                  {recipe[`strMeasure${index + 1}`]}
                </div>
              ))}
          </div>

          <h3>Instructions:</h3>
          <p data-testid="instructions">{recipe.strInstructions}</p>

          <div className="carousel-container">
            {meals.slice(0, 6).map((receita: any, index: any) => (
              <Link to={ `/meals/${receita.idMeal}` } key={ receita.idMeal }>
                <div
                  className="recommendation-card"
                  data-testid={ `${index}-recommendation-card` }
                  key={ receita.idMeal }
                >
                  <img src={ receita.strMealThumb } alt={ receita.strMeal } />
                  <p data-testid={ `${index}-recommendation-title` }>{receita.strMeal}</p>
                </div>

              </Link>
            ))}
          </div>

          <button
            data-testid="start-recipe-btn"
            className="recipe-button"
            onClick={ HandleClick }
          >
            Continue Recipe
          </button>
          {copied
            && <p>Link copied!</p>}
          <button
            data-testid="share-btn"
            onClick={ handleShare }
          >
            Share
          </button>
          {favorite ? (

            <button onClick={ handleFavoritre }>
              <img
                data-testid="favorite-btn"
                src={ blackHeartIcon }
                alt="blackHeartIcon"
              />

            </button>
          ) : (
            <button onClick={ handleFavoritre }>
              <img
                data-testid="favorite-btn"
                src={ whiteHeartIcon }
                alt="whiteHeartIcon"
              />
            </button>
          )}
        </div>
      ) : (null) }
      ;
    </div>
  );
}

export default DrinkDetails;
