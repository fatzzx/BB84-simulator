import { useEffect, useState } from "react";
import { TMeasurementBasis } from "@/types";

interface IPhotonProps {
  isActive: boolean;
  polarizationAngle: number;
  bit: 0 | 1;
  basis: TMeasurementBasis;
  onAnimationComplete?: () => void;
  animationDuration?: number;
}

const Photon: React.FC<IPhotonProps> = ({
  isActive,
  polarizationAngle,
  bit,
  basis,
  onAnimationComplete,
  animationDuration = 1000,
}) => {
  const [position, setPosition] = useState(0);
  const [photonVisible, setPhotonVisible] = useState(false);

  // Função para obter a cor do fóton - usar cores de Alice pois é ela quem prepara
  const getPhotonColor = () => {
    if (!isActive) return "#6366f1";
    return basis === "computational" ? "#6366f1" : "#3b82f6"; // Cores de Alice
  };

  useEffect(() => {
    if (isActive) {
      setPhotonVisible(true);
      setPosition(0);

      // Anima o fóton - otimizado para máxima fluidez
      const frameTime = 16; // 60fps fixo para máxima suavidade
      const increment = 100 / (animationDuration / frameTime);

      const animation = setInterval(() => {
        setPosition((prev) => {
          const newPos = prev + increment;
          if (newPos >= 100) {
            clearInterval(animation);
            setTimeout(() => {
              setPhotonVisible(false);
              setPosition(0);
              onAnimationComplete?.();
            }, 50);
            return 100;
          }
          return newPos;
        });
      }, frameTime);

      return () => clearInterval(animation);
    } else {
      setPhotonVisible(false);
      setPosition(0);
    }
  }, [isActive, animationDuration, onAnimationComplete]);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Canal quântico - SEMPRE VISÍVEL - Linha maior conectando diretamente */}
      <div className="absolute top-1/2 left-0 right-0 h-2 bg-gradient-to-r from-quantum-primary/30 via-quantum-accent/60 to-quantum-secondary/30 transform -translate-y-1/2 rounded-full shadow-lg shadow-quantum-accent/20"></div>

      {/* Linha guia do canal - linha central mais sutil */}
      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-quantum-accent/30 transform -translate-y-1/2"></div>

      {/* Fóton viajante - APENAS O CÍRCULO */}
      {photonVisible && (
        <div
          className="absolute top-1/2 transform -translate-y-1/2 z-10"
          style={{
            left: `${position}%`,
            transition: "none",
            willChange: "transform", // Otimização de performance
          }}
        >
          {/* Partícula do fóton - apenas o círculo */}
          <div
            className="w-6 h-6 rounded-full"
            style={{
              backgroundColor: getPhotonColor(),
              boxShadow: `0 0 25px ${getPhotonColor()}, 0 0 50px ${getPhotonColor()}40`,
              animation: "pulse 1s ease-in-out infinite",
            }}
          />

          {/* Trail effect suave */}
          <div
            className="absolute top-1/2 right-full w-12 h-1 transform -translate-y-1/2 rounded-full"
            style={{
              background: `linear-gradient(to left, ${getPhotonColor()}80, transparent)`,
              opacity: 0.6,
            }}
          />
        </div>
      )}

      {/* Efeito de interferência no meio do caminho */}
      {photonVisible && position > 45 && position < 55 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div
            className="w-3 h-3 rounded-full animate-ping"
            style={{ backgroundColor: getPhotonColor() }}
          />
        </div>
      )}
    </div>
  );
};

export default Photon;
