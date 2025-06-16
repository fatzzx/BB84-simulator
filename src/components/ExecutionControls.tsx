import { useTranslation } from "react-i18next";

interface IExecutionControlsProps {
  isRunning: boolean;
  isComplete: boolean;
  photonActive: boolean;
  onStepForward: () => void;
  onAutoPlay: () => void;
  onStop: () => void;
  onRunComplete: () => void;
}

const ExecutionControls: React.FC<IExecutionControlsProps> = ({
  isRunning,
  isComplete,
  photonActive,
  onStepForward,
  onAutoPlay,
  onStop,
  onRunComplete,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center space-y-2 bg-quantum-surface/50 backdrop-blur-sm rounded-lg p-3 border border-quantum-primary/30 shadow-lg">
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={onStepForward}
          disabled={isRunning || isComplete || photonActive}
          className="quantum-button text-sm px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          title={t("controls.stepTooltip")}
        >
          {t("controls.step")}
        </button>

        <button
          onClick={onAutoPlay}
          disabled={isRunning || isComplete}
          className="quantum-button text-sm px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          title={t("controls.autoTooltip")}
        >
          {t("controls.auto")}
        </button>

        <button
          onClick={onStop}
          disabled={!isRunning}
          className="quantum-button text-sm px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          title={t("controls.pauseTooltip")}
        >
          {t("controls.pause")}
        </button>

        <button
          onClick={onRunComplete}
          disabled={isRunning}
          className="quantum-button text-sm px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          title={t("controls.completeTooltip")}
        >
          {t("controls.complete")}
        </button>
      </div>

      {/* Status da simulação - mais compacto */}
      <div className="text-sm text-quantum-light/70 text-center">
        {isRunning && t("status.running")}
        {photonActive && !isRunning && t("status.transmitting")}
        {isComplete && t("status.complete")}
        {!isRunning && !photonActive && !isComplete && t("status.ready")}
      </div>
    </div>
  );
};

export default ExecutionControls;
