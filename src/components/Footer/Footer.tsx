import { Link } from 'react-router-dom';

function Footer() {
  return (
    <nav>
      <footer data-testid="footer" className='footer'>
        <Link to="/drinks">
          <img
            id="alcool"
            src="src/images/alcool.png"
            alt="icone de bebidas"
            data-testid="drinks-bottom-btn"
          />
        </Link>
        <Link to="./meals">
          <img
            id="cutlery"
            src="src/images/cutlery.png"
            alt="icone de comidas"
            data-testid="meals-bottom-btn"
          />
        </Link>
      </footer>
    </nav>
  );
}

export default Footer;
