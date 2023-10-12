import { useContext, useEffect, useState, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import DrinksContext from '../../../context/DrinksContext';
import MealsContext from '../../../context/MealsContext';

import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";

import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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

function DrinkDetails() {
  const navigate = useNavigate();
  const { recipeId } = useParams();

  const { setRecipeContext, 
          recipeContext, 
          setFavDrinks,
          favDrinks 
        } = useContext(DrinksContext);

  const { meals } = useContext(MealsContext);
  const [recipe, setRecipe] = useState<Drink | null>(null);
  const [copied, setCopied] = useState(false);
  const [favorite, setFavorite] = useState(false);


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
    const favorites = JSON.parse(localStorage.getItem('favoriteRecipes') ?? '[]');
    setFavDrinks(favorites);

    const isFavorite = favorites
      .some((favRecipe: { id: string }) => recipe && favRecipe.id === recipe.idDrink);
    
      setFavorite(isFavorite);
  }, [recipe, setFavDrinks]);

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

  return (
    <div className='containerDetails'>
      {recipe ? (
        <div className='containerDetailsNoNull'>

          <div className="containerImgPrincipal">
            <img id="principalDetail"
              src={ recipe.strDrinkThumb }
              alt={ recipe.strDrink }
              data-testid="recipe-photo"
            />
          </div>

          <h2 className='h2Details' data-testid="recipe-title">
            { recipe.strDrink}
          </h2>

          <p className='pDetails' data-testid="recipe-category">
            {recipe.strAlcoholic}
          </p>

          <h3 className='h3Details'>Ingredients:</h3>

          <div className='itensDetails'>

            {Object.keys(recipe)
              .filter((key) => key.includes('Ingredient') && recipe[key as keyof Drink])
                .map((key, index) => (
                  <div 
                    className='liDetails'
                    key={ key } 
                    data-testid={ `${index}-ingredient-name-and-measure` }
                  >
                    <b style={{ color: "#e75517" }}>x</b> {'ㅤ'}
                    {recipe[key as keyof Drink]}
                    {' '}
                    -
                    {' '}
                    {recipe[`strMeasure${index + 1}` as keyof Drink]} 
                  </div>
                ))}
          </div>

          <h3 className='h3Details'>Instructions:</h3>
          <p className='p2Details' data-testid="instructions">
            { recipe.strInstructions }
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
          Acompanhamento:
        </h3>


        <div className="container">
          <Slider {...settingsSlider}>

            {meals.slice(0, 6).map((receita: Meal, index: number) => (
              
            <>
              <Link to={`/meals/${receita.idMeal}`} key={receita.idMeal}>
                
                <div
                  className="recommendation-card"
                  data-testid={`${index}-recommendation-card`}
                  key={receita.idMeal}
                  id={String(index)}
                >
                  <div className="imagemCarouselContainer">
                    <img
                      src={receita.strMealThumb}
                      alt={receita.strMeal} 
                      id="sugestao"
                      className="slide-image" 
                    />
                  </div>

                </div>

              </Link>

              <div className="containerBarrinha">
                <div className="barrinhaInferior">

                  <Link className='linkDrinkRecommendation' to={`/drinks/${receita.idMeal}`} key={receita.idMeal}>
                    <span
                        data-testid={`${index}-recommendation-title`}
                        className='nameDrinkRecommendation'
                      >
                        {receita.strMeal}
                    </span>
                  </Link>

                    { copied && <p>Link copied!</p> }

                    <div className="agrupamentoRecommendation">
                      <img src={ share } alt="" 
                        className="shareIcon"
                        data-testid="share-btn"
                        onClick={ handleShare }
                      />

                      {favorite ? (
                          <div onClick={ handleFavoritre } 
                          className="botaoCoracao">
                            <FontAwesomeIcon
                              icon={faHeartSolid}
                              data-testid="favorite-btn"
                              color="red" 
                            />
                          </div>
                        ) : (
                          <div onClick={handleFavoritre} className="botaoCoracao">
                            <FontAwesomeIcon
                              icon={faHeartRegular}
                              data-testid="favorite-btn"
                              color="black"
                            />
                          </div>
                      )}
                    </div>
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

export default DrinkDetails;
