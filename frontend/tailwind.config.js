/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: [
                    '"Plus Jakarta Sans"',
                    'system-ui',
                    '-apple-system',
                    'BlinkMacSystemFont',
                    'Segoe UI',
                    'Roboto',
                    'sans-serif',
                ],
            },
            boxShadow: {
                /** Sombras tipo CRM B2B (Pipedrive): muy suaves, casi planas */
                pd: '0 1px 2px rgba(16, 24, 40, 0.05)',
                'pd-md': '0 4px 12px rgba(16, 24, 40, 0.08)',
                'pd-dropdown': '0 8px 24px rgba(16, 24, 40, 0.1)',
            },
            colors: {
                /** Fondo global: gris muy claro con leve matiz azulado (no gris neutro tipo marketplace genérico) */
                background: '#F3F5FA',
                oxford: '#1F2024',
                marine: '#0065f6',
                blue: { 900: '#004fc4' },
                brand: {
                    900: '#006FFD',
                    700: '#2897FF',
                    500: '#6FBAFF',
                    300: '#B4DBFF',
                    100: '#EAF2FF',
                },
                line: '#E4E7EC',
                light: {
                    500: '#C5C6CC',
                    400: '#D4D6DD',
                    300: '#E8E9F1',
                    100: '#F2F4F7',
                    50: '#FFFFFF',
                },
                dark: {
                    900: '#1F2024',
                    800: '#2F3036',
                    700: '#494A50',
                    500: '#71727A',
                    300: '#8F9098',
                },
            },
        },
    },
    plugins: [],
};
