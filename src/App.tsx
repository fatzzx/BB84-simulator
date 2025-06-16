import { useState, useEffect, useReducer } from "react";
import Alice from "@/components/Alice";
import Bob from "@/components/Bob";
import Photon from "@/components/Photon";
import SimulationControls from "@/components/SimulationControls";
import ExecutionControls from "@/components/ExecutionControls";
import StepHistory from "@/components/StepHistory";
import { Footer } from "@/components";
import { useBB84Simulation } from "@/hooks/useBB84Simulation";
import { ISimulationConfig } from "@/types";
import { getBitColor, getBasisColor } from "@/utils/visualization";

// Tipos para o gerenciamento de fases
type AnimationPhase = "preparing" | "transmitting" | "measuring" | "complete";

interface AnimationState {
  currentPhase: AnimationPhase;
  photonActive: boolean;
  isAnimating: boolean;
}

type AnimationAction =
  | { type: "SET_PHASE"; phase: AnimationPhase }
  | { type: "ACTIVATE_PHOTON" }
  | { type: "DEACTIVATE_PHOTON" }
  | { type: "RESET_ANIMATION" }
  | { type: "SET_ANIMATING"; isAnimating: boolean };

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
      return {
        currentPhase: "preparing",
        photonActive: false,
        isAnimating: false,
      };
    case "SET_ANIMATING":
      return { ...state, isAnimating: action.isAnimating };
    default:
      return state;
  }
};

function App() {
  const [config, setConfig] = useState<ISimulationConfig>({
    keyLength: 20, // Agora representa número de transmissões
    errorRate: 0,
    eavesdropperPresent: false,
    visualizationSpeed: 1500,
  });

  const [animationState, dispatchAnimation] = useReducer(animationReducer, {
    currentPhase: "preparing",
    photonActive: false,
    isAnimating: false,
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
    if (currentStepData && !animationState.isAnimating) {
      dispatchAnimation({ type: "SET_ANIMATING", isAnimating: true });

      // Reset inicial
      dispatchAnimation({ type: "RESET_ANIMATION" });

      const timeouts: NodeJS.Timeout[] = [];

      // Fase 1: Preparação (200ms)
      timeouts.push(
        setTimeout(() => {
          dispatchAnimation({ type: "SET_PHASE", phase: "preparing" });
        }, 100)
      );

      // Fase 2: Início da transmissão (400ms)
      timeouts.push(
        setTimeout(() => {
          dispatchAnimation({ type: "SET_PHASE", phase: "transmitting" });
          dispatchAnimation({ type: "ACTIVATE_PHOTON" });
        }, 400)
      );

      // Fase 3: Fim da transmissão e início da medição
      const transmissionEndTime = 400 + config.visualizationSpeed + 100;
      timeouts.push(
        setTimeout(() => {
          dispatchAnimation({ type: "DEACTIVATE_PHOTON" });
          dispatchAnimation({ type: "SET_PHASE", phase: "measuring" });
        }, transmissionEndTime)
      );

      // Fase 4: Finalização
      const completionTime = transmissionEndTime + 600;
      timeouts.push(
        setTimeout(() => {
          dispatchAnimation({ type: "SET_PHASE", phase: "complete" });
          dispatchAnimation({ type: "SET_ANIMATING", isAnimating: false });
        }, completionTime)
      );

      return () => {
        timeouts.forEach(clearTimeout);
        dispatchAnimation({ type: "SET_ANIMATING", isAnimating: false });
      };
    }
  }, [currentStepData?.step, config.visualizationSpeed]);

  const handlePhotonComplete = () => {
    // Callback quando o fóton completa a animação
    dispatchAnimation({ type: "DEACTIVATE_PHOTON" });
  };

  const handleStepForward = () => {
    if (!isRunning && !isComplete && !animationState.isAnimating) {
      executeStep();
    }
  };

  const handleAutoPlay = () => {
    // Calcula o tempo total de uma animação completa
    const totalAnimationTime = 400 + config.visualizationSpeed + 100 + 600;
    // Adiciona um buffer de 20% para garantir que as animações completem
    const adjustedSpeed = Math.max(
      totalAnimationTime * 1.2,
      config.visualizationSpeed
    );

    startAutoSimulation(adjustedSpeed);
  };

  return (
    <div className="min-h-screen bg-quantum-dark flex flex-col">
      <header className="p-4 text-center bg-quantum-surface/50 backdrop-blur-sm border-b border-quantum-primary/20">
        <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-quantum-primary via-quantum-secondary to-quantum-primary bg-clip-text text-transparent">
          Simulador do Protocolo BB84
        </h1>
        <p className="text-quantum-light/70 text-lg">
          Demonstração Interativa de Criptografia Quântica
        </p>
      </header>

      <main className="container mx-auto px-3 py-4 flex-grow">
        {/* Configurações - Fica em cima */}
        <div className="mb-4">
          <SimulationControls
            config={config}
            onConfigChange={setConfig}
            isRunning={isRunning}
            onReset={resetSimulation}
          />
        </div>

        {/* Área Principal de Simulação */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-4">
          {/* Alice */}
          <div className="flex justify-center">
            <Alice
              currentBit={currentStepData?.alice.bit}
              currentBasis={currentStepData?.alice.basis}
              polarizationAngle={currentStepData?.alice.angle}
              isActive={
                animationState.currentPhase === "preparing" ||
                animationState.currentPhase === "transmitting"
              }
            />
          </div>

          {/* Canal Quântico + Controles de Execução no Centro */}
          <div className="relative h-[360px] overflow-hidden flex flex-col items-center justify-center">
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

            {/* Controles de Execução - Posicionados no centro */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
              <ExecutionControls
                isRunning={isRunning}
                isComplete={isComplete}
                photonActive={animationState.photonActive}
                onStepForward={handleStepForward}
                onAutoPlay={handleAutoPlay}
                onStop={stopSimulation}
                onRunComplete={runCompleteSimulation}
              />
            </div>
          </div>

          {/* Bob */}
          <div className="flex justify-center">
            <Bob
              currentBasis={currentStepData?.bob.basis}
              measuredBit={currentStepData?.bob.bit}
              measurementAngle={currentStepData?.bob.measurementAngle}
              photonAngle={currentStepData?.photon.polarization}
              isActive={
                animationState.currentPhase === "measuring" ||
                animationState.currentPhase === "complete"
              }
              showResult={
                currentStepData !== null &&
                (animationState.currentPhase === "complete" ||
                  animationState.currentPhase === "measuring")
              }
              basesMatch={currentStepData?.result.basesMatch}
            />
          </div>
        </div>

        {/* Informações do Passo Atual */}
        {currentStepData && (
          <div className="mb-6 p-4 bg-quantum-surface/30 rounded-lg border border-quantum-primary/20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-base">
              <div>
                <span className="text-quantum-light/60">Transmissões:</span>
                <span className="ml-2 font-mono text-quantum-primary text-lg">
                  {currentStepData.step}
                </span>
              </div>
              <div>
                <span className="text-quantum-light/60">Bit de Alice:</span>
                <span
                  className="ml-2 font-mono font-bold text-lg"
                  style={{ color: getBitColor(currentStepData.alice.bit) }}
                >
                  {currentStepData.alice.bit}
                </span>
              </div>
              <div>
                <span className="text-quantum-light/60">Base de Alice:</span>
                <span
                  className="ml-2 font-mono text-lg"
                  style={{
                    color: getBasisColor(currentStepData.alice.basis),
                  }}
                >
                  {currentStepData.alice.basis === "computational" ? "⊕" : "⊗"}
                </span>
              </div>
              <div>
                <span className="text-quantum-light/60">Base de Bob:</span>
                <span
                  className="ml-2 font-mono text-lg"
                  style={{ color: getBasisColor(currentStepData.bob.basis) }}
                >
                  {currentStepData.bob.basis === "computational" ? "⊕" : "⊗"}
                </span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-quantum-primary/10">
              <div className="flex items-center gap-4 text-base">
                <div>
                  <span className="text-quantum-light/60">Bases combinam:</span>
                  <span
                    className="ml-2 font-bold text-lg"
                    style={{
                      color: currentStepData.result.basesMatch
                        ? "#10b981"
                        : "#ef4444",
                    }}
                  >
                    {currentStepData.result.basesMatch ? "Sim" : "Não"}
                  </span>
                </div>
                {currentStepData.result.basesMatch && (
                  <div>
                    <span className="text-quantum-light/60">
                      Bit preservado:
                    </span>
                    <span
                      className="ml-2 font-bold text-lg"
                      style={{
                        color: currentStepData.result.bitPreserved
                          ? "#10b981"
                          : "#ef4444",
                      }}
                    >
                      {currentStepData.result.bitPreserved ? "Sim" : "Não"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Chave Compartilhada */}
        {sharedKey.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-quantum-primary mb-3">
              Chave Compartilhada:
            </h3>
            <div className="quantum-card">
              <div className="font-mono text-xl flex flex-wrap gap-2">
                {sharedKey.map((bit, index) => (
                  <span
                    key={index}
                    className="px-3 py-2 rounded bg-quantum-primary/20 text-quantum-primary border border-quantum-primary/30 text-lg"
                  >
                    {bit}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Estatísticas */}
        {steps.length > 0 && (
          <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="quantum-card text-center">
              <div className="text-3xl font-bold text-quantum-primary">
                {statistics.totalBits}
              </div>
              <div className="text-base text-quantum-light/60">
                Bits Transmitidos
              </div>
            </div>
            <div className="quantum-card text-center">
              <div className="text-3xl font-bold text-quantum-secondary">
                {statistics.matchingBases}
              </div>
              <div className="text-base text-quantum-light/60">
                Bases Iguais
              </div>
            </div>
            <div className="quantum-card text-center">
              <div className="text-3xl font-bold text-quantum-accent">
                {sharedKey.length}
              </div>
              <div className="text-base text-quantum-light/60">
                Chave Compartilhada
              </div>
            </div>
            <div className="quantum-card text-center">
              <div className="text-3xl font-bold text-red-400">
                {(statistics.errorRate * 100).toFixed(1)}%
              </div>
              <div className="text-base text-quantum-light/60">
                Taxa de Erro
              </div>
            </div>
          </div>
        )}

        {/* Histórico de Passos */}
        {steps.length > 0 && (
          <StepHistory steps={steps} currentStep={currentStep} />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
