import React from 'react';
import { TMeasurementBasis } from '@/types';

interface IBobProps {
  currentBasis?: TMeasurementBasis;
  measuredBit?: 0 | 1;
  measurementAngle?: number;
  photonAngle?: number;
  isActive?: boolean;
  showResult?: boolean;
  basesMatch?: boolean;
}

const Bob: React.FC<IBobProps> = ({ 
  currentBasis,
  measuredBit, 
  measurementAngle = 0,
  photonAngle = 0,
  isActive = false,
  showResult = false,
  basesMatch = false
}) => {
  // Cores para diferentes estados
  const getBasisColor = (basis?: TMeasurementBasis) => {
    if (!basis) return '#6366f1';
    return basis === 'computational' ? '#6366f1' : '#3b82f6';
  };

  const getBitColor = (bit?: 0 | 1) => {
    if (bit === undefined) return '#6366f1';
    return bit === 0 ? '#34d399' : '#f87171';
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Nome */}
      <h3 className="text-xl font-bold text-quantum-secondary">Bob</h3>
      
      {/* Avatar */}
      <div className={`relative w-20 h-20 rounded-full border-4 transition-all duration-300 ${
        isActive 
          ? 'border-quantum-secondary shadow-quantum animate-pulse' 
          : 'border-quantum-surface'
      }`}>
        <div className="w-full h-full rounded-full bg-quantum-secondary flex items-center justify-center">
          <span className="text-2xl">👨‍🔬</span>
        </div>
        
        {/* Indicador de atividade */}
        {isActive && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-quantum-accent rounded-full animate-ping"></div>
        )}
      </div>

      {/* Informações da medição atual */}
      {currentBasis && (
        <div className="quantum-card !p-3 w-full max-w-[240px] overflow-hidden">
          <div className="text-center space-y-2">
            <div className="text-sm text-gray-400 truncate">Medindo qubit</div>
            
            {/* Base de medição */}
            <div className="flex items-center justify-center space-x-2">
              <span className="text-sm text-gray-300">Base:</span>
              <span 
                className="font-mono text-sm font-semibold px-2 py-1 rounded"
                style={{ color: getBasisColor(currentBasis) }}
              >
                {currentBasis === 'computational' ? 'Z (+)' : 'X (×)'}
              </span>
            </div>

            {/* Resultado da medição */}
            {showResult && measuredBit !== undefined && (
              <div className="flex items-center justify-center space-x-2">
                <span className="text-sm text-gray-300">Resultado:</span>
                <span 
                  className="font-mono text-lg font-bold px-2 py-1 rounded"
                  style={{ color: getBitColor(measuredBit) }}
                >
                  {measuredBit}
                </span>
              </div>
            )}

            {/* Visualização da medição */}
            <div className="mt-3">
              <div className="text-xs text-gray-400 mb-2">Detector polarizado</div>
              <div className="relative w-16 h-16 mx-auto">
                {/* Base circle */}
                <div className="absolute inset-0 border-2 border-gray-600 rounded-full"></div>
                
                {/* Fóton incoming (se ativo) */}
                {isActive && photonAngle !== undefined && (
                  <div 
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ transform: `rotate(${photonAngle}deg)` }}
                  >
                    <div className="w-10 h-0.5 bg-quantum-green opacity-60 animate-pulse" />
                  </div>
                )}
                
                {/* Detector orientation */}
                <div 
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ transform: `rotate(${measurementAngle}deg)` }}
                >
                  <div 
                    className="w-12 h-1 transition-all duration-500"
                    style={{ backgroundColor: getBasisColor(currentBasis) }}
                  />
                </div>
                
                {/* Angle indicator */}
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                  <span className="text-xs" style={{ color: getBasisColor(currentBasis) }}>
                    {measurementAngle}°
                  </span>
                </div>
              </div>
            </div>

            {/* Indicador de sucesso - Usando o resultado correto do protocolo BB84 */}
            {showResult && (
              <div className="mt-2">
                <div className={`text-xs px-2 py-1 rounded ${
                  basesMatch 
                    ? 'bg-quantum-success/20 text-quantum-success' 
                    : 'bg-quantum-error/20 text-quantum-error'
                }`}>
                  {basesMatch ? '✓ Bases iguais' : '✗ Bases diferentes'}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {basesMatch 
                    ? 'Bit será mantido na chave' 
                    : 'Bit será descartado'
                  }
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Detectores disponíveis */}
      <div className="mt-6">
        <div className="text-sm text-gray-400 mb-3 text-center">Detectores disponíveis</div>
        <div className="flex justify-center space-x-4">
          {/* Detector Base Computacional (Z) */}
          <div className="text-center">
            <div className="w-12 h-12 rounded-lg bg-quantum-surface border border-quantum-blue/30 flex items-center justify-center">
              <span className="text-quantum-blue text-lg">+</span>
            </div>
            <div className="text-xs text-gray-400 mt-1">Base Z</div>
            <div className="text-xs text-quantum-blue">0°, 90°</div>
          </div>
          
          {/* Detector Base Hadamard (X) */}
          <div className="text-center">
            <div className="w-12 h-12 rounded-lg bg-quantum-surface border border-quantum-purple/30 flex items-center justify-center">
              <span className="text-quantum-purple text-lg">×</span>
            </div>
            <div className="text-xs text-gray-400 mt-1">Base X</div>
            <div className="text-xs text-quantum-purple">45°, 135°</div>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      {showResult && (
        <div className="quantum-card !p-2 w-full max-w-[240px]">
          <div className="text-center">
            <div className="text-xs text-gray-400">Estado medido</div>
            <div className="text-quantum-purple font-mono text-sm">
              {currentBasis === 'computational' 
                ? (measuredBit === 0 ? '|0⟩' : '|1⟩')
                : (measuredBit === 0 ? '|+⟩' : '|-⟩')
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(Bob); 