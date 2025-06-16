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
  return (
    <div className="flex flex-col items-center space-y-2 bg-quantum-surface/50 backdrop-blur-sm rounded-lg p-3 border border-quantum-primary/30 shadow-lg">
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={onStepForward}
          disabled={isRunning || isComplete || photonActive}
          className="quantum-button text-sm px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          title="Execute um passo da simulação"
        >
          ▶️ Passo
        </button>

        <button
          onClick={onAutoPlay}
          disabled={isRunning || isComplete}
          className="quantum-button text-sm px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          title="Execute automaticamente na velocidade configurada"
        >
          🔄 Auto
        </button>

        <button
          onClick={onStop}
          disabled={!isRunning}
          className="quantum-button text-sm px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          title="Pausar a simulação automática"
        >
          ⏸️ Pausar
        </button>

        <button
          onClick={onRunComplete}
          disabled={isRunning}
          className="quantum-button text-sm px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          title="Execute toda a simulação instantaneamente"
        >
          ⚡ Completa
        </button>
      </div>

      {/* Status da simulação - mais compacto */}
      <div className="text-sm text-quantum-light/70 text-center">
        {isRunning && "🔄 Executando..."}
        {photonActive && !isRunning && "✨ Transmitindo..."}
        {isComplete && "✅ Concluída!"}
        {!isRunning && !photonActive && !isComplete && "⏹️ Pronto"}
      </div>
    </div>
  );
};

export default ExecutionControls;
