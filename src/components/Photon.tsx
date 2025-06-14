import { useEffect, useState, useRef } from "react";
import { TMeasurementBasis } from "@/types";
import { getPhotonColor } from "@/utils/visualization";

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
  const animationRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Obtém a cor do fóton usando a função centralizada
  const photonColor = getPhotonColor(basis, bit, isActive);

  // Limpa timeouts e animações na desmontagem
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Limpa timeouts anteriores
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    if (isActive) {
      // Reset inicial
      setPosition(0);
      setPhotonVisible(true);

      // Usa requestAnimationFrame para garantir que o DOM foi atualizado
      animationRef.current = requestAnimationFrame(() => {
        // Pequeno delay para garantir que o CSS está aplicado
        timeoutRef.current = setTimeout(() => {
          setPosition(100);
        }, 50);
      });

      // Remove o fóton após a animação
      const completionTimeout = setTimeout(() => {
        setPhotonVisible(false);
        setPosition(0);
        onAnimationComplete?.();
      }, animationDuration + 200); // Adiciona buffer de 200ms

      return () => {
        clearTimeout(completionTimeout);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    } else {
      // Se não está ativo, esconde imediatamente
      setPhotonVisible(false);
      setPosition(0);
    }
  }, [isActive, animationDuration, onAnimationComplete]);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Canal quântico - SEMPRE VISÍVEL */}
      <div className="absolute top-1/2 left-0 right-0 h-2 bg-gradient-to-r from-quantum-primary/30 via-quantum-accent/60 to-quantum-secondary/30 transform -translate-y-1/2 rounded-full shadow-lg shadow-quantum-accent/20"></div>

      {/* Linha guia do canal - linha central mais sutil */}
      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-quantum-accent/30 transform -translate-y-1/2"></div>

      {/* Fóton viajante */}
      {photonVisible && (
        <div
          className="absolute top-1/2 transform -translate-y-1/2 z-10"
          style={{
            left: `${position}%`,
            transition: `left ${animationDuration}ms linear`,
            willChange: "transform",
          }}
        >
          {/* Partícula do fóton com polarização */}
          <div
            className="w-6 h-6 rounded-full relative"
            style={{
              backgroundColor: photonColor,
              boxShadow: `0 0 25px ${photonColor}, 0 0 50px ${photonColor}40`,
              animation: "pulse 1s ease-in-out infinite",
            }}
          >
            {/* Linha de polarização */}
            <div
              className="absolute top-1/2 left-1/2 w-8 h-0.5 bg-white/80 rounded-full"
              style={{
                transform: `translate(-50%, -50%) rotate(${polarizationAngle}deg)`,
              }}
            />
          </div>

          {/* Trail effect suave */}
          <div
            className="absolute top-1/2 right-full w-12 h-1 transform -translate-y-1/2 rounded-full"
            style={{
              background: `linear-gradient(to left, ${photonColor}80, transparent)`,
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
            style={{ backgroundColor: photonColor }}
          />
        </div>
      )}
    </div>
  );
};

export default Photon;
