const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-column">
            <h3 className="footer-column-title">Mebel_Dagestan</h3>
            <p className="footer-column-link">
               Интернет-магазин качественной мебели для вашего дома.
            </p>
          </div>
          <div className="footer-column">
            <h3 className="footer-column-title">Каталог</h3>
            <ul className="footer-column-links">
              <li><a href="#" className="footer-column-link">Диваны</a></li>
              <li><a href="#" className="footer-column-link">Кровати</a></li>
              <li><a href="#" className="footer-column-link">Шкафы</a></li>
              <li><a href="#" className="footer-column-link">Столы</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3 className="footer-column-title">Контакты</h3>
            <ul className="footer-column-links">
              <li className="footer-column-link">Email: info@mebelshop.ru</li>
              <li className="footer-column-link">Телефон: +7 (123) 456-78-90</li>
              <li className="footer-column-link">Адрес: г. Москва, ул. Ленина, 1</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Mebel_Dagestan. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
