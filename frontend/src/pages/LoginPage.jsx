import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, LogIn } from "lucide-react";
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username.trim()) {
      toast.error('Введите имя пользователя');
      return false;
    }

    if (!formData.password.trim()) {
      toast.error('Введите пароль');
      return false;
    }

    try {
      await login(formData);
      navigate('/');
    } catch (error) {
      console.error('Login failed', error);
      return false;
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page-container">
        <div className="auth-page-title">Вход</div>
        <p className="auth-page-subtitle">Войдите в свой аккаунт</p>

        <form onSubmit={handleSubmit} className="auth-page-form">
          <div className="auth-page-input-group">
            <label htmlFor="username" className="auth-page-input-group-label">
              Имя пользователя
            </label>
            <input 
              type="text" 
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="auth-page-input-group-input"
              
            />
          </div>

          <div className="auth-page-input-group">
            <label htmlFor="password" className="auth-page-input-group-label">
              Пароль
            </label>
            <div className="auth-page-input-group-password">
              <input 
                type={showPassword ? 'text': 'password'} 
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="auth-page-input-group-input"
                
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="auth-page-input-group-password-toggle"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="auth-page-btn"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            ) : (
              <>
                <LogIn className="h-5 w-5" />
                <span>Войти</span>
              </>
            )}
          </button>
        </form>

        <div className="auth-page-footer">
          <p>
            Нет аккаунта?{' '}
            <Link to="/register" className="auth-page-footer-link">
              Зарегистрируйтесь
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
};

export default LoginPage;