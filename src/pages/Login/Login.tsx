import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isValidEmailValue, setIsValidEmailValue] = useState(false);
  const [isValidPassword, setIsValidPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = () => {
    localStorage.setItem('user', JSON.stringify({ email }));
    navigate('/meals');
  };

  const isValidEmail = (user:string): boolean => {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(user);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = event.target.value;
    setEmail(newEmail);
    setIsValidEmailValue(isValidEmail(newEmail));
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    setIsValidPassword(newPassword.length > 6);
  };

  return (
    <div className="containerLogin">
      <div className="loginInputs">
        <input
          data-testid="email-input"
          className="inputLogin"
          type="email"
          placeholder="email@exemplo.com"
          value={ email }
          onChange={ handleEmailChange }
        />
        <input
          data-testid="password-input"
          className="inputLogin"
          type="password"
          placeholder="Digite sua senha"
          value={ password }
          onChange={ handlePasswordChange }
        />
        <button
          className="buttonLogin"
          data-testid="login-submit-btn"
          disabled={ !isValidEmailValue || !isValidPassword }
          onClick={ handleSubmit }
        >
          Login

        </button>
      </div>
    </div>
  );
}
