import React, { useEffect, useState, useContext, createContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../hooks/AuthContext";

const ProfilePage = () => {
    const navigate = useNavigate();
    const { user, loading } = useContext(AuthContext);
    const [theme, setTheme] = useState("light");
    const [messages, setMessages] = useState([]);
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        const hour = new Date().getHours();
        const isNight = hour >= 21 || hour < 6;
        const finalTheme = savedTheme || (isNight ? "dark" : "light");
        setTheme(finalTheme);
        document.body.classList.toggle("night-mode", finalTheme === "dark");
    }, []);

    useEffect(() => {
        const fetchMessages = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:5000/api/messages/user", {
            headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error("Помилка при завантаженні повідомлень");

            const data = await response.json();
            setMessages(data);
        } catch (err) {
            console.error("Помилка:", err.message);
        }
        };

        if (user) {
        fetchMessages();
        }
    }, [user]);

    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);
        document.body.classList.toggle("night-mode", newTheme === "dark");
        localStorage.setItem("theme", newTheme);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const nextMessage = () => {
        if (currentMessageIndex < messages.length - 1) {
        setCurrentMessageIndex(currentMessageIndex + 1);
        }
    };

    const prevMessage = () => {
        if (currentMessageIndex > 0) {
        setCurrentMessageIndex(currentMessageIndex - 1);
        }
    };

    if (loading) return <p>Завантаження...</p>;
    if (!user) {
    return (
        <section className="form-section">
            <div className="not-logined-profile">
                <p>Будь ласка, увійдіть.</p>
                <button onClick={() => navigate("/login")}>Увійти</button>
            </div>
        </section>
    );
    }
    console.log("User in ProfilePage:", user);
    return (
        <div className="wrapper">
        <header>
            <h1>Сторінка користувача</h1>
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
            <button onClick={handleLogout} className="logOutButton">Вийти</button>
        </header>

        <main>
            <div className="form-section">
            <h1>Профіль користувача</h1>
            <div className="user-info">
                <p>Ім’я: {user?.name}</p>
            </div>

            <div className="user-messages">
                <h2>Ваші повідомлення</h2>
                {messages.length === 0 ? (
                <p>Наразі немає повідомлень.</p>
                ) : (
                <div>
                    <p>Тип: {messages[currentMessageIndex].topic}</p>
                    <p>Повідомлення: {messages[currentMessageIndex].message}</p>
                    <p>Дата: {new Date(messages[currentMessageIndex].created_at).toLocaleString()}</p>

                    <div className="message-controls">
                        <button onClick={prevMessage} disabled={currentMessageIndex === 0}>Назад</button>
                        <button onClick={nextMessage} disabled={currentMessageIndex === messages.length - 1}>Вперед</button>
                    </div>
                </div>
                )}
            </div>
            </div>
        </main>
        <footer>
            <p>&copy; 2025 Музичний Світ</p>
        </footer>
        </div>
    );
};

export default ProfilePage;