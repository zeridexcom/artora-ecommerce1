/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: '#000000',
                secondary: '#ffffff',
                accent: '#f5f5f5',
            },
            fontFamily: {
                sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
                heading: ['var(--font-heading)', 'system-ui', 'sans-serif'],
            },
            spacing: {
                'section-mobile': '40px',
                'section-desktop': '80px',
            },
            maxWidth: {
                'container': '1400px',
            },
        },
    },
    plugins: [],
}
