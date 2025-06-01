import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../hooks/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const ContactPage = () => {
    const { isAuthenticated, loading } = useContext(AuthContext);
    const [topic, setTopic] = useState("");
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [theme, setTheme] = useState("light");
    const navigate = useNavigate();

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        const currentHour = new Date().getHours();
        const isNight = currentHour >= 21 || currentHour < 6;
        const themeToSet = savedTheme || (isNight ? "dark" : "light");

        setTheme(themeToSet);
        document.body.classList.toggle("night-mode", themeToSet === "dark");
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);
        document.body.classList.toggle("night-mode", newTheme === "dark");
        localStorage.setItem("theme", newTheme);
    };

    const handleLoginRedirect = () => {
        navigate("/login");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isAuthenticated) {
            navigate("/login");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            console.log("1")
            const response = await fetch("http://localhost:5000/api/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    topic: topic,
                    message: message,
                }),
            });
            console.log(response)
            if (!response.ok) throw new Error("Не вдалося надіслати повідомлення");
            console.log("2")
            setSuccess("Повідомлення надіслано успішно!");
            setMessage("");
            setTopic("");
            setError("");
        } catch (err) {
            setError(err.message || "Помилка при надсиланні повідомлення");
            setSuccess("");
        }
    };

    return (
        <div className="wrapper">
            <header>
                <h1>Зв'язатися з нами</h1>
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
                    <h2>Маєте питання? Напишіть нам!</h2>

                    {loading ? (
                        <p>Завантаження...</p>
                    ) : !isAuthenticated ? (
                        <div className="login-prompt">
                            <p>Щоб надіслати повідомлення, спочатку увійдіть у свій акаунт.</p>
                            <button onClick={handleLoginRedirect}>Перейти до входу</button>
                        </div>
                    ) : (
                        <form className="contact-form" onSubmit={handleSubmit}>
                            <label htmlFor="topic">Тема:</label>
                            <select
                                id="topic"
                                name="topic"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                required
                            >
                                <option value="">-- Оберіть тему --</option>
                                <option value="order">Замовлення</option>
                                <option value="delivery">Доставка</option>
                                <option value="support">Техпідтримка</option>
                                <option value="other">Інше</option>
                            </select>

                            <label htmlFor="message">Повідомлення:</label>
                            <textarea
                                id="message"
                                name="message"
                                rows="5"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                            ></textarea>

                            <button type="submit">Надіслати</button>

                            {success && <p className="success">{success}</p>}
                            {error && <p className="error">{error}</p>}
                        </form>
                    )}
                </section>
            </main>

            <footer>
                <p>&copy; 2025 Музичний Світ</p>
            </footer>
        </div>
    );
};

export default ContactPage;