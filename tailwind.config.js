/**
 * Palette du portfolio — référence pour le redesign
 * (hex sans # dans les commentaires = valeur complète avec # ci-dessous)
 *
 * primary   #274370  — bleu marine (titres, CTA, liens forts)
 * secondary #345995  — bleu plus vif (survols, accents secondaires)
 * tertiary  #ebf2fa  — fond clair, cartes, bandes
 * white     #ffffff  — fond principal, texte sur fond sombre
 * body      #202020  — texte courant sur blanc / tertiary (lisibilité)
 */
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        primary: '#274370',
        secondary: '#345995',
        tertiary: '#ebf2fa',
        white: '#ffffff',
        body: '#202020',
        'footer-bg': '#232931',
      },
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        btn: '0px 24px 36px -11px rgba(0, 0, 0, 0.09)',
      },
    },
  },
};
