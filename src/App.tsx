import { useState, useEffect } from 'react';
import Alice from '@/components/Alice';
import Bob from '@/components/Bob';
import Photon from '@/components/Photon';
import SimulationControls from '@/components/SimulationControls';
import StepHistory from '@/components/StepHistory';
import { useBB84Simulation } from '@/hooks/useBB84Simulation';
import { ISimulationConfig } from '@/types';

function App() {
  const [config, setConfig] = useState<ISimulationConfig>({
    keyLength: 10,
    errorRate: 0,
    eavesdropperPresent: false,
    visualizationSpeed: 1500
  });

  const [photonActive, setPhotonActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'preparing' | 'transmitting' | 'measuring' | 'complete'>('preparing');

  const { state, actions } = useBB84Simulation(config);

  // Controla as fases da animação
  useEffect(() => {
    if (state.currentStepData && !state.isRunning) {
      setCurrentPhase('preparing');
      
      // Sequência de animação
      const sequence = [
        { phase: 'preparing', delay: 500 },
        { phase: 'transmitting', delay: 2000 },
        { phase: 'measuring', delay: 500 },
        { phase: 'complete', delay: 1000 }
      ];

      let timeouts: NodeJS.Timeout[] = [];
      let totalDelay = 0;

      sequence.forEach(({ phase, delay }) => {
        totalDelay += delay;
        const timeout = setTimeout(() => {
          setCurrentPhase(phase as any);
          if (phase === 'transmitting') {
            setPhotonActive(true);
          }
        }, totalDelay);
        timeouts.push(timeout);
      });

      return () => timeouts.forEach(clearTimeout);
    }
  }, [state.currentStepData, state.isRunning]);

  const handlePhotonComplete = () => {
    setPhotonActive(false);
    setCurrentPhase('measuring');
  };

  const handleStepForward = () => {
    if (!state.isRunning && !state.isComplete) {
      actions.executeStep();
    }
  };

  const currentStep = state.currentStepData;

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="p-6 text-center bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-quantum-blue to-quantum-purple bg-clip-text text-transparent">
          Simulador do Protocolo BB84
        </h1>
        <p className="text-gray-400">
          Demonstração Interativa de Criptografia Quântica
        </p>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        {/* Painel de Controle */}
        <div className="mb-6">
          <SimulationControls
            config={config}
            onConfigChange={setConfig}
            isRunning={state.isRunning}
            isComplete={state.isComplete}
            photonActive={photonActive}
            onStepForward={handleStepForward}
            onAutoPlay={() => actions.startAutoSimulation(config.visualizationSpeed)}
            onStop={() => actions.stopSimulation()}
            onReset={() => actions.resetSimulation()}
            onRunComplete={() => actions.runCompleteSimulation()}
          />
        </div>

        {/* Área Principal de Simulação */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Alice */}
          <div className="flex justify-center">
            <Alice 
              currentBit={currentStep?.alice.bit}
              currentBasis={currentStep?.alice.basis}
              polarizationAngle={currentStep?.alice.angle}
              isActive={currentPhase === 'preparing'}
            />
          </div>

          {/* Canal Quântico */}
          <div className="relative h-80 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-4">
                <h3 className="text-lg font-bold text-quantum-green mb-2">Canal Quântico</h3>
                <div className="text-sm text-gray-400 max-w-[200px] mx-auto">
                  {currentPhase === 'preparing' && 'Alice preparando qubit...'}
                  {currentPhase === 'transmitting' && 'Fóton em trânsito...'}
                  {currentPhase === 'measuring' && 'Bob medindo qubit...'}
                  {currentPhase === 'complete' && 'Medição completa!'}
                </div>
              </div>
            </div>
            
            {/* Fóton animado */}
            {currentStep && (
              <Photon 
                isActive={photonActive}
                polarizationAngle={currentStep.photon.polarization}
                bit={currentStep.alice.bit}
                basis={currentStep.alice.basis}
                onAnimationComplete={handlePhotonComplete}
                animationDuration={config.visualizationSpeed}
              />
            )}
          </div>

          {/* Bob */}
          <div className="flex justify-center">
            <Bob 
              currentBasis={currentStep?.bob.basis}
              measuredBit={currentStep?.bob.bit}
              measurementAngle={currentStep?.bob.measurementAngle}
              photonAngle={currentStep?.photon.polarization}
              isActive={currentPhase === 'measuring'}
              showResult={currentPhase === 'complete' || currentPhase === 'measuring'}
            />
          </div>
        </div>

        {/* Informações do Passo Atual */}
        {currentStep && (
          <div className="quantum-card mb-6">
            <h3 className="text-lg font-bold text-quantum-blue mb-4">
              Passo {state.currentStep} de {state.totalSteps}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-2">Alice envia</div>
                <div className="font-mono text-lg">
                  Bit: <span style={{ color: currentStep.alice.bit === 0 ? '#00ff88' : '#ff6b6b' }}>
                    {currentStep.alice.bit}
                  </span>
                </div>
                <div className="font-mono text-sm">
                  Base: <span style={{ color: currentStep.alice.basis === 'computational' ? '#00d4ff' : '#9d4edd' }}>
                    {currentStep.alice.basis === 'computational' ? 'Z' : 'X'}
                  </span>
                </div>
                <div className="text-xs text-gray-400">
                  Polarização: {currentStep.alice.angle}°
                </div>
              </div>

              <div className="text-center">
                <div className="text-sm text-gray-400 mb-2">Resultado</div>
                <div className={`text-lg font-bold ${
                  currentStep.result.basesMatch ? 'text-green-400' : 'text-red-400'
                }`}>
                  {currentStep.result.basesMatch ? '✓ Bases Iguais' : '✗ Bases Diferentes'}
                </div>
                <div className="text-sm text-gray-400">
                  {currentStep.result.willKeep ? 'Bit será mantido' : 'Bit será descartado'}
                </div>
              </div>

              <div className="text-center">
                <div className="text-sm text-gray-400 mb-2">Bob mede</div>
                <div className="font-mono text-lg">
                  Bit: <span style={{ color: currentStep.bob.bit === 0 ? '#00ff88' : '#ff6b6b' }}>
                    {currentStep.bob.bit}
                  </span>
                </div>
                <div className="font-mono text-sm">
                  Base: <span style={{ color: currentStep.bob.basis === 'computational' ? '#00d4ff' : '#9d4edd' }}>
                    {currentStep.bob.basis === 'computational' ? 'Z' : 'X'}
                  </span>
                </div>
                <div className="text-xs text-gray-400">
                  Detector: {currentStep.bob.measurementAngle}°
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Estatísticas e Chave Gerada */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="quantum-card">
            <h3 className="text-lg font-bold text-quantum-blue mb-4">Estatísticas</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Bits transmitidos:</span>
                <span className="text-quantum-green">{state.statistics.totalBits}</span>
              </div>
              <div className="flex justify-between">
                <span>Bases compatíveis:</span>
                <span className="text-quantum-blue">{state.statistics.matchingBases}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxa de erro:</span>
                <span className={state.statistics.errorRate > 0.11 ? 'text-red-400' : 'text-green-400'}>
                  {(state.statistics.errorRate * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Eficiência da chave:</span>
                <span className="text-quantum-purple">{(state.statistics.keyEfficiency * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>

          <div className="quantum-card">
            <h3 className="text-lg font-bold text-quantum-blue mb-4">
              Chave Compartilhada ({state.sharedKey.length}/{config.keyLength})
            </h3>
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <div className="font-mono text-quantum-green break-all text-lg">
                {state.sharedKey.join('') || 'Nenhuma chave gerada ainda...'}
              </div>
              {state.isComplete && (
                <p className="text-sm text-gray-400 mt-2">
                  ✓ Chave criptográfica segura gerada com sucesso!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Histórico das Etapas */}
        <div className="mb-6">
          <StepHistory 
            steps={state.steps}
            currentStep={state.currentStep}
          />
        </div>

        {/* Eavesdropper Warning */}
        {config.eavesdropperPresent && (
          <div className="quantum-card mt-6 border-red-500/50 bg-red-900/20">
            <h3 className="text-lg font-bold text-red-400 mb-2">
              ⚠️ Eavesdropper Detectado
            </h3>
            <p className="text-red-300 text-sm">
              Um espião (Eve) está interceptando o canal! Taxa de erro elevada: {(config.errorRate * 100).toFixed(0)}%
            </p>
            <p className="text-red-300 text-xs mt-1">
              Em um sistema real, Alice e Bob detectariam esta interferência e abortariam a transmissão.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App; 