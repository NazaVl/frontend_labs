import WeatherWidget from "../component/WeatherWidget.jsx";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import consultationLogo from '../assets/icons/consultation.svg';
import freeDeliveryLogo from '../assets/icons/freeDelivery.svg';
import toolsLogo from '../assets/icons/tools.svg';

export default function AboutPage() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const currentHour = new Date().getHours();
    const isNight = currentHour >= 21 || currentHour < 6;
    const themeToSet = savedTheme || (isNight ? "dark" : "light");

    setTheme(themeToSet);
    document.body.classList.toggle("night-mode", themeToSet === "dark");
  }, []);

  /**Handle theme switch*/
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.body.classList.toggle("night-mode", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  return (
    <div>
      <header>
        <h1>Про наш магазин</h1>
        <nav>
          <div className="header_nav">
            <ul>
              <li><Link className="url_nav" to="/">Головна</Link></li>
              <li><Link className="url_nav" to="/catalog">Каталог</Link></li>
              <li><Link className="url_nav" to="/about">Про нас</Link></li>
              <li><Link className="url_nav" to="/contact">Контакти</Link></li>
            </ul>
            <div>
              <ul>
                <li><Link className="head_log_reg_url" to="/login">Log</Link></li>
                <li>|</li>
                <li><Link className="head_log_reg_url" to="/profile">User</Link></li>
              </ul>
            </div>
          </div>
        </nav>
        <button onClick={toggleTheme} className="theme-toggle">
          {theme === "dark" ? "Світла тема" : "Темна тема"}
        </button>
      </header>

      <main>
        <section>
          <div className="intro_about">
            <h2>Наша історія</h2>
            <p>
              З прадавніх-давен людсво створювало музику. Спочатку це були звичайні удари камінням, свист в трубку.
              Та з розвитком людства з'являлися все більш вичурні можливості створювати звук. Магазин "Музичний Світ"
              було засновано у 2010 році з метою зробити якісні музичні інструменти доступними кожному. Ми розпочали з
              невеликої точки продажу в Києві, а зараз маємо мережу по всій Україні та зручний інтернет-магазин.
            </p>
          </div>
        </section>

        <section>
          <div className="proposal_about">
            <h2>Ми пропонуємо:</h2>
            <div className="proposal_about_logo">
              <div className="proposal_content">
                <div className="proposal_icon"><img src={consultationLogo} alt="consultation" /></div>
                <h4>Консультації від професіоналів</h4>
              </div>
              <div className="proposal_content">
                <div className="proposal_icon"><img src={toolsLogo} alt="fix" /></div>
                <h4>Професійне обслуговування та ремонт</h4>
              </div>
              <div className="proposal_content">
                <div className="proposal_icon"><img src={freeDeliveryLogo} alt="freeDelivery" /></div>
                <h4>Безкоштовну доставку при замовленні від 5000 грн</h4>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="about_team">
            <h2>Наша команда</h2>
            <p>Ми — команда музикантів, які люблять свою справу. Наша місія — допомогти кожному знайти свій ідеальний інструмент або врятувати друга, з яким ви творите музику.</p>
          </div>
        </section>

        <section>
          <div className="about_items">
            <h2>У нас ви знайдете</h2>
            <p>Наш магазин містить такі всесвітні бренди як:</p>
            <ul id="about_items_list">
              <li>YAMAXA</li>
              <li>ROLAND</li>
              <li>CASIO</li>
              <li>Та інші</li>
            </ul>
          </div>
        </section>
        <section>
          <WeatherWidget></WeatherWidget>
        </section>
      </main>

      <footer>
        <p>&copy; 2025 Музичний Світ</p>
      </footer>
    </div>
  );
}