import { ISimulationConfig } from "@/types";

interface ISimulationControlsProps {
  config: ISimulationConfig;
  onConfigChange: (config: ISimulationConfig) => void;
  isRunning: boolean;
  onReset: () => void;
}

const SimulationControls: React.FC<ISimulationControlsProps> = ({
  config,
  onConfigChange,
  isRunning,
  onReset,
}) => {
  return (
    <div className="quantum-card">
      <h2 className="text-xl font-bold text-quantum-blue mb-3">
        Configurações da Simulação
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Número de Transmissões: {config.keyLength}
          </label>
          <input
            type="range"
            min="10"
            max="50"
            value={config.keyLength}
            onChange={(e) =>
              onConfigChange({ ...config, keyLength: parseInt(e.target.value) })
            }
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
            onChange={(e) =>
              onConfigChange({
                ...config,
                errorRate: parseInt(e.target.value) / 100,
                eavesdropperPresent: parseInt(e.target.value) > 0,
              })
            }
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
            onChange={(e) =>
              onConfigChange({
                ...config,
                visualizationSpeed: parseInt(e.target.value),
              })
            }
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            disabled={isRunning}
          />
        </div>

        <div className="flex flex-col justify-end">
          <button
            onClick={onReset}
            disabled={isRunning}
            className="quantum-button text-sm px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🔄 Resetar
          </button>
        </div>
      </div>

      {/* Instruções */}
      <div className="mt-3 p-3 bg-gray-800/50 rounded-lg">
        <h4 className="text-sm font-semibold text-quantum-blue mb-2">
          Como usar:
        </h4>
        <ul className="text-xs text-gray-300 space-y-1">
          <li>
            • <strong>Transmissões:</strong> Quantos fótons Alice enviará para
            Bob
          </li>
          <li>
            • <strong>Chave final:</strong> Resultado das transmissões com bases
            iguais
          </li>
          <li>
            • <strong>Taxa de Erro:</strong> Simula eavesdropping (espião
            interceptando)
          </li>
          <li>
            • <strong>Bases iguais:</strong> Bits são mantidos na chave final
          </li>
          <li>
            • <strong>Bases diferentes:</strong> Bits são descartados
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SimulationControls;
