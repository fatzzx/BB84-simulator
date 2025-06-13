import { useState, useEffect, useReducer } from "react";
import Alice from "@/components/Alice";
import Bob from "@/components/Bob";
import Photon from "@/components/Photon";
import SimulationControls from "@/components/SimulationControls";
import StepHistory from "@/components/StepHistory";
import { Footer } from "@/components";
import { useBB84Simulation } from "@/hooks/useBB84Simulation";
import { ISimulationConfig } from "@/types";

// Tipos para o gerenciamento de fases
type AnimationPhase = "preparing" | "transmitting" | "measuring" | "complete";

interface AnimationState {
  currentPhase: AnimationPhase;
  photonActive: boolean;
}

type AnimationAction =
  | { type: "SET_PHASE"; phase: AnimationPhase }
  | { type: "ACTIVATE_PHOTON" }
  | { type: "DEACTIVATE_PHOTON" }
  | { type: "RESET_ANIMATION" };

// Reducer para gerenciar as fases da animação
const animationReducer = (
  state: AnimationState,
  action: AnimationAction
): AnimationState => {
  switch (action.type) {
    case "SET_PHASE":
      return { ...state, currentPhase: action.phase };
    case "ACTIVATE_PHOTON":
      return { ...state, photonActive: true };
    case "DEACTIVATE_PHOTON":
      return { ...state, photonActive: false };
    case "RESET_ANIMATION":
      return { currentPhase: "preparing", photonActive: false };
    default:
      return state;
  }
};

function App() {
  const [config, setConfig] = useState<ISimulationConfig>({
    keyLength: 10,
    errorRate: 0,
    eavesdropperPresent: false,
    visualizationSpeed: 1500,
  });

  const [animationState, dispatchAnimation] = useReducer(animationReducer, {
    currentPhase: "preparing",
    photonActive: false,
  });

  const {
    currentStep,
    totalSteps,
    steps,
    sharedKey,
    isRunning,
    isComplete,
    currentStepData,
    statistics,
    executeStep,
    startAutoSimulation,
    stopSimulation,
    resetSimulation,
    runCompleteSimulation,
  } = useBB84Simulation(config);

  // Controla as fases da animação com timing otimizado
  useEffect(() => {
    if (currentStepData) {
      // Reset inicial
      dispatchAnimation({ type: "RESET_ANIMATION" });
      
      const timeouts: NodeJS.Timeout[] = [];

      // Fase 1: Preparação (100ms)
      timeouts.push(
        setTimeout(() => {
          dispatchAnimation({ type: "SET_PHASE", phase: "preparing" });
        }, 100)
      );

      // Fase 2: Início da transmissão (300ms)
      timeouts.push(
        setTimeout(() => {
          dispatchAnimation({ type: "SET_PHASE", phase: "transmitting" });
          dispatchAnimation({ type: "ACTIVATE_PHOTON" });
        }, 300)
      );

      // Fase 3: Fim da transmissão e início da medição
      timeouts.push(
        setTimeout(() => {
          dispatchAnimation({ type: "DEACTIVATE_PHOTON" });
          dispatchAnimation({ type: "SET_PHASE", phase: "measuring" });
        }, 300 + config.visualizationSpeed)
      );

      // Fase 4: Finalização (dar mais tempo para Bob mostrar os resultados)
      timeouts.push(
        setTimeout(() => {
          dispatchAnimation({ type: "SET_PHASE", phase: "complete" });
        }, 800 + config.visualizationSpeed)
      );

      return () => {
        timeouts.forEach(clearTimeout);
      };
    }
  }, [currentStepData?.step, config.visualizationSpeed]);

  const handlePhotonComplete = () => {
    // Callback simplificado - a lógica de fases já é controlada pelos timeouts
    dispatchAnimation({ type: "DEACTIVATE_PHOTON" });
  };

  const handleStepForward = () => {
    if (!isRunning && !isComplete) {
      executeStep();
    }
  };

  // Cores neutras para os bits
  const getBitColor = (bit: 0 | 1) => {
    return bit === 0 ? "#0ea5e9" : "#8b5cf6"; // Azul claro e roxo claro - cores neutras
  };

  return (
    <div className="min-h-screen bg-quantum-dark flex flex-col">
      <header className="p-6 text-center bg-quantum-surface/50 backdrop-blur-sm border-b border-quantum-primary/20">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-quantum-primary via-quantum-secondary to-quantum-primary bg-clip-text text-transparent">
          Simulador do Protocolo BB84
        </h1>
        <p className="text-quantum-light/70">
          Demonstração Interativa de Criptografia Quântica
        </p>
      </header>

      <main className="container mx-auto px-4 py-6 flex-grow">
        {/* Painel de Controle */}
        <div className="mb-6">
          <SimulationControls
            config={config}
            onConfigChange={setConfig}
            isRunning={isRunning}
            isComplete={isComplete}
            photonActive={animationState.photonActive}
            onStepForward={handleStepForward}
            onAutoPlay={() => startAutoSimulation(config.visualizationSpeed)}
            onStop={stopSimulation}
            onReset={resetSimulation}
            onRunComplete={runCompleteSimulation}
          />
        </div>

        {/* Área Principal de Simulação */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Alice */}
          <div className="flex justify-center">
            <Alice
              currentBit={currentStepData?.alice.bit}
              currentBasis={currentStepData?.alice.basis}
              polarizationAngle={currentStepData?.alice.angle}
              isActive={animationState.currentPhase === "preparing"}
            />
          </div>

          {/* Canal Quântico - Área para conexão direta */}
          <div className="relative h-[480px] overflow-hidden flex items-center">
            {/* Fóton animado */}
            {currentStepData && (
              <Photon
                isActive={animationState.photonActive}
                polarizationAngle={currentStepData.photon.polarization}
                bit={currentStepData.alice.bit}
                basis={currentStepData.alice.basis}
                onAnimationComplete={handlePhotonComplete}
                animationDuration={config.visualizationSpeed}
              />
            )}
          </div>

          {/* Bob */}
          <div className="flex justify-center">
            <Bob
              currentBasis={currentStepData?.bob.basis}
              measuredBit={currentStepData?.bob.bit}
              measurementAngle={currentStepData?.bob.measurementAngle}
              photonAngle={currentStepData?.photon.polarization}
              isActive={animationState.currentPhase === "measuring"}
              showResult={
                currentStepData !== null && 
                (animationState.currentPhase === "complete" ||
                 animationState.currentPhase === "measuring" ||
                 (isRunning && currentStepData.bob.bit !== undefined))
              }
              basesMatch={currentStepData?.result.basesMatch}
            />
          </div>
        </div>

        {/* Informações do Passo Atual */}
        {currentStepData && (
          <div className="quantum-card mb-8 !p-8">
            <h3 className="text-2xl font-bold text-quantum-accent mb-6 text-center">
              Passo {currentStep}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="bg-gray-800/50 rounded-lg p-6">
                <div className="text-lg text-gray-300 mb-4 font-semibold">
                  Alice envia
                </div>
                <div className="space-y-3">
                  <div className="font-mono text-xl">
                    Bit:{" "}
                    <span
                      className="font-bold"
                      style={{
                        color: getBitColor(currentStepData.alice.bit),
                      }}
                    >
                      {currentStepData.alice.bit}
                    </span>
                  </div>
                  <div className="font-mono text-lg">
                    Base:{" "}
                    <span
                      style={{
                        color:
                          currentStepData.alice.basis === "computational"
                            ? "#6366f1"
                            : "#3b82f6",
                      }}
                    >
                      {currentStepData.alice.basis === "computational"
                        ? "Z"
                        : "X"}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400">
                    Polarização: {currentStepData.alice.angle}°
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-6">
                <div className="text-lg text-gray-300 mb-4 font-semibold">
                  Resultado
                </div>
                <div
                  className={`text-xl font-bold mb-3 ${
                    currentStepData.result.basesMatch
                      ? "text-emerald-400"
                      : "text-orange-400"
                  }`}
                >
                  {currentStepData.result.basesMatch
                    ? "✓ Bases Iguais"
                    : "✗ Bases Diferentes"}
                </div>
                <div className="text-base text-gray-400">
                  {currentStepData.result.willKeep
                    ? "Bit será mantido"
                    : "Bit será descartado"}
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-6">
                <div className="text-lg text-gray-300 mb-4 font-semibold">
                  Bob mede
                </div>
                <div className="space-y-3">
                  <div className="font-mono text-xl">
                    Bit:{" "}
                    <span
                      className="font-bold"
                      style={{
                        color: getBitColor(currentStepData.bob.bit),
                      }}
                    >
                      {currentStepData.bob.bit}
                    </span>
                  </div>
                  <div className="font-mono text-lg">
                    Base:{" "}
                    <span
                      style={{
                        color:
                          currentStepData.bob.basis === "computational"
                            ? "#6366f1"
                            : "#3b82f6",
                      }}
                    >
                      {currentStepData.bob.basis === "computational"
                        ? "Z"
                        : "X"}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400">
                    Detector: {currentStepData.bob.measurementAngle}°
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Histórico de Passos */}
        <div className="quantum-card">
          <h3 className="text-lg font-bold text-quantum-blue mb-4">
            Histórico da Simulação
          </h3>
          <StepHistory
            steps={steps}
            currentStep={currentStep}
            sharedKey={sharedKey}
            statistics={statistics}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
