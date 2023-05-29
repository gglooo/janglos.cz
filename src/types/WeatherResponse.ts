export type WeatherResponse = {
    current: {
        condition: { text: string; icon: string };
        last_updated: string;
        temp_c: number;
    };
};
