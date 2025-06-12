
import { ISimulationConfig } from '@/types';

interface ISimulationControlsProps {
  config: ISimulationConfig;
  onConfigChange: (config: ISimulationConfig) => void;
  isRunning: boolean;
  isComplete: boolean;
  photonActive: boolean;
  onStepForward: () => void;
  onAutoPlay: () => void;
  onStop: () => void;
  onReset: () => void;
  onRunComplete: () => void;
}

const SimulationControls: React.FC<ISimulationControlsProps> = ({
  config,
  onConfigChange,
  isRunning,
  isComplete,
  photonActive,
  onStepForward,
  onAutoPlay,
  onStop,
  onReset,
  onRunComplete
}) => {
  return (
    <div className="quantum-card">
      <h2 className="text-xl font-bold text-quantum-blue mb-4">
        Configurações da Simulação
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Tamanho da Chave: {config.keyLength}
          </label>
          <input 
            type="range" 
            min="5" 
            max="20" 
            value={config.keyLength}
            onChange={(e) => onConfigChange({ ...config, keyLength: parseInt(e.target.value) })}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            disabled={isRunning}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Taxa de Erro: {(config.errorRate * 100).toFixed(0)}%
          </label>
          <input 
            type="range" 
            min="0" 
            max="25" 
            value={config.errorRate * 100}
            onChange={(e) => onConfigChange({ 
              ...config, 
              errorRate: parseInt(e.target.value) / 100,
              eavesdropperPresent: parseInt(e.target.value) > 0
            })}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            disabled={isRunning}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Velocidade: {config.visualizationSpeed}ms
          </label>
          <input 
            type="range" 
            min="500" 
            max="3000" 
            step="250"
            value={config.visualizationSpeed}
            onChange={(e) => onConfigChange({ ...config, visualizationSpeed: parseInt(e.target.value) })}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            disabled={isRunning}
          />
        </div>

        <div className="flex flex-col space-y-2">
          <button 
            onClick={onStepForward}
            disabled={isRunning || isComplete || photonActive}
            className="quantum-button text-sm py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ▶️ Próximo Passo
          </button>
          <button 
            onClick={onAutoPlay}
            disabled={isRunning || isComplete}
            className="quantum-button text-sm py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🔄 Auto Play
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        <button 
          onClick={onStop}
          disabled={!isRunning}
          className="quantum-button text-sm px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ⏸️ Pausar
        </button>
        <button 
          onClick={onReset}
          disabled={isRunning}
          className="quantum-button text-sm px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          🔄 Resetar
        </button>
        <button 
          onClick={onRunComplete}
          disabled={isRunning}
          className="quantum-button text-sm px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ⚡ Simulação Completa
        </button>
      </div>

      {/* Instruções */}
      <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
        <h4 className="text-sm font-semibold text-quantum-blue mb-2">Como usar:</h4>
        <ul className="text-xs text-gray-300 space-y-1">
          <li>• <strong>Próximo Passo:</strong> Execute a simulação passo a passo</li>
          <li>• <strong>Auto Play:</strong> Execute automaticamente na velocidade configurada</li>
          <li>• <strong>Taxa de Erro:</strong> Simula eavesdropping (espião interceptando)</li>
          <li>• <strong>Bases iguais:</strong> Bits são mantidos na chave final</li>
          <li>• <strong>Bases diferentes:</strong> Bits são descartados</li>
        </ul>
      </div>
    </div>
  );
};

export default SimulationControls; 