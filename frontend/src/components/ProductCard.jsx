import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <div className="product-card-image">
        <img
          src={
            product.image
              ? `http://localhost:8000${product.image}`
              : "/placeholder-product.jpg"
          }
          alt={product.title}
        />
        {product.discount > 0 && (
          <span className="product-card-discount">-{product.discount}%</span>
        )}
      </div>
      <div className="product-card-body">
        <h3 className="product-card-title">{product.title}</h3>
        <div className="product-card-price">
          {product.discount > 0 ? (
            <>
              <span className="product-card-price-current">{product.final_price} ₽</span>
              <span className="product-card-price-old">{product.price} ₽</span>
            </>
          ) : (
            <span className="product-card-price-current">{product.price} ₽</span>
          )}
        </div>
        <p className="product-card-description">{product.description}</p>
        <div className="product-card-actions">
          <Link to={`/products/${product.id}`} className="btn btn-outline btn-sm">
            Подробнее
          </Link>
          <button className="btn btn-primary btn-sm">
            <ShoppingCart className="h-4 w-4" />
            <span>В корзину</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
