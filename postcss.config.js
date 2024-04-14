module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    require('postcss-preset-env')({
      stage: 1,
      features: {
        'nesting-rules': true,
      },
    }),
  },
};
