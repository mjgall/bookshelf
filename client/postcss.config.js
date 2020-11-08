//postcss.config.js
const tailwindcss = require('tailwindcss');
module.exports = {
    plugins: [
        require('tailwindcss'),
        tailwindcss('./tailwind.config.js'),
        require('autoprefixer'),
    ],
};