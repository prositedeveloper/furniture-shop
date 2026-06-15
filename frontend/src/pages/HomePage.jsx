import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import ProductCard from "../components/ProductCard";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const productsRes = await api.get("/products/products/", {
          params: {
            page_size: 6, 
          },
        });
        setProducts(productsRes.data.results || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="container">
      <div className="home-page__hero">
        <h1 className="home-page__title">Добро пожаловать в Mebel_Dagestan</h1>
        <p className="home-page__subtitle">
          У нас вы найдете широчайший ассортимент мебели для вашего дома и
          офиса. Качественные материалы, современный дизайн и доступные цены.
        </p>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Загрузка товаров...</p>
        </div>
      ) : (
        <>
          {products.length > 0 ? (
            <div className="home-page__products-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="home-page__empty">
              <div className="home-page__empty-title">Товары не найдены</div>
              <p className="home-page__empty-text">
                Попробуйте позже.
              </p>
            </div>
          )}
        </>
      )}

      <div className="home-page__catalog-link-wrapper">
        <Link to="/catalog" className="btn btn-primary">
          Перейти в каталог
        </Link>
      </div>
    </div>
  );
}