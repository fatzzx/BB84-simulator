import { useEffect, useState } from 'react';
import { TMeasurementBasis } from '@/types';

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
  animationDuration = 1000
}) => {
  const [position, setPosition] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Função para obter a cor do fóton
  const getPhotonColor = () => {
    if (!isActive) return '#6366f1';
    return basis === 'computational' ? '#6366f1' : '#3b82f6';
  };

  useEffect(() => {
    if (isActive) {
      setIsVisible(true);
      setPosition(0);
      
      // Anima o fóton de Alice para Bob
      const animation = setInterval(() => {
        setPosition(prev => {
          const newPos = prev + 2;
          if (newPos >= 100) {
            clearInterval(animation);
            setTimeout(() => {
              setIsVisible(false);
              setPosition(0);
              onAnimationComplete?.();
            }, 200);
            return 100;
          }
          return newPos;
        });
      }, animationDuration / 50);

      return () => clearInterval(animation);
    } else {
      setIsVisible(false);
      setPosition(0);
    }
  }, [isActive, animationDuration, onAnimationComplete]);

  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Canal quântico */}
      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-quantum-surface via-quantum-accent to-quantum-surface opacity-30 transform -translate-y-1/2"></div>
      
      {/* Fóton viajante */}
      <div 
        className="absolute top-1/2 transform -translate-y-1/2 transition-all duration-100 ease-linear"
        style={{ 
          left: `${position}%`,
          color: getPhotonColor(),
          filter: 'drop-shadow(0 0 8px currentColor)'
        }}
      >
        <div className="relative">
          {/* Partícula do fóton */}
          <div 
            className="w-4 h-4 rounded-full animate-pulse"
            style={{ 
              backgroundColor: getPhotonColor(),
              boxShadow: `0 0 15px ${getPhotonColor()}`
            }}
          />
          
          {/* Onda polarizada */}
          <div 
            className="absolute inset-0 flex items-center justify-center"
            style={{ transform: `rotate(${polarizationAngle}deg)` }}
          >
            <div 
              className="w-8 h-0.5 animate-pulse"
              style={{ 
                backgroundColor: getPhotonColor(),
                opacity: 0.8
              }}
            />
          </div>
          
          {/* Trail effect */}
          <div 
            className="absolute top-1/2 right-full w-8 h-0.5 transform -translate-y-1/2"
            style={{
              background: `linear-gradient(to left, ${getPhotonColor()}, transparent)`,
              opacity: 0.6
            }}
          />
          
          {/* Estado quântico label */}
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
            <div 
              className="text-xs font-mono px-2 py-1 rounded-full"
              style={{ 
                backgroundColor: `${getPhotonColor()}20`,
                color: getPhotonColor(),
                border: `1px solid ${getPhotonColor()}40`
              }}
            >
              {basis === 'computational' 
                ? (bit === 0 ? '|0⟩' : '|1⟩')
                : (bit === 0 ? '|+⟩' : '|-⟩')
              }
            </div>
          </div>
          
          {/* Polarização info */}
          <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
            <div 
              className="text-xs px-2 py-1 rounded-full"
              style={{ 
                backgroundColor: `${getPhotonColor()}10`,
                color: getPhotonColor()
              }}
            >
              {polarizationAngle}°
            </div>
          </div>
        </div>
      </div>
      
      {/* Efeito de interferência no meio do caminho */}
      {position > 40 && position < 60 && (
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          <div className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: getPhotonColor() }} />
        </div>
      )}
      
      {/* Informações do fóton - só mostra no meio da animação */}
      {position > 20 && position < 80 && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="quantum-card !p-2 max-w-[140px] overflow-hidden">
            <div className="text-center">
              <div className="text-xs text-gray-400 mb-1 truncate">Fóton</div>
              <div className="grid grid-cols-2 gap-1 text-xs">
                <div className="text-gray-300 truncate">Estado:</div>
                <div style={{ color: getPhotonColor() }} className="truncate">
                  {basis === 'computational' 
                    ? (bit === 0 ? '|0⟩' : '|1⟩')
                    : (bit === 0 ? '|+⟩' : '|-⟩')
                  }
                </div>
                <div className="text-gray-300 truncate">Base:</div>
                <div style={{ color: getPhotonColor() }} className="truncate">
                  {basis === 'computational' ? 'Z' : 'X'}
                </div>
                <div className="text-gray-300 truncate">Pol:</div>
                <div style={{ color: getPhotonColor() }} className="truncate">
                  {polarizationAngle}°
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Photon; 