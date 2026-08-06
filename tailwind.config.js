/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,astro}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#C8102E',
          50: '#FDECEF',
          100: '#FAD0D7',
          200: '#F4A1AF',
          300: '#EE7287',
          400: '#E8435F',
          500: '#C8102E',
          600: '#A50D26',
          700: '#820A1E',
          800: '#5F0716',
          900: '#3C040E',
        },
        ink: {
          DEFAULT: '#1A1A1A',
          50: '#F7F7F7',
          100: '#E5E5E5',
          200: '#CFCFCF',
          300: '#A3A3A3',
          400: '#737373',
          500: '#525252',
          600: '#404040',
          700: '#262626',
          800: '#1A1A1A',
          900: '#0D0D0D',
        },
        sand: '#F7F5F2',
        // Cool counterpart to `sand`. Both are near-white section surfaces; the
        // difference is felt across a page rather than seen in isolation, which is how
        // the three companies read as distinct without a second brand hue.
        steel: '#EEF0F2',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        arabic: ['Cairo', 'Tajawal', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      // Above 1536px the default 7xl container left very wide empty margins on a 2K or
      // 4K monitor. These steps let the shell grow while body copy keeps its own cap.
      screens: {
        '3xl': '1920px',
        '4xl': '2560px',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
        '10xl': '112rem',
      },
      boxShadow: {
        soft: '0 10px 40px -10px rgba(0,0,0,0.15)',
        card: '0 4px 24px -6px rgba(0,0,0,0.10)',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        // Longer, further travel for the full-screen home hero only.
        'fade-in-up-hero': {
          '0%': { opacity: '0', transform: 'translateY(44px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.6s ease-out',
        'fade-in-up-hero': 'fade-in-up-hero 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        marquee: 'marquee 30s linear infinite',
      },
    },
  },
  plugins: [],
};
