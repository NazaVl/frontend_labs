import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import imageMapResize from 'image-map-resizer';
import images from '../assets/img/HomePage.js';
import boxLogo from '../assets/icons/box.svg';
import qualityLogo from '../assets/icons/quality.svg';
import fastLogo from '../assets/icons/fast.svg';

const HomePage = () => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 20 || hour < 6) {
      document.body.classList.add("night-mode");
    } else {
      document.body.classList.remove("night-mode");
    }

    const changeSlide = (direction) => {
      const slides = document.querySelectorAll(".slide");
      let activeIndex = [...slides].findIndex((slide) => slide.classList.contains("active"));
      slides[activeIndex].classList.remove("active");
      activeIndex = (activeIndex + direction + slides.length) % slides.length;
      slides[activeIndex].classList.add("active");
    };

    window.changeSlide = changeSlide;
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const currentHour = new Date().getHours();
    const isNight = currentHour >= 21 || currentHour < 6;
    const themeToSet = savedTheme || (isNight ? "dark" : "light");

    setTheme(themeToSet);
    document.body.classList.toggle("night-mode", themeToSet === "dark");
  }, []);

  /** Handle theme switch */
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.body.classList.toggle("night-mode", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    imageMapResize();
  }, []);

  return (
    <>
      <header>
        <h1>Музичний Світ</h1>
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
        <section className="popular-products">
          <h2 id="populat_txt">Популярні товари</h2>
          <div className="slider">
            <Link to="/catalog/keys">
              <img src={images.piano} className="slide active" alt="Товар 1" />
            </Link>
            <Link to="/catalog/strings">
              <img src={images.guitar} className="slide" alt="Товар 2" />
            </Link>
            <Link to="/catalog/drums">
              <img src={images.drums} className="slide" alt="Товар 3" />
            </Link>
            <button className="prev" onClick={() => window.changeSlide(-1)}>‹</button>
            <button className="next" onClick={() => window.changeSlide(1)}>›</button>
          </div>
          <Link className="show_all" to="/catalog">Показати всі</Link>
        </section>

        <section>
          <div className="img_map_content">
            <img className="img_map" src={images.map} alt="Карта сайту" useMap="#storemap" />
            <map name="storemap">
              <area shape="poly" coords="234,543,279,342,272,323,279,304,285,285,294,278,302,262,324,256,348,268,345,285,355,290,341,302,347,310,329,322,342,331,326,334,314,346,275,538,286,543,284,554,322,570,347,597,345,637,332,670,339,710,347,754,345,802,327,837,307,856,274,868,205,866,148,850,102,822,87,772,98,722,118,690,146,662,159,634,157,599,167,562,196,546" title="Струнні" href="/catalog/strings" />
              <area shape="poly" coords="377,339,396,326,854,326,874,336,863,348,862,520,875,536,871,579,876,604,866,619,863,766,870,804,866,854,844,861,823,840,428,836,392,863,367,847,369,806,377,794,377,625,366,609,362,586,368,572,369,536,384,514" title="Клавішні" href="/catalog/keys" />
              <area shape="poly" coords="884,807,955,867,1042,878,1155,898,1261,840,1224,641,1228,538,1287,474,1219,365,892,361,875,417,902,567,896,686" title="Ударні" href="/catalog/drums" />
              <area shape="poly" coords="1235,615,1323,794,1375,785,1391,764,1323,379,1454,367,1454,351,1315,330,1289,377,1302,430,1303,526,1283,550,1246,576" title="Духові" href="/catalog/winds" />
            </map>
          </div>
        </section>

        <section>
          <div className="benefits">
            <h2>Ми пропонуємо:</h2>
            <div className="benefits_logo">
              <div className="benefits_content">
                <div className="icon"><img src={boxLogo} alt="box" /></div>
                <h4>Широкий вибір товарів</h4>
              </div>
              <div className="benefits_content">
                <div className="icon"><img src={qualityLogo} alt="quality" /></div>
                <h4>Гарантія якості</h4>
              </div>
              <div className="benefits_content">
                <div className="icon"><img src={fastLogo} alt="fast" /></div>
                <h4>Швидка доставка</h4>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <p>&copy; 2025 Музичний Світ</p>
      </footer>
    </>
  );
};

export default HomePage;