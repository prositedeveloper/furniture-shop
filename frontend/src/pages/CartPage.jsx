import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Trash2, ArrowLeft } from "lucide-react";
import { useCart } from "../context/CartContext";

const CartPage = () => {
  const { cartItems, updateQuantity, removeItem, getTotal } = useCart();
  const navigate = useNavigate();
  const total = getTotal();

  const handleCheckout = () => {
    navigate('/checkout', {state: { cartItems, total }})
  };

  return (
    <div className="container">
      <div className="cart-page-header">
        <h1 className="cart-page-title">Корзина</h1>
        <Link to="/" className="cart-page-back-btn">
          <ArrowLeft className="h-5 w-5" />
          <span>Продолжить покупки</span>
        </Link>
      </div>

      {cartItems.length === 0 ? (
        <div className="cart-page-empty">
          <ShoppingCart className="cart-page-empty-icon" />
          <h3 className="cart-page-empty-title">Корзина пуста</h3>
          <p className="cart-page-empty-text">Добавьте товары в корзину, чтобы сделать заказ</p>
          <Link to="/" className="btn btn-primary">
            Перейти в каталог
          </Link>
        </div>
      ) : (
        <div className="cart-page-content">
          <div className="cart-page-items">
            <div className="cart-page-items-list">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-page-items-item">
                  <div className="cart-page-items-item-image">
                    <img 
                      src={item.product.image || 'https://placehold.co/600x400?text=Нет картинки'}
                      alt={item.product.title} 
                    />
                  </div>
                  <div className="cart-page-items-item-info">
                    <h3 className="cart-page-items-item-title">{item.product.title}</h3>
                    <p className="cart-page-items-item-price">{item.product.final_price} ₽</p>
                  </div>
                  <div className="cart-page-items-item-quantity">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="cart-page-items-item-quantity-btn"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="cart-page-items-item-quantity-value">
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="cart-page-items-item-quantity-btn"
                      disabled={item.quantity >= item.product.stock}
                    >
                      +
                    </button>
                  </div>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="cart-page-items-item-remove"
                  >
                    <Trash2 className="h-5 w-5" />  
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="cart-page-summary">
            <h2 className="cart-page-summary-title">Итог</h2>
            <div className="cart-page-summary-items">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-page-summary-items-item">
                  <span>
                    {item.product.title} x {item.quantity}
                  </span>
                  <span>{item.product.final_price * item.quantity} ₽</span>
                </div>
              ))}
            </div>
            <div className="cart-page-summary-total">
              <span>Итог:</span>
              <span>{total} ₽</span>
            </div>
            <button onClick={handleCheckout} className="cart-page-summary-btn">Оформить заказ</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;