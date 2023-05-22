/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {},
        fontFamily: {
            main: ["VT323", "monospace"],
        },
        colors: {
            desktop: "#00807F",
            window: "#CCCCCC",
            grey: "#a3a3a3",
            white: "#FFFFFF",
            black: "#000000",
            blue: "#0000FF",
        },
    },
    plugins: [],
};
