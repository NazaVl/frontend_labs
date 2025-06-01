import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../hooks/AuthContext";

export default function LoginPage() {
    const [theme, setTheme] = useState("light");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

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

    
    const handleSubmit = async (e) => {
        e.preventDefault();
      
        if (password.length < 8) {
            setError("Пароль має містити щонайменше 8 символів");
            return;
        }
      
        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
      
        const data = await response.json();
      
        if (!response.ok) {
            setError(data.error || "Помилка входу");
            return;
        }
      
            console.log("Login data:", data);
      
            login(data.token, data.user);
            navigate("/profile");
        } catch (err) {
            console.error("Login error:", err);
            setError("Сервер недоступний або сталася помилка.");
        }
    };
    

    return (
        <div className="wrapper">
        <header>
            <h1>Вхід до акаунту</h1>
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
                <label htmlFor="login-email">Email:</label>
                <input
                    type="email"
                    id="login-email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <label htmlFor="login-password">Пароль:</label>
                <input
                    type="password"
                    id="login-password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                {error && <p style={{ color: "red" }}>{error}</p>}

                <p>Не маєте аккаунту? <Link className="create-url" to="/register">Створити</Link></p>

                <button type="submit">Увійти</button>
            </form>
            </section>
        </main>

        <footer>
            <p>&copy; 2025 Музичний Світ</p>
        </footer>
        </div>
    );
}