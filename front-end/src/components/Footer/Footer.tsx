import { Link } from 'react-router-dom';
import imgDrink from '../../images/alcool.png'
import imgMeal from '../../images/burritos.png'

function Footer() {
  return (
    <nav>
      <footer data-testid="footer" className='footer'>
        <Link to="/drinks">
          <img
            id="alcool"
            src={ imgDrink }
            alt="icone de bebidas"
            data-testid="drinks-bottom-btn"
          />
        </Link>
        
        <Link to="/meals">
          <img
            id="cutlery"
            src={imgMeal}
            alt="icone de comidas"
            data-testid="meals-bottom-btn"
          />
        </Link>
      </footer>
    </nav>
  );
}

export default Footer;
