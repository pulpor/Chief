import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import Profile from '../components/Profile';

// Funções auxiliares para criar seletores com base em identificadores
function createTestSelector(identifier: any) {
  return `profile-${identifier}`;
}

describe('Componente Profile', () => {
  const DONE_BTN = 'done-btn';
  const FAVORITE_BTN = 'favorite-btn';
  const LOGOUT_BTN = 'logout-btn';

  // Função auxiliar para obter elementos com base nos identificadores
  const getTestElement = (identifier: string) => screen.getByTestId(createTestSelector(identifier));

  it('exibe o email armazenado', () => {
    const emailArmazenado = 'exemplo@exemplo.com';
    localStorage.setItem('user', JSON.stringify({ email: emailArmazenado }));

    render(<Profile />, { wrapper: MemoryRouter });

    const elementoEmail = getTestElement('email');
    expect(elementoEmail).toHaveTextContent(emailArmazenado);
  });

  it('redireciona para a página de Receitas Feitas ao clicar no botão de Receitas Feitas', () => {
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>,
    );

    const botaoDoneRecipes = getTestElement(DONE_BTN);
    fireEvent.click(botaoDoneRecipes);

    // Verifique se o histórico de navegação contém a rota esperada
    expect(window.location.pathname).toBe('/done-recipes');
  });

  it('redireciona para a página de Receitas Favoritas ao clicar no botão de Receitas Favoritas', () => {
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>,
    );

    const botaoFavoriteRecipes = getTestElement(FAVORITE_BTN);
    fireEvent.click(botaoFavoriteRecipes);
    expect(window.location.pathname).toBe('/favorite-recipes');
  });

  it('redireciona para a página de login ao clicar no botão de Logout', () => {
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>,
    );

    const botaoLogout = getTestElement(LOGOUT_BTN);
    fireEvent.click(botaoLogout);

    // Verifique se o localStorage foi limpo
    expect(localStorage.getItem('user')).toBeNull();

    // Verifique se o redirecionamento ocorreu
    expect(window.location.pathname).toBe('/');
  });

  it('exibe um email vazio quando não há email armazenado', () => {
    localStorage.clear();

    render(<Profile />, { wrapper: MemoryRouter });

    const elementoEmail = getTestElement('email');
    expect(elementoEmail).toHaveTextContent('');
  });

  it('exibe os botões de Done Recipes, Favorite Recipes e Logout', () => {
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>,
    );

    const botaoDoneRecipes = getTestElement(DONE_BTN);
    const botaoFavoriteRecipes = getTestElement(FAVORITE_BTN);
    const botaoLogout = getTestElement(LOGOUT_BTN);

    expect(botaoDoneRecipes).toBeInTheDocument();
    expect(botaoFavoriteRecipes).toBeInTheDocument();
    expect(botaoLogout).toBeInTheDocument();
  });

  it('exibe o título "Profile"', () => {
    render(<Profile />, { wrapper: MemoryRouter });

    const tituloProfile = screen.getByText('Profile');
    expect(tituloProfile).toBeInTheDocument();
  });

  it('não redireciona ao clicar nos botões quando o email não está armazenado', () => {
    localStorage.clear();

    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>,
    );

    const botaoDoneRecipes = getTestElement(DONE_BTN);
    const botaoFavoriteRecipes = getTestElement(FAVORITE_BTN);
    const botaoLogout = getTestElement(LOGOUT_BTN);

    fireEvent.click(botaoDoneRecipes);
    fireEvent.click(botaoFavoriteRecipes);
    fireEvent.click(botaoLogout);

    // Verifique se o redirecionamento não ocorreu
    expect(window.location.pathname).toBe('/');
  });
});

it('redireciona para a página de login após Logout e limpar localStorage', async () => {
  const emailArmazenado = 'exemplo@exemplo.com';
  localStorage.setItem('user', JSON.stringify({ email: emailArmazenado }));

  render(
    <BrowserRouter>
      <Profile />
    </BrowserRouter>,
  );

  // Localize e clique no botão de logout
  const botaoLogout = screen.getByTestId(createTestSelector('logout-btn'));
  fireEvent.click(botaoLogout);

  await waitFor(() => {
    // Verifique se o localStorage foi limpo
    expect(localStorage.getItem('user')).toBeNull();

    // Verifique se o redirecionamento ocorreu
    expect(window.location.pathname).toBe('/');
  });
});
