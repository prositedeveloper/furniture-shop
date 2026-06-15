import { useState, useEffect } from 'react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { Search } from 'lucide-react';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          api.get('/products/products/', {
            params: {
              category_id: selectedCategory,
              search: searchQuery,
              page: currentPage,
              page_size: '6'
            },
          }),
          api.get('/products/categories/'),
        ]);
        setProducts(productsRes.data.results);
        setTotalPages(Math.ceil(productsRes.data.count / 12));
        setTotalProducts(productsRes.data.count);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedCategory, searchQuery]);

  return (
    <div className="container">
      <div className="home-page__hero">
        <h1 className="home-page__title">Добро пожаловать в Mebel_Dagestan</h1>
        <p className="home-page__subtitle">
          У нас вы найдете широчайший ассортимент мебели для вашего дома и офиса.
          Качественные материалы, современный дизайн и доступные цены.
        </p>
      </div>

      <div className="home-page__filters">
        <div className="home-page__search-wrapper">
          <Search className='home-page__search-icon' />
          <input 
            type="text"
            placeholder='Поиск товаров...' 
            className='home-page__search-input'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select 
          className="home-page__category-select"
          value={selectedCategory || ''}
          onChange={(e) => setSelectedCategory(e.target.value) || null}
        >
          <option value="">Все категории</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
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
              <p className="home-page__empty-text">Попробуйте изменить параметры поиска.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
} 