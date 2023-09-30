import { Link } from 'react-router-dom';

function Footer() {
  return (
    <nav>
      <footer data-testid="footer">
        <Link to="/drinks">
          <img
            src="src/images/drinkIcon.svg"
            alt="icone de bebidas"
            data-testid="drinks-bottom-btn"
          />
        </Link>
        <Link to="./meals">
          <img
            src="src/images/mealIcon.svg"
            alt="icone de comidas"
            data-testid="meals-bottom-btn"
          />
        </Link>
      </footer>
    </nav>
  );
}

export default Footer;
