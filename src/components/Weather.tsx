import { WeatherResponse } from "../types/WeatherResponse";

export const Weather = (data: WeatherResponse) => {
    return (
        <div>
            <h1 className="text-3xl">Current weather</h1>
            <div className="border border-b-white border-r-white p-4">
                <h2 className="text-2xl">Brno, Czechia</h2>
                <div className="flex flex-row items-center">
                    <h2 className="text-2xl">
                        {data.current.temp_c}°C, {data.current.condition.text}
                    </h2>
                    <img src={data.current.condition.icon} alt="weather" />
                </div>
            </div>
            <h3 className="text-sm text-right">
                Last updated at {data.current.last_updated}
            </h3>
        </div>
    );
};

export default Weather;
