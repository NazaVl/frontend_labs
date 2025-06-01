import React, { useState } from "react";
import "./WeatherWidget.css";

const WeatherWidget = () => {
    const [city, setCity] = useState("");
    const [weatherData, setWeatherData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchWeather = async () => {
        if (!city) return;
        setLoading(true);
        setError(null);
        setWeatherData([]);

        try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=5348a20387b7266ae4ea7435e323f26f&units=metric&lang=ua`
        );
        const data = await response.json();

        if (data.cod !== "200") {
            throw new Error(data.message);
        }

        const dailyAtNoon = data.list.filter(item => item.dt_txt.includes("12:00:00"));
        setWeatherData(dailyAtNoon);
        } catch (err) {
        setError(err.message || "Помилка отримання даних");
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="weather-container">
        <h2 className="weather-title">Прогноз погоди</h2>
        <div className="weather-controls">
            <input
            type="text"
            placeholder="Введіть місто"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="weather-input"
            />
            <button onClick={fetchWeather} disabled={loading} className="weather-button">
            {loading ? "Завантаження..." : "Показати погоду"}
            </button>
        </div>
        {error && <p className="weather-error">{error}</p>}
        {weatherData.length > 0 && (
            <div className="weather-cards">
            {weatherData.map((item, index) => (
                <div key={index} className="weather-card">
                    <p>{new Date(item.dt * 1000).toLocaleDateString()}</p>
                    <img
                        src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                        alt="icon"
                        className="weather-icon"
                    />
                    <p>{item.weather[0].description}</p>
                    <p>{Math.round(item.main.temp)}°C</p>
                </div>
            ))}
            </div>
        )}
        </div>
    );
};

export default WeatherWidget;