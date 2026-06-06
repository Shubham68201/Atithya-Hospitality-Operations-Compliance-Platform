/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy:        "#0B1F3A",
        "navy-light":"#12284D",
        gold:        "#C8A25D",
        "deep-gold": "#A67C32",
        ivory:       "#FAF7F2",
        charcoal:    "#2E2E2E",
      },
      fontFamily: {
        cinzel:  ["Cinzel", "Georgia", "serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      animation: {
        "fade-up":    "fadeUp 0.6s ease-out both",
        "fade-in":    "fadeIn 0.4s ease-out both",
        "slide-in-left":  "slideInLeft 0.5s ease-out both",
        "slide-in-right": "slideInRight 0.5s ease-out both",
      },
      keyframes: {
        fadeUp:        { "0%": { opacity: 0, transform: "translateY(24px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
        fadeIn:        { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
        slideInLeft:   { "0%": { opacity: 0, transform: "translateX(-32px)" }, "100%": { opacity: 1, transform: "translateX(0)" } },
        slideInRight:  { "0%": { opacity: 0, transform: "translateX(32px)" },  "100%": { opacity: 1, transform: "translateX(0)" } },
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        atithya: {
          primary:    "#C8A25D",
          secondary:  "#0B1F3A",
          accent:     "#A67C32",
          neutral:    "#2E2E2E",
          "base-100": "#FAF7F2",
          info:       "#3B82F6",
          success:    "#22C55E",
          warning:    "#F59E0B",
          error:      "#EF4444",
        },
      },
    ],
  },
};
