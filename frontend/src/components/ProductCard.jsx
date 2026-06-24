import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Check } from "lucide-react";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

const getImageUrl = (imagePath) => {
  if (!imagePath) return "https://placehold.co/600x400?text=Нет картинки";

  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  const baseUrl = 'http://localhost:8000';

  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;

  return `${baseUrl}${cleanPath}`;
};

const ProductCard = ({ product }) => {
  const { addToCart, isInCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const inCart = isInCart(product.id);

  const handleAddToCart = async () => {
    if (isAdding) return;

    if (inCart) {
      toast.error(`Товар "${product.title}" уже есть в корзине!`);
      return;
    }

    setIsAdding(true);

    await new Promise(resolve => setTimeout(resolve, 200));

    const isAdded = addToCart(product, 1);
    if (isAdded) {
      toast.success(`Товар "${product.title}" добавлен в корзину`);
    }
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 1500);

    setIsAdding(false);
  };

  return (
    <div className="product-card">
      <div className="product-card-image">
        <img
          src={getImageUrl(product.image)}
          alt={product.title}
          onError={(e) => {
            console.error('Failed to load:', e.target.src);
            e.target.src = "https://placehold.co/600x400?text=Нет картинки"
          }}
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
          <button 
            onClick={handleAddToCart}
            className="btn btn-primary btn-sm"
            disabled={isAdding}
          >
            <ShoppingCart className="h-4 w-4" />
            <span>В корзину</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
