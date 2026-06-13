import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { ShoppingCart, Minus, Plus, Check } from "lucide-react";
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

const ProductPage = () => {
  const { id } = useParams();
  const { addToCart, isInCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const inCart = isInCart(Number(id));

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/products/${id}`);
        setProduct(response.data);
        setMainImage(response.data.image);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const changeMainImage = (imagePath, index) => {
    setMainImage(imagePath);
    setSelectedImageIndex(index);
  };

  const getAllImages = () => {
    const images = [];

    if (product?.image) {
      images.push({
        id: 'main',
        image: product.image,
        isMain: true
      });
    }

    if (product?.images?.length > 0) {
      images.push(...product.images.map(img => ({...img, isMain: false})));
    }

    return images;
  };

  const handleAddToCart = async () => {
    if (isAdding) return;

    if (inCart) {
      toast.error(`Товар "${product.title}" уже есть в корзине!`);
      return;
    }

    setIsAdding(true);
    await new Promise(resolve => setTimeout(resolve, 200));

    addToCart(product, quantity);
    toast.success(`Товар "${product.title}" добавлен в корзину в количестве ${quantity} шт.`)

    setTimeout(() => setShowSuccess(false), 200);

    setIsAdding(false);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Загрузка товара...</p>
      </div>
    );
  }

  if (!product) {
    <div className="home-page__empty">
      <div className="home-page__empty-title">Товар не найден</div>
      <p className="home-page__empty-text">
        Вернитесь на главную страницу
      </p>
    </div>;
  }

  const allImages = getAllImages();

  return (
    <div className="container">
      <div className="product-page-container">
        <div>
          <div className="product-page-image">
            <img 
              src={getImageUrl(mainImage || product.image)} 
              alt={product.title} 
              className="product-page-image-main"
            />
            {product.discount > 0 && (
              <span className="product-page-image-discount">-{product.discount}%</span>
            )}
          </div>
          {allImages.length > 0 && (
            <div className="product-page-image-gallery">
              {allImages.map((img, index) => (
                <div
                  key={img.id || index}
                  className={`product-page-image-gallery-item ${
                    selectedImageIndex === index ? 'active' : ''
                  }`}
                  onClick={() => changeMainImage(img.image, index)}
                >
                  <img 
                    src={getImageUrl(img.image)}
                    alt={`${product.title} - вид ${index + 1}`} 
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="product-page-info">
          <h1 className="product-page-info-title">{product.title}</h1>
          <div className="product-page-info-price">
            {product.discount > 0 ? (
              <>
                <span className="product-page-info-price-current">
                  {product.final_price}
                </span>
                <span className="product-page-info-price-old">
                  {product.price}
                </span>
              </>
            ) : (
              <span className="product-page-info-price-current">{product.price}</span>
            )}
          </div>

          <div className="product-page-info-section">
            <h3 className="product-page-info-section-title">Описание</h3>
            <p className="product-page-info-section-value">{product.description}</p>
          </div>

          <div className="product-page-info-section">
            <h3 className="product-page-info-section-title">Категория</h3>
            <p className="product-page-info-section-value">{product.category?.name}</p>
          </div>

          <div className="product-page-info-section">
            <h3 className="product-page-info-section-title">В наличии</h3>
            <p className={`product-page-info-stock ${product.stock > 0 ? '' : 'product-page-info-stock-out'}`}>
              {product.stock > 0 ? `${product.stock} шт.` : 'Нет в наличии'}
            </p>
          </div>

          <div className="product-page-info-quantity">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="product-page-info-quantity-btn"
              disabled={quantity <= 1}
            >
              <Minus className="h-5 w-5" />
            </button>
            <span className="product-page-info-quantity-value">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="product-page-info-quantity-btn"
              disabled={quantity >= product.stock}
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>

          <button 
            onClick={handleAddToCart}
            className="product-page-info-add-btn"
            disabled={product.stock <= 0 || isAdding}
          >
            <ShoppingCart className="h-5 w-5" />
            <span>Добавить в корзину</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
