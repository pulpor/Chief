import { screen, fireEvent, render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from '../components/Header/Header';

describe('Componente Header', () => {
  const PAGE_TITLE = 'page-title';
  const PROFILE_TOP_BTN = 'profile-top-btn';
  const SEARCH_TOP_BTN = 'search-top-btn';
  const SEARCH_INPUT = 'search-input';

  test('Testa título da página', () => {
    render(
      <MemoryRouter initialEntries={ ['/meals'] } initialIndex={ 0 }>
        <Header />
      </MemoryRouter>,
    );

    expect(screen.getByTestId(PAGE_TITLE)).toHaveTextContent('Meals');
  });

  test('Testa redirecionamento para a tela de perfil', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByTestId(PROFILE_TOP_BTN));
    expect(screen.getByTestId(PAGE_TITLE)).toHaveTextContent('Profile');
  });

  test('Testa título da página para "Drinks"', () => {
    render(
      <MemoryRouter initialEntries={ ['/drinks'] } initialIndex={ 0 }>
        <Header />
      </MemoryRouter>,
    );

    expect(screen.getByTestId(PAGE_TITLE)).toHaveTextContent('Drinks');
  });

  test('Testa se o botão de Search está funcionando corretamente', async () => {
    render(
      <MemoryRouter initialEntries={ ['/meals'] } initialIndex={ 0 }>
        <Header />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByTestId(SEARCH_TOP_BTN));

    await waitFor(() => {
      const searchBar = screen.getByTestId(SEARCH_INPUT);
      expect(searchBar).toBeInTheDocument();

      fireEvent.click(screen.getByTestId(SEARCH_TOP_BTN));
      expect(searchBar).not.toBeInTheDocument();
    });
  });

  test('Testa título da página para "profile', () => {
    render(
      <MemoryRouter initialEntries={ ['/profile'] } initialIndex={ 0 }>
        <Header />
      </MemoryRouter>,
    );

    expect(screen.getByTestId(PAGE_TITLE)).toHaveTextContent('Profile');
  });

  test('Testa título da página para "Done Recipes"', () => {
    render(
      <MemoryRouter initialEntries={ ['/done-recipes'] } initialIndex={ 0 }>
        <Header />
      </MemoryRouter>,
    );

    expect(screen.getByTestId(PAGE_TITLE)).toHaveTextContent('Done Recipes');
  });

  test('Testa título da página para "Favorite Recipes"', () => {
    render(
      <MemoryRouter initialEntries={ ['/favorite-recipes'] } initialIndex={ 0 }>
        <Header />
      </MemoryRouter>,
    );

    expect(screen.getByTestId(PAGE_TITLE)).toHaveTextContent('Favorite Recipes');
  });

  test('Testa exibição correta do ícone de busca', () => {
    render(
      <MemoryRouter initialEntries={ ['/meals'] } initialIndex={ 0 }>
        <Header />
      </MemoryRouter>,
    );

    const searchButton = screen.getByTestId(SEARCH_TOP_BTN);
    expect(searchButton).toBeInTheDocument();
  });

  test('Testa redirecionamento para a tela de busca', async () => {
    render(
      <MemoryRouter initialEntries={ ['/meals'] } initialIndex={ 0 }>
        <Header />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByTestId(SEARCH_TOP_BTN));

    // Aguarda até que o elemento da barra de pesquisa seja renderizado
    await waitFor(() => {
      const searchBar = screen.getByTestId(SEARCH_INPUT);
      expect(searchBar).toBeInTheDocument();

      // Simula a ação de fechar a barra de pesquisa
      fireEvent.click(screen.getByTestId(SEARCH_TOP_BTN));
      expect(searchBar).not.toBeInTheDocument();
    });
  });

  // Dentro do bloco 'describe' para 'Componente Header'
  test('Testa a função toggleSearch', () => {
    render(
      <MemoryRouter initialEntries={ ['/meals'] } initialIndex={ 0 }>
        <Header />
      </MemoryRouter>,
    );

    // Verifica que a barra de pesquisa não está visível inicialmente
    expect(screen.queryByTestId(SEARCH_INPUT)).not.toBeInTheDocument();

    // Clica no botão de pesquisa para abrir a barra
    fireEvent.click(screen.getByTestId(SEARCH_TOP_BTN));

    // Verifica que a barra de pesquisa está visível após o clique
    expect(screen.getByTestId(SEARCH_INPUT)).toBeInTheDocument();

    // Clica novamente no botão de pesquisa para fechar a barra
    fireEvent.click(screen.getByTestId(SEARCH_TOP_BTN));

    // Verifica que a barra de pesquisa não está mais visível
    expect(screen.queryByTestId(SEARCH_INPUT)).not.toBeInTheDocument();
  });

  test('Testa função getTitle()', () => {
    render(
      <MemoryRouter initialEntries={ ['/meals'] }>
        <Header />
      </MemoryRouter>,
    );

    const pageTitle = screen.getByTestId(PAGE_TITLE);
    expect(pageTitle).toHaveTextContent('Meals');
  });
});
