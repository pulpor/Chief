import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import profileIcon from '../../images/pessoa.png';
import searchIcon from '../../images/lupa.png';
import SearchBar from './SearchBar';
import logo from '../../images/logo_head.png';
import burrito from '../../images/meats/burritos.png';

function Header() {
  const location = useLocation();
  const showSearchIcon = location.pathname.startsWith('/meals') || location.pathname.startsWith('/drinks');
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  const getTitle = () => {
    switch (location.pathname) {
      case '/meals':
        return 'Meals';
      case '/drinks':
        return 'Drinks';
      case '/profile':
        return 'Profile';
      case '/done-recipes':
        return 'Done Recipes';
      case '/favorite-recipes':
        return 'Favorite Recipes';
      default:
        return '';
    }
  };

  return (
    <header>
      <div className="Header">

        <Link to="/meals">
          <img src={ logo } id="logoChief" alt="logo principal" />
        </Link>


        <div className="iconesHeader">

          {showSearchIcon && (
            <div onClick={ toggleSearch } className='lupa'>
              <img
                data-testid="search-top-btn"
                id="lupa"
                src={ searchIcon }
                alt="Search Icon"
              />
            </div>
          )}

          <Link to="/profile">
            <img 
              data-testid="profile-top-btn" 
              id="userIcon"
              src={ profileIcon } 
              alt="Profile" 
            />
          </Link>
        </div>
      </div>
      
       {window.location.pathname === '/meals' && (
          <div className="logoContainerHeader">
          
              <img src={burrito} id="burrito" alt="burrito's logo" />
          
            <h1 className='page-title' data-testid="page-title">{getTitle()}</h1>
          </div> 
        )}


      <div className="searchCss">
        {isSearchVisible && (
          <SearchBar />
        )}
      </div>

    </header>
  );
}

export default Header;
