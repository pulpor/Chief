import { useContext, useEffect, useState, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import MealsContext from '../../../context/MealsContext';
import DrinksContext from '../../../context/DrinksContext';

import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";

import YouTube from 'react-youtube';

import { Drink, Meal } from '../../../utils/types';
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

function MealDetails() {
  const navigate = useNavigate();
  const { recipeId } = useParams();
  
  const { setMealsContext,
          mealsContext,
          setFavMeals,
          favMeals 
        } = useContext(MealsContext);

  const { drinks } = useContext(DrinksContext);
  const [recipe, setRecipe] = useState<Meal | null>(null);
  const [copied, setCopied] = useState(false);
  const [favorite, setFavorite] = useState(false);

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
    const favorites = JSON.parse(localStorage.getItem('favoriteRecipes') ?? '[]');
    setFavMeals(favorites);

    const isFavorite = favorites
      .some((favRecipe: { id: string }) => recipe && favRecipe.id === recipe.idMeal);

    setFavorite(isFavorite);
  }, [recipe, setFavMeals]);

  const settingsSlider = {
    infinite: true,
    speed: 500,
    autoplay: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false, 
  };

  const memoizedRecipeVideo = useMemo(() => {
    return <RecipeVideo strYoutube={recipe?.strYoutube ?? ''} />;
  }, [recipe?.strYoutube]);

  const textoFormatado = recipe?.strInstructions.replace(/\s*(\d+\.|STEP\s+\d+)\s*/g, '\n$1\n');
  console.log(textoFormatado);  

  return (
    <div className='containerDetails'>
      {recipe ? ( 
        <div className='containerDetailsNoNull'>

          <div className="containerImgPrincipal">
            <img
              id="principalDetail"
              src={ recipe.strMealThumb }
              alt={ recipe.strMeal }
              data-testid="recipe-photo"
            />
          </div>

          <h2 className='h2Details' data-testid="recipe-title">
            { recipe.strMeal}
          </h2>

          <p className='pDetails' data-testid="recipe-category">
            { recipe.strCategory }
          </p>

          <h3 className='h3Details'>Ingredientes:</h3>

          <div className='itensDetails'>

            {Object.keys(recipe)
              .filter((key) => key.includes('Ingredient') && recipe[key as keyof Meal])
                .map((key, index) => (
                  <div
                    className='liDetails'
                    key={key}
                    data-testid={`${index}-ingredient-name-and-measure`}
                  >
                    <b style={{ color: "#e75517" }}>x</b>
                    {'ㅤ'}
                    {recipe[key as keyof Meal]}
                    {' '}
                    -
                    {' '}
                    {recipe[`strMeasure${index + 1}` as keyof Meal]} 
                  </div>
                ))}


          </div>

          <h3 className='h3Details'>Instructions:</h3>

          <p className='p2Details' data-testid="instructions">
            { textoFormatado }
          </p>

        <div className="containerFundo">
          <button
            data-testid="start-recipe-btn"
            onClick={ HandleClick }
            className={`recipe-button btn-hover color-4 btnRecipe`}
          >
            Continue Recipe
          </button>
        </div>

          {memoizedRecipeVideo}
        
        <h3 className='h3Details2'>
          Accompaniment:
        </h3>

        <div className="container">
          <Slider {...settingsSlider}>

            {drinks.slice(0, 6).map((receita: Drink, index: number) => (
              
            <>
              <Link to={`/drinks/${receita.idDrink}`} key={receita.idDrink}>
                
                <div
                  className="recommendation-card"
                  data-testid={`${index}-recommendation-card`}
                  key={receita.idDrink}
                  id={String(index)}
                >
                  <div className="imagemCarouselContainer">
                    <img
                      src={receita.strDrinkThumb}
                      alt={receita.strDrink} 
                      id="sugestao"
                      className="slide-image" 
                    />
                  </div>

                </div>

              </Link>


              <div className="containerBarrinha">
                <div className="barrinhaInferior">

                  <Link className='linkDrinkRecommendation' to={`/drinks/${receita.idDrink}`} key={receita.idDrink}>
                    <span
                        data-testid={`${index}-recommendation-title`}
                        className='nameDrinkRecommendation'
                      >
                        {receita.strDrink}
                    </span>
                  </Link>

                    { copied && <span className="linkCopied">Link copied!</span> }

                    
                      <img src={ share } alt="" 
                        className="shareIcon"
                        data-testid="share-btn"
                        onClick={ handleShare }
                      />
                </div>
              </div>

            </>
            ))}

          </Slider>
        </div>

      </div>
      ) : (null) }

    </div>
  );
}

export default MealDetails;
