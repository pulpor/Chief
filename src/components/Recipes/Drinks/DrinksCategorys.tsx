import { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Drink } from '../../../utils/types';
import DrinksContext from '../../../context/DrinksContext';

function DrinksCategorys() {
  const { drinks } = useContext(DrinksContext);
  const [categories, setCategories] = useState<Drink[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredDrinks, setFilteredDrinks] = useState<Drink[]>([]);

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

  useEffect(() => {
    const fetchFilteredDrinks = async () => {
      if (selectedCategory) {
        try {
          const response = await fetch(
            `https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${selectedCategory}`,
          );
          const data = await response.json();
          setFilteredDrinks(data.drinks.slice(0, 12));
        } catch (error) {
          console.error('Erro de fetching: ', error);
        }
      } else {
        setFilteredDrinks(drinks.slice(0, 12));
      }
    };

    fetchFilteredDrinks();
  }, [selectedCategory, drinks]);

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
                key={ categoryName.strCategory }
                data-testid={ `${categoryName.strCategory}-category-filter` }
                onClick={ () => handleCategoryClick(categoryName.strCategory) }
              >
                {categoryName.strCategory}
              </button>
            </div>
          ))}

        </div>
      </div>

      <div className="containerCategorys">
        {filteredDrinks.map((drink, index) => (
          <Link 
            to={ `/drinks/${drink.idDrink}` } 
            key={ drink.idDrink }
            style={{
              textDecoration: 'none', 
              color: 'inherit', 
            }}>

          <div 
            data-testid={ `${index}-recipe-card` } 
            className="cardCategorys" 
            key={ drink.idDrink }>
              
              <img
                data-testid={ `${index}-card-img` }
                src={ drink.strDrinkThumb }
                alt={ drink.strDrink }
                className="cardImage"
              />

            <div className="containerh2">
              <h2 
                data-testid={ `${index}-card-name` }
                className="cardText"
                >
                  {drink.strDrink}
              </h2>

              
            </div>
          </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default DrinksCategorys;
