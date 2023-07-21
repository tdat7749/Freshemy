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
                switch: "#033700",
                bgForm: "#F7F1DD",
                text: "#212B27",
                backgroundHover: "#FFCF90",
                success: "#28a745",
            },
        },
    },
    plugins: [require("daisyui")],
    daisyui: {
        themes: [
            {
                // mytheme: {
                //     primary: "#555555", 
                //     secondary: "#ff0000",
                //     "base-100": "#fff",
                //     "base-content": "#5c5c5c",
                //     accent: "#FAFAFA",
                //     neutral: "#000",
                // },
            },
        ],
    },
};
