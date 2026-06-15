import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import api from "../services/api";
import {
  ShoppingBag,
  MapPin,
  Phone,
  User,
  CreditCard,
  ChevronLeft,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";

const CheckoutPage = () => {
  const { user } = useAuth();
  const { cartItems: cartContextItems, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [formData, setFormData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: "",
    payment_method: "card",
    comment: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let items = [];
    let totalAmount = 0;

    if (location.state?.cartItems && location.state?.cartItems.length > 0) {
      items = location.state.cartItems;
      totalAmount = location.state.total;
    } else if (cartContextItems && cartContextItems.length > 0) {
      items = cartContextItems;
      totalAmount = cartContextItems.reduce(
        (sum, item) => sum + item.product.final_price * item.quantity,
        0,
      );
    }

    setCartItems(items);
    setTotal(totalAmount);

    if (items.length === 0) {
      toast.error("Корзина пуста");
      navigate("/cart");
    }
  }, [location.state, cartContextItems, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.error("Корзина пуста");
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        address: formData.address,
        phone: formData.phone,
        total: total,
        items: cartItems.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
        })),
      };

      const response = await api.post("/orders/orders/", orderData);

      console.log("Ответ сервера:", response.data);

      clearCart();
      toast.success("Заказ успешно оформлен!");
      navigate("/order-success", { state: { orderId: response.data.id } });
    } catch (error) {
      console.error("Ошибка при оформлении заказа:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-page__container">
        <button
          onClick={() => navigate("/cart")}
          className="checkout-page__back-btn"
        >
          <ChevronLeft className="checkout-page__back-icon" />
          Вернуться в корзину
        </button>

        <div className="checkout-page__header">
          <h1 className="checkout-page__title">Оформление заказа</h1>
          <p className="checkout-page__subtitle">
            Заполните данные для оформления заказа
          </p>
        </div>

        <div className="checkout-page__content">
          {/* Левая колонка: Данные покупателя */}
          <div className="checkout-page__customer-data">
            <div className="checkout-page__section">
              <h2 className="checkout-page__section-title">
                <User className="checkout-page__section-icon" />
                Данные покупателя
              </h2>

              <form onSubmit={handleSubmit} className="checkout-page__form">
                <div className="checkout-page__form-row">
                  <div className="checkout-page__form-group">
                    <label className="label">Имя</label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      className="input"
                      required
                    />
                  </div>
                  <div className="checkout-page__form-group">
                    <label className="label">Фамилия</label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      className="input"
                      required
                    />
                  </div>
                </div>

                <div className="checkout-page__form-group">
                  <label className="label">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </div>

                <div className="checkout-page__form-group">
                  <label className="label">Телефон</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </div>

                <div className="checkout-page__form-group">
                  <label className="checkout-page__address-label">
                    <MapPin className="checkout-page__address-icon" />
                    Адрес доставки
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="textarea"
                    placeholder="Улица, дом, квартира, город..."
                    required
                  />
                </div>

                <div className="checkout-page__form-group">
                  <label className="label">Комментарий к заказу</label>
                  <textarea
                    name="comment"
                    value={formData.comment}
                    onChange={handleChange}
                    className="textarea"
                    placeholder="Пожелания по доставке, время звонка и т.д."
                  />
                </div>

                <div className="checkout-page__form-group">
                  <label className="checkout-page__payment-label">
                    <CreditCard className="checkout-page__payment-icon" />
                    Способ оплаты
                  </label>
                  <div className="checkout-page__payment-options">
                    <label className="checkout-page__payment-option">
                      <input
                        type="radio"
                        name="payment_method"
                        value="card"
                        checked={formData.payment_method === "card"}
                        onChange={handleChange}
                        className="checkout-page__payment-radio"
                      />
                      <span className="checkout-page__payment-text">
                        Банковской картой
                      </span>
                    </label>
                    <label className="checkout-page__payment-option">
                      <input
                        type="radio"
                        name="payment_method"
                        value="cash"
                        checked={formData.payment_method === "cash"}
                        onChange={handleChange}
                        className="checkout-page__payment-radio"
                      />
                      <span className="checkout-page__payment-text">
                        Наличными при получении
                      </span>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg checkout-page__submit-btn"
                >
                  <Check className="checkout-page__submit-icon" />
                  Оформить заказ
                </button>
              </form>
            </div>
          </div>

          <div className="checkout-page__order-summary">
            <div className="checkout-page__summary-section">
              <h2 className="checkout-page__summary-title">
                <ShoppingBag className="checkout-page__summary-icon" />
                Ваш заказ
              </h2>

              <div className="checkout-page__summary-items">
                {cartItems.map((item) => (
                  <div key={item.id} className="checkout-page__summary-item">
                    <img
                      src={
                        item.product.image ||
                        "https://placehold.co/600x400?text=Нет картинки"
                      }
                      alt={item.product.title}
                      className="checkout-page__summary-item-image"
                    />
                    <div className="checkout-page__summary-item-info">
                      <h3 className="checkout-page__summary-item-title">
                        {item.product.title}
                      </h3>
                      <p className="checkout-page__summary-item-quantity">
                        {item.quantity} шт. × {item.product.final_price} ₽
                      </p>
                    </div>
                    <p className="checkout-page__summary-item-price">
                      {item.product.final_price * item.quantity} ₽
                    </p>
                  </div>
                ))}
              </div>

              <div className="checkout-page__summary-total">
                <div className="checkout-page__summary-row">
                  <span>
                    Товары (
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)})
                  </span>
                  <span>{total} ₽</span>
                </div>
                <div className="checkout-page__summary-row">
                  <span>Доставка</span>
                  <span>Бесплатно</span>
                </div>
                <div className="checkout-page__summary-row checkout-page__summary-row--total">
                  <span>Итог</span>
                  <span>{total} ₽</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
