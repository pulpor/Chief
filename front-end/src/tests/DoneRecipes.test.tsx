import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, BrowserRouter as Router } from 'react-router-dom';
import { vi } from 'vitest';
import DoneRecipes from '../components/Recipes/DoneRecipes';

// Mock localStorage para fornecer o estado atual do doneRecipes
beforeEach(() => {
  const doneRecipes = [
    {
      id: '53060',
      type: 'meal',
      nationality: 'Croatian',
      category: 'Side',
      alcoholicOrNot: '',
      name: 'Burek',
      image: 'https://www.themealdb.com/images/media/meals/tkxquw1628771028.jpg',
    },
  ];
  localStorage.setItem('doneRecipes', JSON.stringify(doneRecipes));
});

// Limpa o localStorage após cada teste
afterEach(() => {
  localStorage.removeItem('doneRecipes');
});

test('renderiza o componente DoneRecipes corretamente', () => {
  render(
    <Router>
      <DoneRecipes />
    </Router>,
  );

  // Verifique se os botões de filtro estão presentes
  const allButton = screen.getByTestId('filter-by-all-btn');
  const mealButton = screen.getByTestId('filter-by-meal-btn');
  const drinkButton = screen.getByTestId('filter-by-drink-btn');
  expect(allButton).toBeInTheDocument();
  expect(mealButton).toBeInTheDocument();
  expect(drinkButton).toBeInTheDocument();
});

test('os botões de filtro funcionam corretamente', () => {
  render(
    <Router>
      <DoneRecipes />
    </Router>,
  );

  // Verifique se a receita está presente no componente
  const recipeName = screen.getByText('Burek');
  expect(recipeName).toBeInTheDocument();

  // Encontre e clique no botão "All"
  const allButton = screen.getByTestId('filter-by-all-btn');
  fireEvent.click(allButton);
});

test('teste a copia do link', async () => {
  const clipboard = {
    writeText: vi.fn(),
  };

  Object.assign(global.navigator, {
    clipboard,
  });

  render(
    <MemoryRouter>
      <DoneRecipes />
    </MemoryRouter>,
  );

  // Simule um clique no botão de compartilhamento
  fireEvent.click(screen.getByTestId('0-horizontal-share-btn'));

  const expectedURL = 'http://localhost:3000/meals/53060';
  expect(clipboard.writeText).toHaveBeenCalledWith(expectedURL);

  // estado copy foi definido como true
  expect(screen.getByText('Link copied!')).toBeInTheDocument();

  // estado de copy foi definido como false
  await waitFor(() => {
    expect(screen.queryByText('Link copied!')).toBeNull();
  });
});

// const FILTER_STATUS = '#filter-status';

// test('testa a função setFilter', () => {
//   const { container } = render(
//     <Router>
//       <DoneRecipes />
//     </Router>,
//   );
//   const allButton = screen.getByTestId('filter-by-all-btn');
//   const mealButton = screen.getByTestId('filter-by-meal-btn');
//   const drinkButton = screen.getByTestId('filter-by-drink-btn');

//   // Inicialmente, o filtro deve ser nulo
//   expect(container.querySelector(FILTER_STATUS)).toHaveTextContent(' null');

//   // Clique no botão "Meals" e verifique se o filtro foi definido como 'meal'
//   fireEvent.click(mealButton);
//   expect(container.querySelector(FILTER_STATUS)).toHaveTextContent('Filtro: meal');

//   // Clique no botão "Drinks" e verifique se o filtro foi definido como 'drink'
//   fireEvent.click(drinkButton);
//   expect(container.querySelector(FILTER_STATUS)).toHaveTextContent('Filtro: drink');

//   // Clique no botão "All" e verifique se o filtro foi limpo (nulo)
//   fireEvent.click(allButton);
//   expect(container.querySelector(FILTER_STATUS)).toHaveTextContent('Filtro: null');
// });
