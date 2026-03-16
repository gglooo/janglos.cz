import { useWeather } from "../hooks/useWeather";

export const Weather = () => {
    const weatherQuery = useWeather();

    if (weatherQuery.isLoading) {
        return <div>Loading...</div>;
    }

    if (weatherQuery.isError || !weatherQuery.data) {
        return <div>Error loading weather data.</div>;
    }

    return (
        <div>
            <h1 className="text-3xl">Current weather</h1>
            <div className="border border-b-white border-r-white p-4">
                <h2 className="text-2xl">Brno, Czechia</h2>
                <div className="flex flex-row items-center">
                    <h2 className="text-2xl">
                        {weatherQuery.data.current.temp_c}°C,{" "}
                        {weatherQuery.data.current.condition.text}
                    </h2>
                    <img
                        src={weatherQuery.data.current.condition.icon}
                        alt="weather"
                    />
                </div>
            </div>
            <h3 className="text-sm text-right">
                Last updated at {weatherQuery.data.current.last_updated}
            </h3>
        </div>
    );
};

export default Weather;
