/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        screens: {
            mobile: "640px",
            tablet: "768px",
            laptop: "1024px",
            xl: "1280px",
            "2xl": "1536px",
        },
        extend: {
            colors: {
                background: "#F8FFF8",
                primary: "#F7F1DD",
                error: "#FF0000",
                title: "#087930",
                backgroundHover: "#FFCF90",
                success: "#28a745",
            },
            backgroundImage: {
                "hero-pattern": "url('/src/assets/images/Banner.png')",
            },
        },
    },
    plugins: [require("daisyui")],
    daisyui: {
        themes: [
            {
                mytheme: {
                    primary: "#087930",
                    secondary: "#FFCF90",
                    "base-100": "#fff",
                    "base-content": "#5c5c5c",
                    accent: "#FAFAFA",
                    neutral: "#000",
                },
            },
        ],
    },
};
