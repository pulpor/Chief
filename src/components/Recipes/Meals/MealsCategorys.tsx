import { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MealsContext from '../../../context/MealsContext';
import { Meal } from '../../../utils/types';

import all from "../../../images/meat/all.svg"
import Beef from "../../../images/meat/beef.svg";
import Chicken from "../../../images/meat/chicken.svg";
import Breakfast from "../../../images/meat/breakfast.svg";
import Dessert from "../../../images/meat/dessert.svg";
import Goat from "../../../images/meat/goat.svg";

function MealsCategorys() {
  const { meals } = useContext(MealsContext);
  const [categories, setCategories] = useState<Meal[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredMeals, setFilteredMeals] = useState<Meal[]>([]);
  
  const itemsPerPage = 12;
  const [startIndex, setStartIndex] = useState(1)
  
  const handleButtonClick = () => {
    setStartIndex(startIndex + itemsPerPage)
  }

  const handleButtonClick2 = () => {
    if (startIndex > 12) {
      setStartIndex(startIndex - itemsPerPage);
    }
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          'https://www.themealdb.com/api/json/v1/1/list.php?c=list',
        );
        const data = await response.json();
        setCategories(data.meals.slice(0, 5));
      } catch (error) {
        console.error('Erro de fetching: ', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchFilteredMeals = async () => {
      if (selectedCategory) {
        try {
          const response = await fetch(
            `https://www.themealdb.com/api/json/v1/1/filter.php?c=${selectedCategory}`,
          );
          const data = await response.json();
          setFilteredMeals(data.meals);
        } catch (error) {
          console.error('Erro de fetching: ', error);
        }
      } else {
        setFilteredMeals(meals);
      }
    };

    fetchFilteredMeals();
  }, [meals, selectedCategory]);

  const handleCategoryClick = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory(null); // limpa o filtro
    } else {
      setSelectedCategory(category); // aplica o filtro
    }
  };

  const handleClearFilters = () => {
    setSelectedCategory(null);
  };

  const categoryImageMap: Record<string, string> = {
    Beef,
    Chicken,
    Breakfast,
    Dessert,
    Goat,
  };

  return (
    <div>

      <div className="idCategorys">
        <div className="categorys">
          <div className="buttons">
            <button
              
              onClick={ handleClearFilters }
              data-testid="All-category-filter"
            >
              <img src={ all } title="All"/>
            </button>
          </div>

          {categories.map((categoryName) => (
          <div className="buttons" key={categoryName.strCategory}>
            <button
              data-testid={`${categoryName.strCategory}-category-filter`}
              onClick={() => handleCategoryClick(categoryName.strCategory)}
            >
              {categoryImageMap[categoryName.strCategory] && (
              <img
                src={categoryImageMap[categoryName.strCategory]}
                alt={categoryName.strCategory}
                title={categoryName.strCategory}
              />
            )}            
            </button>            
          </div>
        ))}
        </div>
      </div>

      <div className="containerCategorys">
      {filteredMeals.slice(startIndex, startIndex + itemsPerPage).map((meal, index) => (
          <Link 
            to={ `/meals/${meal.idMeal}` } 
            key={ meal.idMeal }
            style={{
              textDecoration: 'none',
            }}>
            
            <div data-testid={ `${index}-recipe-card` } className="cardCategorys">

              <img
                className="cardImage"
                data-testid={ `${index}-card-img` }
                src={ meal.strMealThumb }
                alt={ meal.strMeal }
              />
              
              <div className="containerh2">
                <h2
                  className="cardText"
                  data-testid={ `${index}-card-name` }
                >
                  {meal.strMeal}

                </h2>
              </div>

            </div>
          </Link>
        ))}
      </div>

      <div className="containerButtonCategorys">

        <button
          onClick={handleButtonClick2}
          data-testid="see-previous-button"
          className="recipe-button btn-hover color-4 btnRecipe"
          style={{ opacity: startIndex <= 12 ? 0.6 : 1 }}
        >
          Previous
        </button>

        <button 
          onClick={handleButtonClick}
          data-testid="see-more-button"
          className={`recipe-button btn-hover color-4 btnRecipe`}
          >
          Next
        </button>
      </div>

    </div>
  );
}

export default MealsCategorys;
