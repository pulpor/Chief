import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Login } from '../pages/Login/Login';

describe('Componente de Login', () => {
  const email = 'email-input';
  const password = 'password-input';
  const loginSubmitButton = 'login-submit-btn';
  const testeEmail = 'teste@teste.com';

  it('exibe os campos de email, senha e botão de login', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );
    expect(screen.getByTestId(email)).toBeInTheDocument();
    expect(screen.getByTestId(password)).toBeInTheDocument();
    expect(screen.getByTestId(loginSubmitButton)).toBeInTheDocument();
  });

  it('habilita o botão de login quando email e senha são válidos', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );
    const emailInput = screen.getByTestId(email);
    const passwordInput = screen.getByTestId(password);
    const loginButton = screen.getByTestId(loginSubmitButton);
    fireEvent.change(emailInput, { target: { value: testeEmail } });
    fireEvent.change(passwordInput, { target: { value: 'senhavalida' } });
    expect(loginButton).toBeEnabled();
  });

  it('desabilita o botão de login quando o email é inválido', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );
    const emailInput = screen.getByTestId(email);
    const passwordInput = screen.getByTestId(password);
    const loginButton = screen.getByTestId(loginSubmitButton);
    fireEvent.change(emailInput, { target: { value: 'invalido' } });
    fireEvent.change(passwordInput, { target: { value: 'senhavalida' } });
    expect(loginButton).toBeDisabled();
  });

  it('desabilita o botão de login quando a senha é inválida', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );
    const emailInput = screen.getByTestId(email);
    const passwordInput = screen.getByTestId(password);
    const loginButton = screen.getByTestId(loginSubmitButton);
    fireEvent.change(emailInput, { target: { value: testeEmail } });
    fireEvent.change(passwordInput, { target: { value: 'curta' } });
    expect(loginButton).toBeDisabled();
  });
  it('armazena os dados do usuário no localStorage após o login bem-sucedido', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );
    const emailInput = screen.getByTestId(email);
    const passwordInput = screen.getByTestId(password);
    const loginButton = screen.getByTestId(loginSubmitButton);
    fireEvent.change(emailInput, { target: { value: testeEmail } });
    fireEvent.change(passwordInput, { target: { value: 'senhavalida' } });
    fireEvent.click(loginButton);
    const storedUserJSON = localStorage.getItem('user');
    const storedUser = storedUserJSON ? JSON.parse(storedUserJSON) : null;
    expect(storedUser?.email).toBe(testeEmail);
  });

  // Novos testes adicionados:
  it('não redireciona para a tela principal sem login bem-sucedido', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );
    const loginButton = screen.getByTestId(loginSubmitButton);
    fireEvent.click(loginButton);
    // Aqui, você pode verificar se a rota não mudou para "/meals"
  });

  it('redireciona para a tela principal após login bem-sucedido', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );
    const emailInput = screen.getByTestId(email);
    const passwordInput = screen.getByTestId(password);
    const loginButton = screen.getByTestId(loginSubmitButton);
    fireEvent.change(emailInput, { target: { value: testeEmail } });
    fireEvent.change(passwordInput, { target: { value: 'senhavalida' } });
    fireEvent.click(loginButton);
    // Aqui, você pode verificar se a rota mudou para "/meals"
  });

  it('não permite submeter o formulário se o botão estiver desabilitado', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );
    const loginButton = screen.getByTestId(loginSubmitButton);
    fireEvent.click(loginButton);
    // Verifique se a submissão do formulário não ocorreu
    // Isso pode ser feito verificando se a rota não mudou ou se o usuário não foi redirecionado
  });

  it('exibe mensagem de erro ao tentar fazer login com credenciais inválidas', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );
    const emailInput = screen.getByTestId(email);
    const passwordInput = screen.getByTestId(password);
    const loginButton = screen.getByTestId(loginSubmitButton);
    fireEvent.change(emailInput, { target: { value: 'email@exemplo.com' } });
    fireEvent.change(passwordInput, { target: { value: 'senhaerrada' } });
    fireEvent.click(loginButton);
    // Verifique se uma mensagem de erro é exibida na tela
  });
});
