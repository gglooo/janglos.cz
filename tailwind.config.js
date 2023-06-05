/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            gridTemplateRows: {
                // Simple 8 row grid
                8: "repeat(8, minmax(0, 1fr))",
                10: "repeat(10, minmax(0, 1fr))",
                12: "repeat(12, minmax(0, 1fr))",
                14: "repeat(14, minmax(0, 1fr))",
                16: "repeat(16, minmax(0, 1fr))",
            },
            gridTemplateColumns: {
                14: "repeat(14, minmax(0, 1fr))",
                16: "repeat(16, minmax(0, 1fr))",
            },
        },
        fontFamily: {
            main: ["VT323", "monospace"],
        },
        colors: {
            desktop: "#00807F",
            window: "#CCCCCC",
            grey: "#a3a3a3",
            "dark-grey": "#8F8F8F",
            "darker-grey": "#5F5F5F",
            white: "#FFFFFF",
            black: "#000000",
            blue: "#0000FF",
        },
    },
    plugins: [],
};
