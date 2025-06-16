import React from "react";
import { useTranslation } from "react-i18next";

const LanguageToggle: React.FC = () => {
  const { i18n, t } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "pt" ? "en" : "pt";
    i18n.changeLanguage(newLang);
  };

  const currentFlag = i18n.language === "pt" ? "🇧🇷" : "🇺🇸";
  const currentLang = i18n.language === "pt" ? "PT" : "EN";

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center space-x-2 px-3 py-2 rounded-lg
                 bg-quantum-surface/50 backdrop-blur-sm
                 border border-quantum-primary/30
                 text-quantum-light hover:bg-quantum-surface/70
                 transition-all duration-300
                 hover:border-quantum-primary/50
                 focus:outline-none focus:ring-2 focus:ring-quantum-primary/50"
      title={t("language.toggle")}
    >
      <span className="text-lg">{currentFlag}</span>
      <span className="text-sm font-medium">{currentLang}</span>
    </button>
  );
};

export default LanguageToggle;
