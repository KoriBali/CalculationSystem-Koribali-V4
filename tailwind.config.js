export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      screens: {
        hp: { max: "500px" },
        "3xl": "1640px",
        2040: "2040px",
      },
    },
  },

  plugins: [],
};
