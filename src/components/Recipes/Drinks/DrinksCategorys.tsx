import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Drink } from '../../../tests/utils/types';
import DrinksContext from '../../../context/DrinksContext';

function DrinksCategorys() {
  const { drinks } = useContext(DrinksContext);
  const [categories, setCategories] = useState<Drink[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredDrinks, setFilteredDrinks] = useState<Drink[]>([]);

  // Carrega as 5 categorias iniciais
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          'https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list',
        );
        const data = await response.json();
        setCategories(data.drinks.slice(0, 5));
      } catch (error) {
        console.error('Erro de fetching: ', error);
      }
    };
    fetchCategories();
  }, []);

  // Filtra as receitas com base na categoria selecionada ou exibe todas as receitas
  useEffect(() => {
    const fetchFilteredDrinks = async () => {
      if (selectedCategory) {
        try {
          const response = await fetch(
            `https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${selectedCategory}`,
          );
          const data = await response.json();
          // se achar a categoria, puxa os 12 primeiros
          setFilteredDrinks(data.drinks.slice(0, 12));
        } catch (error) {
          console.error('Erro de fetching: ', error);
        }
      } else { // se não puxa os 12 primeiros de geral
        setFilteredDrinks(drinks.slice(0, 12));
      }
    };

    fetchFilteredDrinks();
  }, [selectedCategory, drinks]);

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
      <div>
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
      <div>
        {filteredDrinks.map((drink, index) => (
          <Link to={ `/drinks/${drink.idDrink}` } key={ drink.idDrink }>
            <div data-testid={ `${index}-recipe-card` } key={ drink.idDrink }>
              <h2 data-testid={ `${index}-card-name` }>{drink.strDrink}</h2>
              <img
                data-testid={ `${index}-card-img` }
                src={ drink.strDrinkThumb }
                alt={ drink.strDrink }
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default DrinksCategorys;
