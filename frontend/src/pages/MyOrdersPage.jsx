import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { Package, XCircle, Clock, CheckCircle, Truck } from "lucide-react";
import toast from "react-hot-toast";

const MyOrdersPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const hasShownAuthError = useRef(false);
  const hasFetchedOrders = useRef(false);

  const isAuthenticated = !!user;

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      if (!hasShownAuthError.current) {
        hasShownAuthError.current = true;
        toast.error("Войдите в систему");
        navigate("/login");
      }
      return;
    }

    if (!hasFetchedOrders.current) {
      hasFetchedOrders.current = true;
      fetchOrders();
    }
  }, [isAuthenticated, authLoading, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get("/orders/orders/");
      console.log("Заказы:", response.data);
      setOrders(response.data.results || response.data);
    } catch (error) {
      console.error("Ошибка:", error);
      toast.error("Не удалось загрузить заказы");
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm("Отменить заказ?")) return;

    setCancellingId(orderId);
    try {
      await api.post(`/orders/orders/${orderId}/cancel/`);
      toast.success("Заказ отменен");
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: "cancelled" } : order,
        ),
      );
    } catch (error) {
      console.error("Ошибка отмены:", error);
      toast.error("Ошибка при отмене");
    } finally {
      setCancellingId(null);
    }
  };

  const getStatus = (status) => {
    const statuses = {
      pending: { text: "Ожидает", icon: Clock, color: "pending" },
      cancelled: { text: "Отменен", icon: XCircle, color: "cancelled" },
      delivered: { text: "Доставлен", icon: CheckCircle, color: "delivered" },
      processing: { text: "В обработке", icon: Truck, color: "processing" },
      shipped: { text: "Отправлен", icon: Truck, color: "shipped" },
    };
    const s = statuses[status] || statuses.pending;
    const Icon = s.icon;
    return { text: s.text, icon: Icon, color: s.color };
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatPrice = (price) => {
    return Number(price).toLocaleString("ru-RU") + " ₽";
  };

  if (authLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Проверка авторизации...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Загрузка заказов...</p>
      </div>
    );
  }

  return (
    <div className="my-orders-page">
      <div className="my-orders-page__container">
        <div className="my-orders-page__header">
          <h1 className="my-orders-page__title">Мои заказы</h1>
          <p className="my-orders-page__subtitle">{orders.length} заказ(ов)</p>
        </div>

        {orders.length === 0 ? (
          <div className="my-orders-page__empty">
            <Package className="my-orders-page__empty-icon" />
            <h3>У вас пока нет заказов</h3>
            <p>Перейдите в каталог, чтобы сделать первый заказ</p>
            <button
              onClick={() => navigate("/catalog")}
              className="btn btn-primary"
            >
              В каталог
            </button>
          </div>
        ) : (
          <div className="my-orders-page__orders-list">
            {orders.map((order) => {
              const status = getStatus(order.status);
              const StatusIcon = status.icon;

              return (
                <div key={order.id} className="my-orders-page__order-card">
                  <div className="my-orders-page__order-header">
                    <div>
                      <span className="my-orders-page__order-number">
                        Заказ #{order.id}
                      </span>
                      <span className="my-orders-page__order-date">
                        от {formatDate(order.created_at)}
                      </span>
                    </div>
                    <span
                      className={`my-orders-page__status my-orders-page__status--${status.color}`}
                    >
                      <StatusIcon size={14} />
                      {status.text}
                    </span>
                  </div>

                  <div className="my-orders-page__order-body">
                    <div className="my-orders-page__order-items">
                      {order.items?.map((item) => (
                        <div
                          key={item.id}
                          className="my-orders-page__order-item"
                        >
                          <img
                            src={
                              item.product?.image ||
                              "https://placehold.co/60x60?text=Нет"
                            }
                            alt={item.product?.title}
                            className="my-orders-page__item-image"
                          />
                          <div className="my-orders-page__item-info">
                            <h4>{item.product?.title}</h4>
                            <p>
                              {item.quantity} шт. ×{" "}
                              {formatPrice(
                                item.price || item.product?.final_price,
                              )}
                            </p>
                          </div>
                          <div className="my-orders-page__item-price">
                            {formatPrice(
                              (item.price || item.product?.final_price) *
                                item.quantity,
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="my-orders-page__order-footer">
                      <div className="my-orders-page__total">
                        <span>Итого:</span>
                        <strong>{formatPrice(order.total)}</strong>
                      </div>

                      {order.status !== "cancelled" &&
                        order.status !== "delivered" && (
                          <button
                            onClick={() => cancelOrder(order.id)}
                            disabled={cancellingId === order.id}
                            className="my-orders-page__cancel-btn"
                          >
                            {cancellingId === order.id
                              ? "Отмена..."
                              : "Отменить"}
                          </button>
                        )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;
