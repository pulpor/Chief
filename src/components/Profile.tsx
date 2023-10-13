import { useNavigate } from 'react-router-dom';

function Profile() {
  const navigate = useNavigate();
  const storedEmail = localStorage.getItem('user') as string;
  const user = JSON.parse(storedEmail);

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

      <div className="prof">
        <h2 id="profile">Profile</h2>
      </div>
  
      <div className="containerEmail">
        <p className="">
          Email:
          {' '}
          <span data-testid="profile-email" className="profileEmail">
            { user ? user.email : '' }
          </span>
        </p>
      </div>

      <div className="containerProfileBtn">
        <button 
          data-testid="profile-done-btn" 
          onClick={ handleDoneRecipesClick }
          className={`recipe-button btn-hover color-4 btnRecipe`}
        >
          Done Recipes
        </button>

        <button 
          data-testid="profile-favorite-btn" 
          onClick={ handleFavoriteRecipesClick }
          className={`recipe-button btn-hover color-4 btnRecipe`}
        >
          Favorite Recipes
        </button>

        <button 
          data-testid="profile-logout-btn" 
          onClick={ handleLogoutClick }
          className={`recipe-button btn-hover color-4 btnRecipe`}
        >
          Logout
        </button>
      </div>

    </div>
  );
}

export default Profile;