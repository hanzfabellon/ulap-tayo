import { fetchWeatherApi } from 'openmeteo';

export const getWeatherData = async (latitude, longitude) => {
    try {
        const params = {
            "latitude": latitude,
            "longitude": longitude,
            "daily": "weather_code",
            "hourly": ["temperature_2m", "precipitation_probability", "showers", "precipitation", "rain", "uv_index", "weather_code"],
            "timezone": "Asia/Singapore",
            "forecast_days": 1
        };
        const url = "https://api.open-meteo.com/v1/forecast";
        const responses = await fetchWeatherApi(url, params);

        // ... (processing logic from your original snippet)

        return processedData;
    } catch (error) {
        console.error("Error fetching weather data: ", error);
        throw error;
    }
};