import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import { pt } from "./resources/pt";
import { en } from "./resources/en";

// Configuração do i18next
i18n
  // Detecta o idioma do browser
  .use(LanguageDetector)
  // Conecta com React
  .use(initReactI18next)
  // Inicializa o i18n
  .init({
    // Recursos de tradução
    resources: {
      pt: { translation: pt },
      en: { translation: en },
    },

    // Idioma padrão
    fallbackLng: "pt",

    // Idiomas suportados
    supportedLngs: ["pt", "en"],

    // Detecta idioma baseado em localStorage, navigator
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },

    // Configurações de interpolação
    interpolation: {
      escapeValue: false, // React já faz escape
    },

    // Configurações de debug (apenas em desenvolvimento)
    debug: process.env.NODE_ENV === "development",

    // Configurações de carregamento
    react: {
      useSuspense: false, // Evita suspense desnecessário
    },
  });

export default i18n;
