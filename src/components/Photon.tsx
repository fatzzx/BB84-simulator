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
  animationDuration = 2000
}) => {
  const [position, setPosition] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Cores baseadas no bit e base
  const getPhotonColor = () => {
    if (basis === 'computational') {
      return bit === 0 ? '#00d4ff' : '#00d4ff';
    } else {
      return bit === 0 ? '#9d4edd' : '#9d4edd';
    }
  };

  // Símbolo do fóton baseado no estado
  const getPhotonSymbol = () => {
    if (basis === 'computational') {
      return bit === 0 ? '⟶' : '⟶';
    } else {
      return bit === 0 ? '⤴' : '⤵';
    }
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
      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-gray-600 via-quantum-green to-gray-600 opacity-30 transform -translate-y-1/2"></div>
      
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
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
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
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
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
      
      {/* Informações do fóton */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
        <div className="quantum-card !p-2 min-w-[150px]">
          <div className="text-center">
            <div className="text-xs text-gray-400 mb-1">Fóton em trânsito</div>
            <div className="flex justify-between text-xs">
              <span>Estado:</span>
              <span style={{ color: getPhotonColor() }}>
                {basis === 'computational' 
                  ? (bit === 0 ? '|0⟩' : '|1⟩')
                  : (bit === 0 ? '|+⟩' : '|-⟩')
                }
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Base:</span>
              <span style={{ color: getPhotonColor() }}>
                {basis === 'computational' ? 'Z' : 'X'}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Polarização:</span>
              <span style={{ color: getPhotonColor() }}>
                {polarizationAngle}°
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Photon; 