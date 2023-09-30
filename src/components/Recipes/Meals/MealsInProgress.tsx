import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Meal } from '../../../tests/utils/types';
import whiteHeartIcon from '../../../images/whiteHeartIcon.svg';
import blackHeartIcon from '../../../images/blackHeartIcon.svg';

function MealsInProgress() {
  const { recipeId } = useParams();
  const [trem, setTrem] = useState<Meal[]>([]);
  const [completedIngredients, setCompletedIngredients] = useState<string[]>([]);
  const [allIngredientsCompleted, setAllIngredientsCompleted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [favorite, setFavorite] = useState(false);

  const getIngredients = (meal: any) => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) { // limite de 20 ingredientes no loop
      const ingredient = meal && meal[`strIngredient${i}`];
      if (ingredient) {
        ingredients.push(ingredient);
      }
    }
    return ingredients;
  };

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const response = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`,
        );
        const data = await response.json();
        setTrem([data.meals?.[0]]);
      } catch (error) {
        console.error('deu zebra aqui: ', error);
      }
    };

    fetchRecipeDetails();
  }, [recipeId]);

  useEffect(() => {
    const favoriteRecipes = JSON.parse(localStorage.getItem('favoriteRecipes') || '[]');
    const isFavorite = favoriteRecipes
      .some((recipe: any) => recipe.id === recipeId && recipe.type === 'meal');
    setFavorite(isFavorite);
  }, [recipeId]);

  useEffect(() => {
    const savedProgress = localStorage.getItem('inProgressRecipes');

    if (savedProgress) {
      const progressData = JSON.parse(savedProgress);

      if (recipeId && progressData[recipeId]) {
        setCompletedIngredients(progressData[recipeId].completedIngredients || []);
      }
    }
  }, [recipeId]);

  useEffect(() => {
    if (recipeId) {
      const progressData = {
        ...JSON.parse(localStorage.getItem('inProgressRecipes') || '{}'),
        [recipeId]: {
          completedIngredients,
        },
      };
      localStorage.setItem('inProgressRecipes', JSON.stringify(progressData));
    }
  }, [recipeId, completedIngredients]);

  useEffect(() => {
    const areAllIngredientsCompleted = getIngredients(trem[0])
      .every((ingredient) => completedIngredients.includes(ingredient));
    setAllIngredientsCompleted(areAllIngredientsCompleted);
  }, [trem, completedIngredients]);

  const handleIngredientClick = (ingredient: string) => {
    if (completedIngredients.includes(ingredient)) {
      setCompletedIngredients(completedIngredients.filter((item) => item !== ingredient));
    } else {
      setCompletedIngredients([...completedIngredients, ingredient]);
    }
  };

  const handleShare = () => {
    const link = `http://localhost:3000/meals/${recipeId}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000); // 1s.
  };

  const toggleFavorite = () => {
    const favoriteRecipes = JSON.parse(localStorage.getItem('favoriteRecipes') || '[]');
    const isFavorite = favoriteRecipes
      .some((r: any) => r.id === recipeId && r.type === 'meal');

    const { idMeal, strCategory, strMeal, strMealThumb, strArea } = trem[0];

    const newFavorite = {
      id: idMeal,
      type: 'meal',
      nationality: strArea,
      category: strCategory,
      alcoholicOrNot: '',
      name: strMeal,
      image: strMealThumb,
    };

    if (isFavorite) {
      const updatedFavorites = favoriteRecipes
        .filter((recipe: any) => !(recipe.id === recipeId && recipe.type === 'meal'));
      localStorage.setItem('favoriteRecipes', JSON.stringify(updatedFavorites));
    } else {
      localStorage
        .setItem('favoriteRecipes', JSON.stringify([...favoriteRecipes, newFavorite]));
    }

    setFavorite(!isFavorite);
  };

  // const navigate = useNavigate();
  // const HandleClick = () => {
  //   navigate('/done-recipes');
  // };
  const navigate = useNavigate();
  const HandleClick = () => {
    const doneRecipes = JSON.parse(localStorage.getItem('doneRecipes') ?? '') || [];
    const { idMeal, strCategory, strMeal, strMealThumb, strArea } = trem[0];
    const completedRecipe = {
      id: idMeal,
      type: 'meal',
      nationality: strArea,
      category: strCategory,
      alcoholicOrNot: '',
      name: strMeal,
      image: strMealThumb,
    };
    doneRecipes.push(completedRecipe);
    localStorage.setItem('doneRecipes', JSON.stringify(doneRecipes));
    navigate('/done-recipes');
  };

  return (
    <div>
      <img data-testid="recipe-photo" alt="foto" />
      <h1 data-testid="recipe-title">{}</h1>

      <div className="label-checkbox">
        {getIngredients(trem[0]).map((ingredient, index) => (
          <div key={ index }>
            <label
              data-testid={ `${index}-ingredient-step` }
              style={ { textDecoration: completedIngredients
                .includes(ingredient) ? 'line-through solid rgb(0, 0, 0)' : 'none' } }
            >
              <input
                type="checkbox"
                value={ ingredient }
                onClick={ () => handleIngredientClick(ingredient) }
                checked={ completedIngredients.includes(ingredient) }
              />
              {ingredient}
            </label>
          </div>
        ))}
      </div>

      <p data-testid="instructions">{}</p>
      {copied
            && <p>Link copied!</p>}
      <button
        data-testid="share-btn"
        onClick={ handleShare }
      >
        Compartilhar
      </button>

      <button onClick={ toggleFavorite }>
        {favorite ? (
          <img
            data-testid="favorite-btn"
            src={ blackHeartIcon }
            alt="whiteHeartIcon"
          />
        ) : (
          <img
            data-testid="favorite-btn"
            src={ whiteHeartIcon }
            alt="blackHeartIcon"
          />
        )}
      </button>

      <p data-testid="recipe-category">{}</p>
      <button
        data-testid="finish-recipe-btn"
        disabled={ !allIngredientsCompleted }
        onClick={ HandleClick }
      >
        Finalizar Receita
      </button>
    </div>
  );
}

export default MealsInProgress;
