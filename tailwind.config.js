const colors = require("tailwindcss/colors");

module.exports = {
  mode: "jit",
  purge: ["pages/*.js", "pages/**/*.js", "components/*.js"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        gray: colors.trueGray,
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
