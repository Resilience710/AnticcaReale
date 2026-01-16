/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // İtalyan / Fransız Antikacı Paleti
        'olive': {
          50: '#f4f6f4',
          100: '#e3e8e4',
          200: '#c7d1c9',
          300: '#a3b2a7',
          400: '#7a8f7f',
          500: '#5a7260',
          600: '#475a4c',
          700: '#3a4a3f',
          800: '#2F3E34', // Ana Arka Plan - Koyu Zeytin Yeşili
          900: '#252f28',
          950: '#141a16',
        },
        'linen': {
          50: '#fdfcfa',
          100: '#faf8f4',
          200: '#f5f2eb',
          300: '#EFE9DD', // Kart Arka Plan - Keten Beji
          400: '#e5dccb',
          500: '#d9cdb8',
          600: '#c4b89f',
          700: '#a99d84',
          800: '#8a8069',
          900: '#6e6654',
          950: '#3a352c',
        },
        'espresso': {
          50: '#f6f5f4',
          100: '#e8e6e4',
          200: '#d4d0cc',
          300: '#b8b2ab',
          400: '#958c84',
          500: '#7a6f66',
          600: '#625750',
          700: '#504643',
          800: '#423a37',
          900: '#2B2521', // Ana Metin - Koyu Espresso
          950: '#1a1714',
        },
        'gold': {
          50: '#fbf9f3',
          100: '#f6f1e2',
          200: '#ede2c4',
          300: '#e0ce9e',
          400: '#d4ba78',
          500: '#BFA76A', // Vurgu / CTA - Mat Altın
          600: '#a89155',
          700: '#8c7645',
          800: '#7C6A3D', // Hover - Antik Bronz
          900: '#5a4d2f',
          950: '#322a19',
        },
        'mist': {
          50: '#fafaf9',
          100: '#f4f3f2',
          200: '#eae9e6',
          300: '#C4C1BA', // Çizgiler - Sis Gri
          400: '#a8a49b',
          500: '#8f8a7f',
          600: '#757067',
          700: '#5e5a53',
          800: '#4d4a45',
          900: '#413f3b',
          950: '#232220',
        },
        // Eski renkler için uyumluluk (geçiş kolaylığı)
        'navy': {
          50: '#f4f6f4',
          100: '#e3e8e4',
          200: '#c7d1c9',
          300: '#a3b2a7',
          400: '#7a8f7f',
          500: '#5a7260',
          600: '#475a4c',
          700: '#3a4a3f',
          800: '#2F3E34',
          900: '#252f28',
          950: '#141a16',
        },
        'cream': {
          50: '#fdfcfa',
          100: '#faf8f4',
          200: '#f5f2eb',
          300: '#EFE9DD',
          400: '#e5dccb',
          500: '#d9cdb8',
          600: '#c4b89f',
          700: '#a99d84',
          800: '#8a8069',
          900: '#6e6654',
          950: '#3a352c',
        },
      },
      fontFamily: {
        'serif': ['Playfair Display', 'Georgia', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
