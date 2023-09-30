/* eslint-disable react/jsx-key */
import { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MealsContext from '../../../context/MealsContext';
import { Meal } from '../../../tests/utils/types';

function MealsCategorys() {
  const { meals } = useContext(MealsContext);
  const [categories, setCategories] = useState<Meal[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredMeals, setFilteredMeals] = useState<Meal[]>([]);

  // Carrega as categorias no carregamento inicial
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

  // Filtra as receitas com base na categoria selecionada ou exibe todas as receitas
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
      setSelectedCategory(null); // Limpa o filtro
    } else {
      setSelectedCategory(category); // Aplica o filtro
    }
  };

  const handleClearFilters = () => {
    setSelectedCategory(null);
  };

  return (
    <div>
      <div className="idCategorys">
        <div className="categorys">
          <button
            onClick={ handleClearFilters }
            data-testid="All-category-filter"
          >
            All
          </button>

          {categories.map((categoryName) => (
            <button
              key={ categoryName.strCategory }
              data-testid={ `${categoryName.strCategory}-category-filter` }
              onClick={ () => handleCategoryClick(categoryName.strCategory) }
            >
              {categoryName.strCategory}

            </button>
          ))}
        </div>
      </div>
      <div className="containerCategorys">
        {filteredMeals.map((meal, index) => (
          <Link to={ `/meals/${meal.idMeal}` } key={ meal.idMeal }>
            <div data-testid={ `${index}-recipe-card` } className="cardCategorys">

              <img
                className="cardImage"
                data-testid={ `${index}-card-img` }
                src={ meal.strMealThumb }
                alt={ meal.strMeal }
              />

              <h2
                className="cardText"
                data-testid={ `${index}-card-name` }
              >
                {meal.strMeal}

              </h2>

            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default MealsCategorys;
