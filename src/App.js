import React, { useState, useEffect } from 'react';
import './App.css';

const API_KEY = '7db5012d6e14b574d34c121a30ac5a28';

const WeatherCard = ({ day, icon, description }) => {
    return (
        <div className="card">
            <img
                src={`http://openweathermap.org/img/w/${icon}.png`}
                className="card-img-top"
                alt={`Weather for ${day}`}
            />
            <div className="card-body">
                <p className="card-text">{description}</p>
                <p className="card-text">{day}</p>
            </div>
        </div>
    );
};

function App() {
    const [city, setCity] = useState('ahmedabad');
    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState('');
    const [unit, setUnit] = useState('metric');

    useEffect(() => {

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    const response = await fetch(
                        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=${unit}`
                    );
                    const data = await response.json();
                    setWeatherData(data);
                },
                (error) => {
                    console.error(error);
                }
            );
        }
    }, [unit]);

    const handleSearch = async () => {
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${unit}`
            );

            if (!response.ok) {
                throw new Error('City not found. Please enter a valid city.');
            }

            const data = await response.json();
            setWeatherData(data);
            setError('');
        } catch (err) {
            setWeatherData(null);
            setError(err.message);
        }
    };

    const weatherCards = () => {
        const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

        return daysOfWeek.map((day) => (
            <WeatherCard
                key={day}
                day={day}
                icon={weatherData.weather[0].icon}
                description={weatherData.weather[0].description}
            />
        ));
    };

    return (
        <div className="bgImage">
            <div className="grid">
                <div className="d-inline-flex justify-content-end">

                    <div className="input-group mb-3">

                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search City"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />
                        <button className="btn btn-outline-secondary" type="button" onClick={handleSearch}>
                            Search
                        </button>
                    </div>
                </div>
                <div>
                    <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => setUnit(unit === 'metric' ? 'imperial' : 'metric')}
                    >
                        {unit === 'metric' ? 'Switch to Fahrenheit' : 'Switch to Celsius'}
                    </button>
                </div>
                <div className="container">
                    {error && <div className="error-message">{error}</div>}
                    {weatherData && (
                        <>
                            <div className="row">
                                <div className="col-4">
                                    <div className="city-info">
                                        <div className="city-name">{weatherData.name}</div>
                                        <div className="city-icon">
                                            <img
                                                src={`http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`}
                                                alt="Weather Icon"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-8 city-descri">
                                    <div>{`Temperature: ${weatherData.main.temp} °${unit === 'metric' ? 'C' : 'F'}`}</div>
                                    <div>{`Wind Speed: ${weatherData.wind.speed} m/s`}</div>
                                    <div>{`Description: ${weatherData.weather[0].description}`}</div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-12">
                                    <h2 className="text-center">7-Day Weather Forecast</h2>
                                    <div className="container d-inline-flex">{weatherCards()}</div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;

