import { useState, useCallback, useRef, useEffect } from 'react';
import { BB84Simulator } from '@/simulation/bb84';
import { TMeasurementBasis, ISimulationConfig } from '@/types';

export interface ISimulationStep {
  step: number;
  alice: {
    bit: 0 | 1;
    basis: TMeasurementBasis;
    angle: number;
  };
  bob: {
    bit: 0 | 1;
    basis: TMeasurementBasis;
    angle: number;
    measurementAngle: number;
  };
  photon: {
    polarization: number;
    state: any;
  };
  result: {
    basesMatch: boolean;
    bitPreserved: boolean;
    measurement: 0 | 1;
    willKeep: boolean;
  };
}

export interface ISimulationState {
  currentStep: number;
  totalSteps: number;
  steps: ISimulationStep[];
  sharedKey: number[];
  isRunning: boolean;
  isComplete: boolean;
  currentStepData: ISimulationStep | null;
  statistics: {
    totalBits: number;
    matchingBases: number;
    errorRate: number;
    keyEfficiency: number;
  };
}

export const useBB84Simulation = (config: ISimulationConfig) => {
  const simulatorRef = useRef(new BB84Simulator(config));
  
  const [state, setState] = useState<ISimulationState>({
    currentStep: 0,
    totalSteps: config.keyLength * 3, // Estimativa mais realista para compensar descarte
    steps: [],
    sharedKey: [],
    isRunning: false,
    isComplete: false,
    currentStepData: null,
    statistics: {
      totalBits: 0,
      matchingBases: 0,
      errorRate: 0,
      keyEfficiency: 0
    }
  });

  // Atualiza totalSteps quando a configuração mudar
  useEffect(() => {
    setState(prev => ({
      ...prev,
      totalSteps: config.keyLength * 3
    }));
  }, [config.keyLength]);

  // Gera um bit aleatório
  const generateRandomBit = (): 0 | 1 => Math.random() < 0.5 ? 0 : 1;
  
  // Gera uma base aleatória
  const generateRandomBasis = (): TMeasurementBasis => 
    Math.random() < 0.5 ? 'computational' : 'hadamard';

  // Executa um passo da simulação
  const executeStep = useCallback(() => {
    // Verificações de parada usando o estado atual
    if (state.isComplete || state.sharedKey.length >= config.keyLength) {
      setState(prev => ({ ...prev, isComplete: true }));
      return;
    }

    const aliceBit = generateRandomBit();
    const aliceBasis = generateRandomBasis();
    const bobBasis = generateRandomBasis();

    const stepData = simulatorRef.current.simulateStep(
      state.currentStep,
      aliceBit,
      aliceBasis,
      bobBasis
    );

    const newSteps = [...state.steps, stepData];
    const newSharedKey = stepData.result.basesMatch 
      ? [...state.sharedKey, aliceBit]
      : state.sharedKey;

    // Calcula estatísticas
    const totalBits = newSteps.length;
    const matchingBases = newSteps.filter(s => s.result.basesMatch).length;
    const errors = newSteps.filter(s => 
      s.result.basesMatch && s.alice.bit !== s.bob.bit
    ).length;
    const errorRate = matchingBases > 0 ? errors / matchingBases : 0;
    const keyEfficiency = totalBits > 0 ? newSharedKey.length / totalBits : 0;

    const isComplete = newSharedKey.length >= config.keyLength;

    setState(prev => ({
      ...prev,
      currentStep: prev.currentStep + 1,
      steps: newSteps,
      sharedKey: newSharedKey,
      currentStepData: stepData,
      isComplete,
      // Atualiza totalSteps dinamicamente baseado no progresso
      totalSteps: isComplete ? newSteps.length : Math.max(prev.totalSteps, newSteps.length + Math.ceil((config.keyLength - newSharedKey.length) * 2.5)),
      statistics: {
        totalBits,
        matchingBases,
        errorRate,
        keyEfficiency
      }
    }));

    return stepData;
  }, [state, config.keyLength]);

  // Inicia simulação automática
  const startAutoSimulation = useCallback((speed: number = 1000) => {
    setState(prev => ({ ...prev, isRunning: true }));
    
    const runStep = () => {
      setState(currentState => {
        // Verifica se deve parar a simulação
        if (currentState.isComplete || currentState.sharedKey.length >= config.keyLength) {
          return { ...currentState, isRunning: false, isComplete: true };
        }
        
        return currentState;
      });
      
      // Executa o passo usando a função atual
      executeStep();
    };
    
    const interval = setInterval(runStep, speed);
    return () => clearInterval(interval);
  }, [executeStep, config.keyLength]);

  // Para a simulação
  const stopSimulation = useCallback(() => {
    setState(prev => ({ ...prev, isRunning: false }));
  }, []);

  // Reseta a simulação
  const resetSimulation = useCallback(() => {
    simulatorRef.current = new BB84Simulator(config);
    setState({
      currentStep: 0,
      totalSteps: config.keyLength * 3,
      steps: [],
      sharedKey: [],
      isRunning: false,
      isComplete: false,
      currentStepData: null,
      statistics: {
        totalBits: 0,
        matchingBases: 0,
        errorRate: 0,
        keyEfficiency: 0
      }
    });
  }, [config]);

  // Executa simulação completa instantaneamente
  const runCompleteSimulation = useCallback(() => {
    const result = simulatorRef.current.simulate();
    
    setState(prev => ({
      ...prev,
      sharedKey: result.sharedKey,
      isComplete: true,
      statistics: {
        totalBits: result.aliceBits.length,
        matchingBases: result.aliceBits.filter((_, i) => 
          result.aliceBases[i] === result.bobBases[i]
        ).length,
        errorRate: result.errorRate,
        keyEfficiency: result.sharedKey.length / result.aliceBits.length
      }
    }));

    return result;
  }, []);

  // Volta um passo (se possível)
  const previousStep = useCallback(() => {
    if (state.currentStep > 0) {
      const newStep = state.currentStep - 1;
      const newSteps = state.steps.slice(0, newStep);
      const newSharedKey = newSteps
        .filter(s => s.result.basesMatch)
        .map(s => s.alice.bit);

      setState(prev => ({
        ...prev,
        currentStep: newStep,
        steps: newSteps,
        sharedKey: newSharedKey,
        currentStepData: newSteps[newStep - 1] || null,
        isComplete: false
      }));
    }
  }, [state.currentStep, state.steps]);

  // Pula para um passo específico
  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step < state.steps.length) {
      setState(prev => ({
        ...prev,
        currentStep: step,
        currentStepData: state.steps[step]
      }));
    }
  }, [state.steps]);

  return {
    state,
    actions: {
      executeStep,
      startAutoSimulation,
      stopSimulation,
      resetSimulation,
      runCompleteSimulation,
      previousStep,
      goToStep
    }
  };
}; 