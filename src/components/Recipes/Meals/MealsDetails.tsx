import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import MealsContext from '../../../context/MealsContext';
import whiteHeartIcon from '../../../images/whiteHeartIcon.svg';
import blackHeartIcon from '../../../images/blackHeartIcon.svg';
import DrinksContext from '../../../context/DrinksContext';

function MealDetails() {
  const { recipeId } = useParams();
  const { setMealsContext,
    mealsContext,
    setFavMeals,
    favMeals } = useContext(MealsContext);
  const { drinks } = useContext(DrinksContext);

  const [recipe, setRecipe] = useState<any | null>('');
  console.log('recipe', recipe);
  const [copied, setCopied] = useState(false);
  const [favorite, setFavorite] = useState(false);

  const navigate = useNavigate();
  // const [recommendation, setRecommendation] = useState<any | null>(null);,

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const response = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`,
        );
        const data = await response.json();
        setRecipe(data.meals?.[0]);
        setMealsContext([data.meals?.[0]]);
      } catch (error) {
        console.error('deu zebra aqui: ', error);
      }
    };

    fetchRecipeDetails();
  }, [recipeId, setMealsContext]);

  const HandleClick = () => {
    navigate(`/meals/${recipeId}/in-progress`);
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
      setFavMeals(mealsContext);
    } else {
      setFavMeals([]);
    }
  }, [favorite, mealsContext, setFavMeals]);

  useEffect(() => {
    if (favorite) {
      localStorage.setItem('favoriteRecipes', JSON.stringify(favMeals.map((r) => {
        return {
          id: r.idMeal,
          type: 'meal',
          nationality: r.strArea,
          category: r.strCategory,
          alcoholicOrNot: '',
          name: r.strMeal,
          image: r.strMealThumb,
        };
      })));
    }
  }, [favMeals, favorite]);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favoriteRecipes') || '[]');
    setFavMeals(favorites);

    // Verifique se a receita atual está na lista de favoritos
    const isFavorite = favorites.some((favRecipe:any) => favRecipe.id === recipe.idMeal);
    setFavorite(isFavorite);
  }, [recipe, setFavMeals]);

  const handleFavoritre = () => {
    setFavorite(!favorite);
  };

  return (
    <div>
      {recipe ? ( // if
        <div>

          <img
            src={ recipe.strMealThumb }
            alt={ recipe.strMeal }
            data-testid="recipe-photo"
          />

          {/* passar o title para o meio da imagem dps no css, de acordo c figma */}
          <h2 data-testid="recipe-title">
            { recipe.strMeal}
          </h2>

          <p data-testid="recipe-category">
            { recipe.strCategory }
          </p>

          <h3>Ingredientes:</h3>

          <div>

            {Object.keys(recipe)
              .filter((key) => key.includes('Ingredient') && recipe[key])
              .map((key, index) => (
                <div
                  key={ index }
                  data-testid={ `${index}-ingredient-name-and-measure` }
                >
                  {recipe[key]}
                  {' '}
                  -
                  {' '}
                  {/* proximo item */}
                  {recipe[`strMeasure${index + 1}`]}
                </div>
              ))}
          </div>

          <h3>Instructions:</h3>
          <p data-testid="instructions">{recipe.strInstructions}</p>

          <div data-testid="video">
            { recipe.strYoutube }
          </div>

          <div className="carousel-container">
            {drinks.slice(0, 6).map((receita: any, index: any) => (
              <Link to={ `/drinks/${receita.idDrink}` } key={ receita.idDrink }>
                <div
                  className="recommendation-card"
                  data-testid={ `${index}-recommendation-card` }
                  key={ receita.idDrink }
                >
                  <img src={ receita.strDrinkThumb } alt={ receita.strDrink } />
                  <p
                    data-testid={ `${index}-recommendation-title` }
                  >
                    {receita.strDrink}

                  </p>
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

    </div>
  );
}

export default MealDetails;
