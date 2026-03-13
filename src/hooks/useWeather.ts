import { useQuery } from "@tanstack/react-query";
import { WeatherResponse } from "../types/WeatherResponse";

export const useWeather = () =>
    useQuery<WeatherResponse>({
        queryKey: ["weather"],
        queryFn: async () => {
            const response = await fetch(
                `https://api.weatherapi.com/v1/current.json?q=Brno&key=${import.meta.env.VITE_WEATHER_API_KEY}`,
            );
            if (!response.ok) {
                throw new Error(`HTTP error: status ${response.status}`);
            }
            return response.json();
        },
        staleTime: 60 * 60 * 1000,
        gcTime: 2 * 60 * 60 * 1000,
    });
