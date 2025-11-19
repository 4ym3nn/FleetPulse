import localFont from "next/font/local";

export const montserrat = localFont({
  src: [
    {
      path: "../fonts/Montserrat-VariableFont_wght.ttf",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "../fonts/Montserrat-Italic-VariableFont_wght.ttf",
      weight: "100 900",
      style: "italic",
    },
  ],
  variable: "--font-montserrat",
  display: "swap",
});

