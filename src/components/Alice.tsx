
import { TMeasurementBasis } from '@/types';

interface IAliceProps {
  currentBit?: 0 | 1;
  currentBasis?: TMeasurementBasis;
  polarizationAngle?: number;
  isActive?: boolean;
}

const Alice: React.FC<IAliceProps> = ({ 
  currentBit, 
  currentBasis, 
  polarizationAngle = 0,
  isActive = false 
}) => {
  // Cores para diferentes estados
  const getBasisColor = (basis?: TMeasurementBasis) => {
    if (!basis) return '#64748b';
    return basis === 'computational' ? '#00d4ff' : '#9d4edd';
  };

  const getBitColor = (bit?: 0 | 1) => {
    if (bit === undefined) return '#64748b';
    return bit === 0 ? '#00ff88' : '#ff6b6b';
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Nome */}
      <h3 className="text-xl font-bold text-quantum-blue">Alice</h3>
      
      {/* Avatar */}
      <div className={`relative w-20 h-20 rounded-full border-4 transition-all duration-300 ${
        isActive 
          ? 'border-quantum-blue shadow-quantum animate-pulse' 
          : 'border-gray-600'
      }`}>
        <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
          <span className="text-2xl">👩‍🔬</span>
        </div>
        
        {/* Indicador de atividade */}
        {isActive && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-quantum-green rounded-full animate-ping"></div>
        )}
      </div>

      {/* Informações do bit atual */}
      {currentBit !== undefined && (
        <div className="quantum-card !p-3 w-full max-w-[240px] overflow-hidden">
          <div className="text-center space-y-2">
            <div className="text-sm text-gray-400 truncate">Preparando qubit</div>
            
            {/* Bit value */}
            <div className="flex items-center justify-center space-x-2">
              <span className="text-sm text-gray-300">Bit:</span>
              <span 
                className="font-mono text-lg font-bold px-2 py-1 rounded"
                style={{ color: getBitColor(currentBit) }}
              >
                {currentBit}
              </span>
            </div>

            {/* Base */}
            <div className="flex items-center justify-center space-x-2">
              <span className="text-sm text-gray-300">Base:</span>
              <span 
                className="font-mono text-sm font-semibold px-2 py-1 rounded"
                style={{ color: getBasisColor(currentBasis) }}
              >
                {currentBasis === 'computational' ? 'Z (⊞)' : 'X (⊡)'}
              </span>
            </div>

            {/* Visualização da polarização */}
            <div className="mt-3">
              <div className="text-xs text-gray-400 mb-2">Polarização do fóton</div>
              <div className="relative w-16 h-16 mx-auto">
                {/* Base circle */}
                <div className="absolute inset-0 border-2 border-gray-600 rounded-full"></div>
                
                {/* Polarization line */}
                <div 
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ transform: `rotate(${polarizationAngle}deg)` }}
                >
                  <div 
                    className="w-12 h-0.5 transition-all duration-500"
                    style={{ backgroundColor: getBasisColor(currentBasis) }}
                  />
                </div>
                
                {/* Angle indicator */}
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                  <span className="text-xs" style={{ color: getBasisColor(currentBasis) }}>
                    {polarizationAngle}°
                  </span>
                </div>
              </div>
            </div>

            {/* Estado quântico */}
            <div className="text-xs text-gray-400 mt-2">
              Estado: <span className="text-quantum-blue font-mono">
                {currentBasis === 'computational' 
                  ? (currentBit === 0 ? '|0⟩' : '|1⟩')
                  : (currentBit === 0 ? '|+⟩' : '|-⟩')
                }
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Base selector visual */}
      <div className="quantum-card !p-3 w-full max-w-[240px]">
        <div className="text-center">
          <div className="text-sm text-gray-400 mb-2">Bases disponíveis</div>
          <div className="flex space-x-4">
            {/* Base computacional */}
            <div className="text-center">
              <div className={`w-8 h-8 mx-auto mb-1 border-2 rounded ${
                currentBasis === 'computational' ? 'border-quantum-blue' : 'border-gray-600'
              }`}>
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-quantum-blue text-lg">⊞</span>
                </div>
              </div>
              <div className="text-xs text-gray-400">Z (0°/90°)</div>
            </div>
            
            {/* Base Hadamard */}
            <div className="text-center">
              <div className={`w-8 h-8 mx-auto mb-1 border-2 rounded ${
                currentBasis === 'hadamard' ? 'border-quantum-purple' : 'border-gray-600'
              }`}>
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-quantum-purple text-lg">⊡</span>
                </div>
              </div>
              <div className="text-xs text-gray-400">X (45°/135°)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alice; 