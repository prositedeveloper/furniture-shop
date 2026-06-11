import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    phone: "",
    password: "",
    password2: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.first_name.trim()) {
      toast.error("Введите имя");
      return false;
    }

    if (!formData.last_name.trim()) {
      toast.error("Введите фамилию");
      return false;
    }

    if (!formData.username.trim()) {
      toast.error("Введите имя пользователя");
      return false;
    }

    if (!formData.email.trim()) {
      toast.error("Введите email");
      return false;
    }

    if (!formData.phone.trim()) {
      toast.error("Введите телефон");
      return false;
    }

    if (!formData.password.trim()) {
      toast.error("Введите пароль");
      return false;
    }

    if (formData.password !== formData.password2) {
      toast.error("Пароли не совпадают");
      return false;
    }

    try {
      await register(formData);
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);
      return false;
    }
  };

  return (
    <div className="auth-register-page">
      <div className="auth-page-container">
        <div className="auth-page-title">Регистрация</div>
        <p className="auth-page-subtitle">Создайте новый аккаунт</p>

        <form onSubmit={handleSubmit} className="auth-page-form">
          <div className="auth-page-input-group">
            <label htmlFor="first_name" className="auth-page-input-group-label">
              Имя
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="auth-page-input-group-input"
            />
          </div>
          <div className="auth-page-input-group">
            <label htmlFor="last_name" className="auth-page-input-group-label">
              Фамилия
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="auth-page-input-group-input"
            />
          </div>
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
            <label htmlFor="email" className="auth-page-input-group-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="auth-page-input-group-input"
            />
          </div>

          <div className="auth-page-input-group">
            <label htmlFor="phone" className="auth-page-input-group-label">
              Телефон
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
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
                type={showPassword ? "text" : "password"}
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
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div className="auth-page-input-group">
            <label htmlFor="password2" className="auth-page-input-group-label">
              Подтвердите пароль
            </label>
            <div className="auth-page-input-group-password">
              <input
                type={showPassword ? "text" : "password"}
                id="password2"
                name="password2"
                value={formData.password2}
                onChange={handleChange}
                className="auth-page-input-group-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword2)}
                className="auth-page-input-group-password-toggle"
              >
                {showPassword2 ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="auth-page-btn">
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            ) : (
              <>
                <UserPlus className="h-5 w-5" />
                <span>Зарегистрироваться</span>
              </>
            )}
          </button>
        </form>

        <div className="auth-page-footer">
          <p>
            Уже есть аккаунт?{" "}
            <Link to="/login" className="auth-page-footer-link">
              Войти
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
