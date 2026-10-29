import { useTranslation } from "react-i18next";

interface IEveProps {
  isIntercepting: boolean;
}

// Eve fica sobre o meio do canal, ligada a ele por uma "antena"
const Eve: React.FC<IEveProps> = ({ isIntercepting }) => {
  const { t } = useTranslation();

  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full -mt-1 flex flex-col items-center">
      <span
        className={`mb-1 text-xs font-semibold whitespace-nowrap transition-colors duration-300 ${
          isIntercepting ? "text-quantum-error" : "text-quantum-error/70"
        }`}
      >
        {isIntercepting
          ? t("characters.eve.intercepting")
          : t("characters.eve.name")}
      </span>

      <div
        className={`relative flex h-12 w-12 items-center justify-center rounded-full border-4 bg-quantum-error/20 transition-all duration-300 ${
          isIntercepting
            ? "scale-110 border-quantum-error shadow-[0_0_25px_rgba(248,113,113,0.8)]"
            : "border-quantum-error/40"
        }`}
      >
        <span className="text-xl">🕵️</span>
        {isIntercepting && (
          <span className="absolute inset-0 animate-ping rounded-full border-2 border-quantum-error" />
        )}
      </div>

      <div
        className={`h-3 w-0.5 transition-colors duration-300 ${
          isIntercepting ? "bg-quantum-error" : "bg-quantum-error/40"
        }`}
      />
    </div>
  );
};

export default Eve;
