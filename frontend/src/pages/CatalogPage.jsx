import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";

export default function CatalogPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [inStock, setInStock] = useState(false);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const params = {
          page: currentPage,
          page_size: 9,
          category_id: selectedCategory || undefined,
          search: searchQuery || undefined,
          min_price: minPrice || undefined,
          max_price: maxPrice || undefined,
          in_stock: inStock || undefined,
          ordering: sortOrder === "asc" ? sortBy : `-${sortBy}`,
        };

        Object.keys(params).forEach((key) => {
          if (params[key] === undefined || params[key] === "") {
            delete params[key];
          }
        });

        const [productsRes, categoriesRes] = await Promise.all([
          api.get("/products/products/", { params }),
          api.get("/products/categories/"),
        ]);

        setProducts(productsRes.data.results || productsRes.data);
        setCategories(categoriesRes.data);

        const PAGE_SIZE = 9;
        const calculatedTotalPages = Math.ceil(
          productsRes.data.count / PAGE_SIZE,
        );
        setTotalPages(calculatedTotalPages || 1);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [
    currentPage,
    selectedCategory,
    searchQuery,
    minPrice,
    maxPrice,
    inStock,
    sortBy,
    sortOrder,
  ]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetFilters = () => {
    setSelectedCategory(null);
    setSearchQuery("");
    setMinPrice("");
    setMaxPrice("");
    setInStock(false);
    setSortBy("created_at");
    setSortOrder("desc");
    setCurrentPage(1);
  };

  return (
    <div className="catalog-page">
      <div className="catalog-page__container">
        <div className="catalog-page__header">
          <h1 className="catalog-page__title">Каталог мебели</h1>
          <p className="catalog-page__subtitle">
            Найдите идеальную мебель для вашего дома с помощью наших фильтров.
          </p>
        </div>

        {/* Фильтры */}
        <div className="catalog-page__filters">
          <div className="catalog-page__filters-header">
            <h2 className="catalog-page__filters-title">
              <Filter className="catalog-page__filters-icon" />
              Фильтры
            </h2>
            <button onClick={resetFilters} className="btn btn-outline btn-sm">
              Сбросить фильтры
            </button>
          </div>

          <div className="catalog-page__filters-grid">
            <div className="catalog-page__filter-group">
              <label className="label">Категория</label>
              <select
                className="select"
                value={selectedCategory || ""}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
              >
                <option value="">Все категории</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="catalog-page__filter-group">
              <label className="label">Поиск</label>
              <div className="catalog-page__search-wrapper">
                <Search className="catalog-page__search-icon" />
                <input
                  type="text"
                  placeholder="Название товара..."
                  className="input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="catalog-page__filter-group">
              <label className="label">Цена от (₽)</label>
              <input
                type="number"
                placeholder="Min"
                className="input"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </div>

            <div className="catalog-page__filter-group">
              <label className="label">Цена до (₽)</label>
              <input
                type="number"
                placeholder="Max"
                className="input"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>

            <div className="catalog-page__filter-group">
              <label className="label">Сортировка</label>
              <select
                className="select mb-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="created_at">По дате добавления</option>
                <option value="price">По цене</option>
                <option value="discount">По скидке</option>
                <option value="title">По названию</option>
              </select>
            </div>

            <div className="catalog-page__filter-group">
              <div className="catalog-page__filter-group catalog-page__filter-group--checkbox">
                <label className="catalog-page__checkbox-label">
                  <input
                    type="checkbox"
                    checked={inStock}
                    onChange={(e) => setInStock(e.target.checked)}
                    className="catalog-page__checkbox-input"
                  />
                  <span className="catalog-page__checkbox-text">
                    Только в наличии
                  </span>
                </label>
              </div>
              <div className="catalog-page__sort-buttons">
                <button
                  onClick={() => setSortOrder("asc")}
                  className={`btn btn-sm ${sortOrder === "asc" ? "btn-primary" : "btn-outline"}`}
                >
                  По убыванию
                </button>
                <button
                  onClick={() => setSortOrder("desc")}
                  className={`btn btn-sm ${sortOrder === "desc" ? "btn-primary" : "btn-outline"}`}
                >
                  По возрастанию
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Результаты */}
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Загрузка...</p>
          </div>
        ) : (
          <>
            {products.length > 0 ? (
              <>
                <div className="catalog-page__products-grid">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Пагинация */}
                {totalPages > 1 && (
                  <div className="catalog-page__pagination">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="btn btn-outline btn-icon"
                    >
                      <ChevronLeft className="catalog-page__pagination-icon" />
                    </button>

                    <div className="catalog-page__pagination-pages">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`btn btn-sm ${currentPage === page ? "btn-primary" : "btn-outline"}`}
                          >
                            {page}
                          </button>
                        ),
                      )}
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="btn btn-outline btn-icon"
                    >
                      <ChevronRight className="catalog-page__pagination-icon" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="catalog-page__empty">
                <h3 className="catalog-page__empty-title">Товары не найдены</h3>
                <p className="catalog-page__empty-text">
                  Попробуйте изменить параметры фильтрации.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
