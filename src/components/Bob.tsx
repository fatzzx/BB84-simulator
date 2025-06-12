
import { TMeasurementBasis } from '@/types';

interface IBobProps {
  currentBasis?: TMeasurementBasis;
  measuredBit?: 0 | 1;
  measurementAngle?: number;
  photonAngle?: number;
  isActive?: boolean;
  showResult?: boolean;
}

const Bob: React.FC<IBobProps> = ({ 
  currentBasis,
  measuredBit, 
  measurementAngle = 0,
  photonAngle = 0,
  isActive = false,
  showResult = false
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

  // Calcula se a medição foi bem-sucedida (bases iguais)
  const isSuccessfulMeasurement = () => {
    // Simplificado: considera sucesso se os ângulos estão próximos
    const angleDiff = Math.abs(photonAngle - measurementAngle);
    return angleDiff < 22.5 || angleDiff > 157.5;
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Nome */}
      <h3 className="text-xl font-bold text-quantum-purple">Bob</h3>
      
      {/* Avatar */}
      <div className={`relative w-20 h-20 rounded-full border-4 transition-all duration-300 ${
        isActive 
          ? 'border-quantum-purple shadow-quantum animate-pulse' 
          : 'border-gray-600'
      }`}>
        <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
          <span className="text-2xl">👨‍🔬</span>
        </div>
        
        {/* Indicador de atividade */}
        {isActive && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-quantum-purple rounded-full animate-ping"></div>
        )}
      </div>

      {/* Informações da medição atual */}
      {currentBasis && (
        <div className="quantum-card !p-3 min-w-[200px]">
          <div className="text-center space-y-2">
            <div className="text-sm text-gray-400">Medindo qubit</div>
            
            {/* Base de medição */}
            <div className="flex items-center justify-center space-x-2">
              <span className="text-sm text-gray-300">Base:</span>
              <span 
                className="font-mono text-sm font-semibold px-2 py-1 rounded"
                style={{ color: getBasisColor(currentBasis) }}
              >
                {currentBasis === 'computational' ? 'Z (⊞)' : 'X (⊡)'}
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

            {/* Indicador de sucesso */}
            {showResult && (
              <div className="mt-2">
                <div className={`text-xs px-2 py-1 rounded ${
                  isSuccessfulMeasurement() 
                    ? 'bg-green-900 text-green-300' 
                    : 'bg-red-900 text-red-300'
                }`}>
                  {isSuccessfulMeasurement() ? '✓ Bases compatíveis' : '✗ Bases diferentes'}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Base selector visual */}
      <div className="quantum-card !p-3">
        <div className="text-center">
          <div className="text-sm text-gray-400 mb-2">Detectores disponíveis</div>
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

      {/* Estatísticas */}
      {showResult && (
        <div className="quantum-card !p-2">
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

export default Bob; 