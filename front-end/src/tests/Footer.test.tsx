import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import Footer from '../components/Footer/Footer';

describe('testando Footer', () => {
  it('testa se existe o icone de bebidas na tela', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
    );

    const drinkIcon = screen.getByTestId('drinks-bottom-btn');
    expect(drinkIcon).toBeInTheDocument();
  });
  it('verifica se existe o icone de comidas na tela', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
    );

    const foodIcon = screen.getByTestId('meals-bottom-btn');
    expect(foodIcon).toBeInTheDocument();
  });
  it(`verifica se ao clicar no icone de bebida, 
  é redirecionado para a página /drinks`, () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>,
    );

    const drinkIcon = screen.getByTestId('drinks-bottom-btn');
    expect(drinkIcon).toBeInTheDocument();

    fireEvent.click(drinkIcon);
    expect(window.location.pathname).toBe('/drinks');
  });
  it(`verifica se ao clicar no icone de comida,
   é redirecionado pa a página /meals`, () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>,
    );

    const foodIcon = screen.getByTestId('meals-bottom-btn');
    expect(foodIcon).toBeInTheDocument();
    fireEvent.click(foodIcon);
    expect(window.location.pathname).toBe('/meals');
  });
});
