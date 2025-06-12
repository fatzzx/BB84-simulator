import { useState, useEffect, useReducer } from 'react';
import Alice from '@/components/Alice';
import Bob from '@/components/Bob';
import Photon from '@/components/Photon';
import SimulationControls from '@/components/SimulationControls';
import StepHistory from '@/components/StepHistory';
import { Footer } from '@/components';
import { useBB84Simulation } from '@/hooks/useBB84Simulation';
import { ISimulationConfig } from '@/types';

// Tipos para o gerenciamento de fases
type AnimationPhase = 'preparing' | 'transmitting' | 'measuring' | 'complete';

interface AnimationState {
  currentPhase: AnimationPhase;
  photonActive: boolean;
}

type AnimationAction =
  | { type: 'SET_PHASE'; phase: AnimationPhase }
  | { type: 'ACTIVATE_PHOTON' }
  | { type: 'DEACTIVATE_PHOTON' }
  | { type: 'RESET_ANIMATION' };

// Reducer para gerenciar as fases da animação
const animationReducer = (state: AnimationState, action: AnimationAction): AnimationState => {
  switch (action.type) {
    case 'SET_PHASE':
      return { ...state, currentPhase: action.phase };
    case 'ACTIVATE_PHOTON':
      return { ...state, photonActive: true };
    case 'DEACTIVATE_PHOTON':
      return { ...state, photonActive: false };
    case 'RESET_ANIMATION':
      return { currentPhase: 'preparing', photonActive: false };
    default:
      return state;
  }
};

function App() {
  const [config, setConfig] = useState<ISimulationConfig>({
    keyLength: 10,
    errorRate: 0,
    eavesdropperPresent: false,
    visualizationSpeed: 1500
  });

  const [animationState, dispatchAnimation] = useReducer(animationReducer, {
    currentPhase: 'preparing',
    photonActive: false
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
    runCompleteSimulation
  } = useBB84Simulation(config);

  // Controla as fases da animação de forma mais robusta
  useEffect(() => {
    if (currentStepData && !isRunning) {
      dispatchAnimation({ type: 'SET_PHASE', phase: 'preparing' });
      
      // Sequência de animação usando timeouts encadeados
      const timeouts: NodeJS.Timeout[] = [];

      // Fase 1: Preparação (500ms)
      timeouts.push(setTimeout(() => {
        dispatchAnimation({ type: 'SET_PHASE', phase: 'transmitting' });
        dispatchAnimation({ type: 'ACTIVATE_PHOTON' });
      }, 500));

      // Fase 2: Transmissão (duração configurável)
      timeouts.push(setTimeout(() => {
        dispatchAnimation({ type: 'DEACTIVATE_PHOTON' });
        dispatchAnimation({ type: 'SET_PHASE', phase: 'measuring' });
      }, 500 + config.visualizationSpeed));

      // Fase 3: Medição (500ms)
      timeouts.push(setTimeout(() => {
        dispatchAnimation({ type: 'SET_PHASE', phase: 'complete' });
      }, 1000 + config.visualizationSpeed));

      return () => timeouts.forEach(clearTimeout);
    }
  }, [currentStepData, isRunning, config.visualizationSpeed]);

  const handlePhotonComplete = () => {
    dispatchAnimation({ type: 'DEACTIVATE_PHOTON' });
    dispatchAnimation({ type: 'SET_PHASE', phase: 'measuring' });
  };

  const handleStepForward = () => {
    if (!isRunning && !isComplete) {
      executeStep();
    }
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Alice */}
          <div className="flex justify-center">
            <Alice 
              currentBit={currentStepData?.alice.bit}
              currentBasis={currentStepData?.alice.basis}
              polarizationAngle={currentStepData?.alice.angle}
              isActive={animationState.currentPhase === 'preparing'}
            />
          </div>

          {/* Canal Quântico */}
          <div className="relative h-80 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-4">
                <h3 className="text-lg font-bold text-quantum-accent mb-2">Canal Quântico</h3>
                <div className="text-quantum-light/70 max-w-[200px] mx-auto">
                  {animationState.currentPhase === 'preparing' && 'Alice preparando qubit...'}
                  {animationState.currentPhase === 'transmitting' && 'Fóton em trânsito...'}
                  {animationState.currentPhase === 'measuring' && 'Bob medindo qubit...'}
                  {animationState.currentPhase === 'complete' && 'Medição completa!'}
                </div>
              </div>
            </div>
            
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
              isActive={animationState.currentPhase === 'measuring'}
              showResult={animationState.currentPhase === 'complete' || animationState.currentPhase === 'measuring'}
              basesMatch={currentStepData?.result.basesMatch}
            />
          </div>
        </div>

        {/* Informações do Passo Atual */}
        {currentStepData && (
          <div className="quantum-card mb-6">
            <h3 className="text-lg font-bold text-quantum-blue mb-4">
              Passo {currentStep} de {totalSteps}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-2">Alice envia</div>
                <div className="font-mono text-lg">
                  Bit: <span style={{ color: currentStepData.alice.bit === 0 ? '#00ff88' : '#ff6b6b' }}>
                    {currentStepData.alice.bit}
                  </span>
                </div>
                <div className="font-mono text-sm">
                  Base: <span style={{ color: currentStepData.alice.basis === 'computational' ? '#00d4ff' : '#9d4edd' }}>
                    {currentStepData.alice.basis === 'computational' ? 'Z' : 'X'}
                  </span>
                </div>
                <div className="text-xs text-gray-400">
                  Polarização: {currentStepData.alice.angle}°
                </div>
              </div>

              <div className="text-center">
                <div className="text-sm text-gray-400 mb-2">Resultado</div>
                <div className={`text-lg font-bold ${
                  currentStepData.result.basesMatch ? 'text-green-400' : 'text-red-400'
                }`}>
                  {currentStepData.result.basesMatch ? '✓ Bases Iguais' : '✗ Bases Diferentes'}
                </div>
                <div className="text-sm text-gray-400">
                  {currentStepData.result.willKeep ? 'Bit será mantido' : 'Bit será descartado'}
                </div>
              </div>

              <div className="text-center">
                <div className="text-sm text-gray-400 mb-2">Bob mede</div>
                <div className="font-mono text-lg">
                  Bit: <span style={{ color: currentStepData.bob.bit === 0 ? '#00ff88' : '#ff6b6b' }}>
                    {currentStepData.bob.bit}
                  </span>
                </div>
                <div className="font-mono text-sm">
                  Base: <span style={{ color: currentStepData.bob.basis === 'computational' ? '#00d4ff' : '#9d4edd' }}>
                    {currentStepData.bob.basis === 'computational' ? 'Z' : 'X'}
                  </span>
                </div>
                <div className="text-xs text-gray-400">
                  Detector: {currentStepData.bob.measurementAngle}°
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