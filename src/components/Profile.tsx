import { useNavigate } from 'react-router-dom';

function Profile() {
  const navigate = useNavigate();
  const storedEmail = localStorage.getItem('user');

  const handleDoneRecipesClick = () => {
    navigate('/done-recipes');
  };

  const handleFavoriteRecipesClick = () => {
    navigate('/favorite-recipes');
  };

  const handleLogoutClick = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div>
      <h2>Profile</h2>

      <div>
        <p>
          Email:
          {' '}
          <span data-testid="profile-email">{storedEmail}</span>
        </p>
      </div>

      <button data-testid="profile-done-btn" onClick={ handleDoneRecipesClick }>
        Done Recipes
      </button>

      <button data-testid="profile-favorite-btn" onClick={ handleFavoriteRecipesClick }>
        Favorite Recipes
      </button>

      <button data-testid="profile-logout-btn" onClick={ handleLogoutClick }>
        Logout
      </button>

    </div>
  );
}

export default Profile;
