/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#F8F9FE',
                oxford: '#1F2024',
                marine: '#1e3a8a',
                brand: {
                    900: '#006FFD',
                    700: '#2897FF',
                    500: '#6FBAFF',
                    300: '#B4DBFF',
                    100: '#EAF2FF'
                },
                light: {
                    500: '#C5C6CC',
                    400: '#D4D6DD',
                    300: '#E8E9F1',
                    100: '#F8F9FE',
                    50: '#FFFFFF'
                },
                dark: {
                    900: '#1F2024',
                    800: '#2F3036',
                    700: '#494A50',
                    500: '#71727A',
                    300: '#8F9098'
                }
            }
        },
    },
    plugins: [],
}
