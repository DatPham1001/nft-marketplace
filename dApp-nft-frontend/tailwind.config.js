module.exports = {
  mode: "jit",
  content: [
    "./src/**/**/*.{js,ts,jsx,tsx,html,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,html,mdx}",
  ],
  darkMode: "class",
  theme: {
    screens: { md: { max: "1050px" }, sm: { max: "550px" } },
    extend: {
      colors: {
        gray: {
          100: "#f2f3f2",
          900: "#171717",
          "900_bf": "#171717bf",
          "900_01": "#162719",
          "900_7f": "#1717177f",
        },
        cyan: { A100: "#89fffd" },
        lime: { 500: "#b4e931" },
        black: {
          900: "#000000",
          "900_6c": "#0000006c",
          "900_90": "#00000090",
          "900_3f": "#0000003f",
        },
        red: { 200: "#caa490" },
        orange: { 200: "#ffb775" },
        purple: { A200: "#ef32d9" },
      },
      backgroundImage: { gradient: "linear-gradient(90deg ,#ef32d9,#89fffd)" },
      fontFamily: { poppins: "Poppins", poetsenone: "PoetsenOne" },
      boxShadow: { bs: "0px 4px  50px 0px #0000003f" },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
