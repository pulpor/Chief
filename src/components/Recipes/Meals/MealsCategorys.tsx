import { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MealsContext from '../../../context/MealsContext';
import { Meal } from '../../../utils/types';

function MealsCategorys() {
  const { meals } = useContext(MealsContext);
  const [categories, setCategories] = useState<Meal[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredMeals, setFilteredMeals] = useState<Meal[]>([]);

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
          console.log('data', data);
          setFilteredMeals(data.meals.slice(0, 12));
        } catch (error) {
          console.error('Erro de fetching: ', error);
        }
      } else {
        setFilteredMeals(meals.slice(0, 12));
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

  return (
    <div>

      <div className="idCategorys">
        <div className="categorys">
          <div className="buttons">
            <button
              className='btn-hover color-4'
              onClick={ handleClearFilters }
              data-testid="All-category-filter"
            >
              All
            </button>
          </div>

          {categories.map((categoryName) => (
            <div className="buttons" key={categoryName.strCategory}>
              <button
                className='btn-hover color-4'
                data-testid={`${categoryName.strCategory}-category-filter`}
                onClick={() => handleCategoryClick(categoryName.strCategory)}
              >
                {categoryName.strCategory}
              </button>
            </div>
          ))}

          
        </div>
      </div>

      <div className="containerCategorys">
        {filteredMeals.map((meal, index) => (
          <Link 
            to={ `/meals/${meal.idMeal}` } 
            key={ meal.idMeal }
            style={{
              textDecoration: 'none', 
              color: 'inherit', 
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
    </div>
  );
}

export default MealsCategorys;
