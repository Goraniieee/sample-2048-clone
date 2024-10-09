/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brown: {
          50: '#FAF5F0', // Very pale brown
          100: '#F3EDE3', // Pale brown
          200: '#EDE3D3', // Very light brown
          300: '#E1D3C1', // Light brown
          400: '#D5C0A7', // Soft light brown
          500: '#B7977A', // Medium-light brown
          600: '#99714D', // Warm brown
          700: '#7B4B21', // Main brown
          800: '#623C1A', // Darker brown
          900: '#4A2D14', // Dark brown
        },
      },
    },
  },
  plugins: [],
};
