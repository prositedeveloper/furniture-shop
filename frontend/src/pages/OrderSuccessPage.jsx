import { useLocation, Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const OrderSuccessPage = () => {
  const location = useLocation();
  const orderId = location.state?.orderId;

  return (
    <div
      className="container"
      style={{ textAlign: "center", padding: "60px 20px" }}
    >
      <CheckCircle size={80} color="#10b981" />
      <h1 style={{ marginTop: "20px" }}>Заказ успешно оформлен!</h1>
      {orderId && <p>Номер заказа: #{orderId}</p>}
      <p>Спасибо за покупку!</p>
      <Link to="/" className="btn btn-primary" style={{ marginTop: "20px" }}>
        Вернуться на главную
      </Link>
    </div>
  );
};

export default OrderSuccessPage;
