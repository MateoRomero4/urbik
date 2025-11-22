// postcss.config.js

module.exports = {
  plugins: {
    // 🛑 CAMBIAR 'tailwindcss' por '@tailwindcss/postcss' como requiere el error
    '@tailwindcss/postcss': {}, 
    // Mantenemos autoprefixer
    autoprefixer: {},
  },
};