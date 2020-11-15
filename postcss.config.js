const purgecss = require('@fullhuman/postcss-purgecss')({
    content: [
      './src/**/*.jsx',
      './src/**/*.js',
      './public/index.html'
    ],
    css: ['./src/tailwind.css'],
    // Include any special characters you're using in this regular expression
    defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || []
  })
  const tailwindcss = require('tailwindcss');
  module.exports = {
    plugins: [
      require('tailwindcss')('./tailwindcss.config.js'),
      require('autoprefixer')
    ]
  };