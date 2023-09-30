import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // Importe o MemoryRouter

import SearchBar from '../components/Header/SearchBar';

const SEARCH_INPUT = 'search-input';

describe('SearchBar Component', () => {
  it(' renderiza sem erros', () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <SearchBar />
      </MemoryRouter>,
    );
    const searchInput = getByTestId(SEARCH_INPUT);
    expect(searchInput).toBeInTheDocument();
  });

  it('atualiza a consulta quando o valor de entrada muda', () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <SearchBar />
      </MemoryRouter>,
    );
    const searchInput = getByTestId(SEARCH_INPUT) as HTMLInputElement;

    fireEvent.change(searchInput, { target: { value: 'test' } });
    expect(searchInput.value).toBe('test');
  });

  it('seleciona o botão de opção "Ingrediente" por padrão', () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <SearchBar />
      </MemoryRouter>,
    );
    const ingredientRadio = getByTestId('ingredient-search-radio');
    expect(ingredientRadio).toBeChecked();
  });

  it('permite alterar o tipo de pesquisa clicando nos botões de opção', () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <SearchBar />
      </MemoryRouter>,
    );
    const nameRadio = getByTestId('name-search-radio');
    const firstLetterRadio = getByTestId('first-letter-search-radio');

    fireEvent.click(nameRadio);
    expect(nameRadio).toBeChecked();

    fireEvent.click(firstLetterRadio);
    expect(firstLetterRadio).toBeChecked();
  });

  it('chama a função de pesquisa quando o botão "Pesquisar" é clicado', async () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <SearchBar />
      </MemoryRouter>,
    );
    const searchInput = getByTestId(SEARCH_INPUT) as HTMLInputElement;
    const searchButton = getByTestId('exec-search-btn');

    fireEvent.change(searchInput, { target: { value: 'test' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
    });
  });
});
