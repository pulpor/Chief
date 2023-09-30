import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import profileIcon from '../../images/profileIcon.svg';
import searchIcon from '../../images/searchIcon.svg';
import SearchBar from './SearchBar';
import logo from '../../images/logo.png';
import burrito from '../../images/meats/burritos.png';

function Header() {
  const location = useLocation();
  const showSearchIcon = ['/meals', '/drinks'].includes(location.pathname);
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

        <img src={ logo } alt="logo principal" />

        <div className="iconesHeader">

          {showSearchIcon && (
            <button onClick={ toggleSearch }>
              <img
                data-testid="search-top-btn"
                src={ searchIcon }
                alt="Search Icon"
              />
            </button>
          )}

          {isSearchVisible && (
            <SearchBar />
          )}

          <Link to="/profile">
            <img src={ profileIcon } alt="Profile" data-testid="profile-top-btn" />
          </Link>
        </div>
      </div>
      <div className="logoContainerHeader">
        <img src={ burrito } id="burrito" alt="burrito's logo" />
        <h1 data-testid="page-title">{getTitle()}</h1>
      </div>
    </header>
  );
}

export default Header;
