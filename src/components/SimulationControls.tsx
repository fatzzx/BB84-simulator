import { ISimulationConfig } from "@/types";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  return (
    <div className="quantum-card" data-tour="settings">
      <h2 className="text-xl font-bold text-quantum-blue mb-3">
        {t("simulation.title")}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t("simulation.transmissions")}: {config.keyLength}
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
            {t("simulation.speed")}: {config.visualizationSpeed}ms
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
            {t("simulation.reset")}
          </button>
        </div>
      </div>

      <label
        data-tour="eve"
        className={`flex items-center gap-2 text-sm text-gray-300 w-fit ${
          isRunning ? "opacity-50" : "cursor-pointer"
        }`}
        title={t("simulation.eavesdropperHint")}
      >
        <input
          type="checkbox"
          checked={config.eavesdropperPresent}
          onChange={(e) =>
            onConfigChange({ ...config, eavesdropperPresent: e.target.checked })
          }
          disabled={isRunning}
          className="w-4 h-4 accent-quantum-primary"
        />
        {t("simulation.eavesdropper")}
      </label>
    </div>
  );
};

export default SimulationControls;
