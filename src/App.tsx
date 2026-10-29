import { useState, useEffect, useReducer, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import Alice from "@/components/Alice";
import Bob from "@/components/Bob";
import Photon from "@/components/Photon";
import SimulationControls from "@/components/SimulationControls";
import ExecutionControls from "@/components/ExecutionControls";
import StepHistory from "@/components/StepHistory";
import LanguageToggle from "@/components/LanguageToggle";
import { Footer } from "@/components";
import { useBB84Simulation } from "@/hooks/useBB84Simulation";
import { ISimulationConfig } from "@/types";
import { getBitColor, getBasisColor } from "@/utils/visualization";
import { startTour } from "@/utils/tour";

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

const TUTORIAL_SEEN_KEY = "bb84-tutorial-seen";

// localStorage pode lançar exceção (modo privado, dados bloqueados)
const hasSeenTutorial = (): boolean => {
  try {
    return localStorage.getItem(TUTORIAL_SEEN_KEY) === "1";
  } catch {
    return false;
  }
};

const markTutorialSeen = () => {
  try {
    localStorage.setItem(TUTORIAL_SEEN_KEY, "1");
  } catch {
    // Sem persistência: o tour volta a abrir na próxima visita
  }
};

function App() {
  const { t } = useTranslation();

  // Função que cancela o tour em andamento (se houver)
  const stopTourRef = useRef<(() => void) | null>(null);

  const launchTour = useCallback(() => {
    stopTourRef.current?.();
    stopTourRef.current = startTour(t, markTutorialSeen);
  }, [t]);

  // Abre o tour na primeira visita. O cleanup cancela o tour sem marcá-lo como
  // visto (StrictMode monta duas vezes; trocar de idioma reinicia traduzido).
  useEffect(() => {
    if (!hasSeenTutorial()) launchTour();
    return () => stopTourRef.current?.();
  }, [launchTour]);

  const [config, setConfig] = useState<ISimulationConfig>({
    keyLength: 20, // Agora representa número de transmissões
    eavesdropperPresent: false,
    visualizationSpeed: 1500,
  });

  const [animationState, dispatchAnimation] = useReducer(animationReducer, {
    currentPhase: "preparing",
    photonActive: false,
  });

  const {
    currentStep,
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
    selectStep,
  } = useBB84Simulation(config);

  // Controla as fases da animação com timing otimizado.
  // Reinicia a cada novo passo (ou quando a simulação é resetada).
  const currentStepNumber = currentStepData?.step;

  useEffect(() => {
    dispatchAnimation({ type: "RESET_ANIMATION" });

    if (currentStepNumber === undefined) return;

    const timeouts: NodeJS.Timeout[] = [];

    // Fase 1: Preparação (100ms)
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
    timeouts.push(
      setTimeout(() => {
        dispatchAnimation({ type: "SET_PHASE", phase: "complete" });
      }, transmissionEndTime + 600)
    );

    return () => timeouts.forEach(clearTimeout);
  }, [currentStepNumber, config.visualizationSpeed]);

  const handlePhotonComplete = () => {
    // Callback quando o fóton completa a animação
    dispatchAnimation({ type: "DEACTIVATE_PHOTON" });
  };

  const handleStepForward = () => {
    if (!isRunning && !isComplete) {
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
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex-1 flex justify-start">
            <button
              onClick={launchTour}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg
                         bg-quantum-surface/50 backdrop-blur-sm
                         border border-quantum-primary/30
                         text-quantum-light hover:bg-quantum-surface/70
                         transition-all duration-300
                         hover:border-quantum-primary/50
                         focus:outline-none focus:ring-2 focus:ring-quantum-primary/50"
            >
              <span className="text-lg font-bold">?</span>
              <span className="text-sm font-medium hidden sm:inline">
                {t("tutorial.open")}
              </span>
            </button>
          </div>
          <div className="flex-1 text-center">
            <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-quantum-primary via-quantum-secondary to-quantum-primary bg-clip-text text-transparent">
              {t("app.title")}
            </h1>
            <p className="text-quantum-light/70 text-lg">{t("app.subtitle")}</p>
          </div>
          <div className="flex-1 flex justify-end">
            <LanguageToggle />
          </div>
        </div>
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
            <div data-tour="alice">
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
          </div>

          {/* Canal Quântico + Controles de Execução no Centro */}
          <div className="h-[360px] flex flex-col items-center">
            {/* Canal + fóton animado (o canal é desenhado no meio desta área) */}
            <div
              data-tour="channel"
              className="relative w-full flex-1 overflow-hidden"
            >
              <Photon
                isActive={animationState.photonActive}
                polarizationAngle={currentStepData?.photon.polarization ?? 0}
                aliceAngle={currentStepData?.alice.angle}
                eavesdropperPresent={config.eavesdropperPresent}
                bit={currentStepData?.alice.bit ?? 0}
                basis={currentStepData?.alice.basis ?? "computational"}
                onAnimationComplete={handlePhotonComplete}
                animationDuration={config.visualizationSpeed}
              />
            </div>

            {/* Controles de Execução - abaixo do canal, no fluxo normal */}
            <div className="pb-2">
              <ExecutionControls
                isRunning={isRunning}
                isComplete={isComplete}
                photonActive={animationState.photonActive}
                hasStarted={currentStepData !== null}
                onStepForward={handleStepForward}
                onAutoPlay={handleAutoPlay}
                onStop={stopSimulation}
                onRunComplete={runCompleteSimulation}
              />
            </div>
          </div>

          {/* Bob */}
          <div className="flex justify-center">
            <div data-tour="bob">
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
        </div>

        {/* Informações do Passo Atual */}
        {currentStepData && (
          <div className="mb-6 p-4 bg-quantum-surface/30 rounded-lg border border-quantum-primary/20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-base">
              <div>
                <span className="text-quantum-light/60">
                  {t("stepInfo.transmissions")}
                </span>
                <span className="ml-2 font-mono text-quantum-primary text-lg">
                  {currentStepData.step}
                </span>
              </div>
              <div>
                <span className="text-quantum-light/60">
                  {t("stepInfo.aliceBit")}
                </span>
                <span
                  className="ml-2 font-mono font-bold text-lg"
                  style={{ color: getBitColor(currentStepData.alice.bit) }}
                >
                  {currentStepData.alice.bit}
                </span>
              </div>
              <div>
                <span className="text-quantum-light/60">
                  {t("stepInfo.aliceBase")}
                </span>
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
                <span className="text-quantum-light/60">
                  {t("stepInfo.bobBase")}
                </span>
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
                  <span className="text-quantum-light/60">
                    {t("stepInfo.basesMatch")}
                  </span>
                  <span
                    className="ml-2 font-bold text-lg"
                    style={{
                      color: currentStepData.result.basesMatch
                        ? "#10b981"
                        : "#ef4444",
                    }}
                  >
                    {currentStepData.result.basesMatch
                      ? t("stepInfo.yes")
                      : t("stepInfo.no")}
                  </span>
                </div>
                {currentStepData.result.basesMatch && (
                  <div>
                    <span className="text-quantum-light/60">
                      {t("stepInfo.bitPreserved")}
                    </span>
                    <span
                      className="ml-2 font-bold text-lg"
                      style={{
                        color: currentStepData.result.bitPreserved
                          ? "#10b981"
                          : "#ef4444",
                      }}
                    >
                      {currentStepData.result.bitPreserved
                        ? t("stepInfo.yes")
                        : t("stepInfo.no")}
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
              {t("sharedKey.title")}:
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
                {t("statistics.bitsTransmitted")}
              </div>
            </div>
            <div className="quantum-card text-center">
              <div className="text-3xl font-bold text-quantum-secondary">
                {statistics.matchingBases}
              </div>
              <div className="text-base text-quantum-light/60">
                {t("statistics.matchingBases")}
              </div>
            </div>
            <div className="quantum-card text-center">
              <div className="text-3xl font-bold text-quantum-accent">
                {sharedKey.length}
              </div>
              <div className="text-base text-quantum-light/60">
                {t("sharedKey.title")}
              </div>
            </div>
            <div className="quantum-card text-center">
              <div
                className="text-3xl font-bold"
                style={{
                  color: statistics.errorRate > 0 ? "#ef4444" : "#10b981",
                }}
              >
                {(statistics.errorRate * 100).toFixed(1)}%
              </div>
              <div className="text-base text-quantum-light/60">
                {t("statistics.errorRate")}
              </div>
            </div>
          </div>
        )}

        {/* Histórico de Passos */}
        {steps.length > 0 && (
          <StepHistory
            steps={steps}
            currentStep={currentStep}
            onStepSelect={selectStep}
          />
        )}
      </main>

      <Footer />

    </div>
  );
}

export default App;
