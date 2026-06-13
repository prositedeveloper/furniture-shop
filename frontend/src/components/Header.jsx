import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShoppingCart, User, LogIn, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "../context/CartContext";

const Header = () => {
  const { getTotalCount } = useCart();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const cartItemCount = getTotalCount();

  return (
    <div className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          Mebel_Dagestan
        </Link>

        <nav className="header-nav">
          <Link to="/" className="header-nav-link">Главная</Link>
          <Link to="/products" className="header-nav-link">Каталог</Link>   
          {user?.is_staff && (
            <Link to="/admin" className="header-nav-link">Админка</Link>
          )}    
        </nav>

        <div className="header-actions">
          <Link to="/cart" className="header-cart">
            <ShoppingCart className="h-6 w-6" />
            {cartItemCount > 0 && (
              <span className="header-cart-count">{cartItemCount}</span>
            )}
          </Link>

          {user ? (
            <>
              <Link to="/profile" className="header-user">
                <User className="w-6 h-6" />
                <span className="header-user-name">{user.username}</span>
              </Link>
              <button onClick={logout} className="btn btn-outline btn-sm">
                <LogOut className="h-5 w-5" />
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">
              <LogIn className="h-5 w-5" />
            </Link>
          )}

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="header-menu-btn">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        <div className={`header-mobile-menu ${isMenuOpen ? 'header-mobile-menu-active' : ''}`}>
          <nav className="header-mobile-menu-nav">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="header-nav-link">
              Главная
            </Link>
            <Link to="/products" onClick={() => setIsMenuOpen(false)} className="header-nav-link">
              Каталог
            </Link>
            {user?.is_staff && (
              <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="header-nav-link">
                Админка
              </Link>
            )}
            {user ? (
             <>
              <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="header-nav-link">
                Профиль
              </Link>
              <button onClick={() => {logout(); setIsMenuOpen(false)}} className="header-nav-link">
                Выйти
              </button>
             </> 
            ) : (
              <Link to="/login" onClick={() => setIsMenuOpen(false)} className="header-nav-link">
                Войти
              </Link>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Header;
