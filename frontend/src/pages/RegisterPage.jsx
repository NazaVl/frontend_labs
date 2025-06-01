import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../hooks/AuthContext";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);

  const [theme, setTheme] = useState("light");
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const currentHour = new Date().getHours();

    if (savedTheme) {
      setTheme(savedTheme);
      document.body.classList.toggle("night-mode", savedTheme === "dark");
    } else {
      const isNight = currentHour >= 21 || currentHour < 6;
      setTheme(isNight ? "dark" : "light");
      document.body.classList.toggle("night-mode", isNight);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.body.classList.toggle("night-mode", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      setError("Пароль має містити щонайменше 8 символів");
      return;
    }

    if (password !== confirm) {
      setError("Паролі не співпадають");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Помилка при реєстрації");
      } else {
        login(data.token, data.user);
        navigate("/profile");
      }
    } catch (err) {
      console.error("Помилка під час реєстрації:", err);
      setError("Сервер недоступний. Спробуйте пізніше.");
    }
  };

  return (
    <div className="wrapper">
      <header>
        <h1>Реєстрація</h1>
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
        <section className="form-section">
          <form onSubmit={handleSubmit} className="user-form">
            <label htmlFor="reg-name">Ім'я:</label>
            <input
              type="text"
              id="reg-name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <label htmlFor="reg-email">Email:</label>
            <input
              type="email"
              id="reg-email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="reg-password">Пароль:</label>
            <input
              type="password"
              id="reg-password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <label htmlFor="reg-confirm">Підтвердження пароля:</label>
            <input
              type="password"
              id="reg-confirm"
              name="confirm"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />

            {error && <p style={{ color: "red" }}>{error}</p>}

            <p>Вже маєте аккаунт? <Link className="create-url" to="/login">Увійти</Link></p>
            <button type="submit">Зареєструватися</button>
          </form>
        </section>
      </main>

      <footer>
        <p>&copy; 2025 Музичний Світ</p>
      </footer>
    </div>
  );
}