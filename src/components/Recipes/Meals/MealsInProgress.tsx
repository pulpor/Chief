import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Meal } from '../../../utils/types';

import aberto from '../../../images/coracaoAberto.png'
import fechado from '../../../images/coracaoFechado.png'

import YouTube from 'react-youtube';
import share from '../../../images/share.png'

function RecipeVideo({ strYoutube }: { strYoutube: string }) {
  if (!strYoutube) {
    return null;
  }

  const videoId = strYoutube.split('v=')[1];
  const options = { 
    height: '250px',
    width: '100%'
  };

  return (
    <div className="youtubeContainer" data-testid="video">
      <YouTube className="youtube" videoId={videoId} opts={options} /> 
    </div>
  );
}

function MealsInProgress() {
  const { recipeId } = useParams();
  const [trem, setTrem] = useState<Meal[]>([]);
  console.log(trem);
  
  const [completedIngredients, setCompletedIngredients] = useState<string[]>([]);
  const [allIngredientsCompleted, setAllIngredientsCompleted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [favorite, setFavorite] = useState(false);

  const getIngredients = (meal: any) => {
    const ingredientsSet = new Set();
  
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal && meal[`strIngredient${i}`];
      if (ingredient) {
        ingredientsSet.add(ingredient);
      }
    }
  
    const uniqueIngredients = Array.from(ingredientsSet);  
    return uniqueIngredients;
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
        console.error('error: ', error);
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
        ...JSON.parse(localStorage.getItem('inProgressRecipes') ?? '{}'),
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
    const favoriteRecipes = JSON.parse(localStorage.getItem('favoriteRecipes') ?? '[]');
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

  const navigate = useNavigate();
  const regex = /\./g;

  const HandleClick = () => {
    const { idMeal, strCategory, strMeal, strMealThumb, strArea } = trem[0];

    const storedData = localStorage.getItem('doneRecipes');
    const doneRecipes = storedData ? JSON.parse(storedData) : [];

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

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();
    const formattedTime = currentDate.toLocaleTimeString();
  

    const finishRecipeDates = JSON.parse(localStorage.getItem('finishRecipeDates') || '[]');
    const finishRecipeTimes = JSON.parse(localStorage.getItem('finishRecipeTimes') || '[]');
  
    finishRecipeDates.push(formattedDate);
    finishRecipeTimes.push(formattedTime);
  
    localStorage.setItem('finishRecipeDates', JSON.stringify(finishRecipeDates));
    localStorage.setItem('finishRecipeTimes', JSON.stringify(finishRecipeTimes));
  

    navigate('/done-recipes');
};


  const handleFavoritre = () => {
    setFavorite(!favorite);
  };

  const strYoutube = trem[0]?.strYoutube ?? '';
  const memoizedRecipeVideo = useMemo(() => {
    return <RecipeVideo strYoutube={strYoutube} />;
  }, [strYoutube]);

  return (
    <div>

      {trem[0] ? (
        <>
          <div className="containerImgPrincipal" >
            
            <img 
              data-testid="recipe-photo" 
              alt="foto"
              id="principalDetail"
              src={trem[0].strMealThumb || ''}
            /> 

          </div>

          <h2 className='h2Details' data-testid="recipe-title">
            {trem[0].strMeal}
          </h2> 

          <p className='pDetails' data-testid="recipe-category">
              { trem[0].strCategory }
          </p>
        </>
       
      ) : (
        <p id="loading">Loading...</p>
      )}      

      <div className="containerLabel">
        <div className="label-checkbox">
          {getIngredients(trem[0]).map((ingredient, index) => (
            <div key={index}>
              <label
                htmlFor={`checkbox-${index}`}
                className="custom-checkbox-label"
                data-testid={`${index}-ingredient-step`}
              >
                <input
                  className="custom-checkbox"
                  type="checkbox"
                  id={`checkbox-${index}`}
                  value={ingredient}
                  onClick={() => handleIngredientClick(ingredient)}
                  checked={completedIngredients.includes(ingredient)}
                />
                {ingredient}
              </label>
            </div>
          ))}
        </div>
      </div>


      <h3 className='h3Details'>Instructions:</h3>
          <p className='p2Details' data-testid="instructions">
            { trem[0]?.strInstructions.replace(regex, '.\n') }
          </p>

          { memoizedRecipeVideo }

      <div className="lastIcons">
        <button
          className={`recipe-button btn-hover color-4 lstRecipe ${!allIngredientsCompleted ? 'disabled-button' : ''}`} 
          data-testid="finish-recipe-btn"
          disabled={ !allIngredientsCompleted }
          onClick={ HandleClick }
        >
          Finalizar Receita
        </button>

        <div className="sectionIcons">

          { copied && <span className="linkCopied">Link copied!</span> }

          <img src={ share } alt="share icon" 
              className="shareIcon"
              data-testid="share-btn"
              onClick={ handleShare }
            />

          <div onClick={ toggleFavorite }>
            {favorite ? (
                <div onClick={handleFavoritre} 
                className="botaoCoracao">
                  <img 
                            src={ aberto } 
                            alt="coração aberto"
                            id="abertoCoracao"/>
                </div>
              ) : (
                <div onClick={handleFavoritre} className="botaoCoracao">
                  <img 
                            src={ fechado } 
                            alt="coração fechado"
                            id="fechadoCoracao"/>
                </div>
            )}
          </div>

        </div>

      </div>
    
    </div>);
}

export default MealsInProgress;
