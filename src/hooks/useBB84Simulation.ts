import { useReducer, useCallback, useRef, useEffect } from "react";
import { BB84Simulator } from "@/simulation/bb84";
import {
  TMeasurementBasis,
  ISimulationConfig,
  IBB84SimulationResult,
} from "@/types";
import { calculateEstimatedSteps } from "@/utils/simulation";

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
    state: unknown;
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

// Actions para o reducer
type SimulationAction =
  | { type: "START_SIMULATION"; speed: number }
  | { type: "STOP_SIMULATION" }
  | { type: "RESET_SIMULATION"; config: ISimulationConfig }
  | { type: "EXECUTE_STEP"; stepData: ISimulationStep; keyLength: number }
  | { type: "COMPLETE_SIMULATION"; result: IBB84SimulationResult }
  | {
      type: "SET_COMPLETE_SIMULATION_DATA";
      result: IBB84SimulationResult;
      steps: ISimulationStep[];
    }
  | { type: "UPDATE_TOTAL_STEPS"; totalSteps: number }
  | { type: "SELECT_STEP"; stepIndex: number };

// Reducer para gerenciar estado de forma consistente
const simulationReducer = (
  state: ISimulationState,
  action: SimulationAction
): ISimulationState => {
  switch (action.type) {
    case "START_SIMULATION":
      return { ...state, isRunning: true };

    case "STOP_SIMULATION":
      return { ...state, isRunning: false };

    case "RESET_SIMULATION":
      return {
        currentStep: 0,
        totalSteps: calculateEstimatedSteps(action.config.keyLength),
        steps: [],
        sharedKey: [],
        isRunning: false,
        isComplete: false,
        currentStepData: null,
        statistics: {
          totalBits: 0,
          matchingBases: 0,
          errorRate: 0,
          keyEfficiency: 0,
        },
      };

    case "EXECUTE_STEP": {
      const newSteps = [...state.steps, action.stepData];
      const newSharedKey = action.stepData.result.basesMatch
        ? [...state.sharedKey, action.stepData.alice.bit]
        : state.sharedKey;

      // Calcula estatísticas
      const totalBits = newSteps.length;
      const matchingBases = newSteps.filter((s) => s.result.basesMatch).length;
      const keyEfficiency = totalBits > 0 ? newSharedKey.length / totalBits : 0;

      // Completa quando atingir o número de transmissões configurado (não tamanho da chave)
      const isComplete = newSteps.length >= action.keyLength;

      return {
        ...state,
        currentStep: state.currentStep + 1,
        steps: newSteps,
        sharedKey: newSharedKey,
        currentStepData: action.stepData,
        isComplete,
        isRunning: isComplete ? false : state.isRunning,
        statistics: {
          totalBits,
          matchingBases,
          errorRate: 0,
          keyEfficiency,
        },
      };
    }

    case "COMPLETE_SIMULATION":
      return {
        ...state,
        sharedKey: action.result.sharedKey,
        isComplete: true,
        isRunning: false,
        statistics: {
          totalBits: action.result.aliceBits.length,
          matchingBases: action.result.aliceBits.filter(
            (_, i: number) =>
              action.result.aliceBases[i] === action.result.bobBases[i]
          ).length,
          errorRate: 0,
          keyEfficiency:
            action.result.sharedKey.length / action.result.aliceBits.length,
        },
      };

    case "SET_COMPLETE_SIMULATION_DATA":
      return {
        ...state,
        steps: action.steps,
        sharedKey: action.result.sharedKey,
        currentStep: action.steps.length,
        totalSteps: action.steps.length, // Atualiza o total de passos para refletir a simulação completa
        isComplete: true,
        isRunning: false,
        currentStepData:
          action.steps.length > 0
            ? action.steps[action.steps.length - 1]
            : null, // Define o último passo como atual
        statistics: {
          totalBits: action.result.aliceBits.length,
          matchingBases: action.result.aliceBits.filter(
            (_, i: number) =>
              action.result.aliceBases[i] === action.result.bobBases[i]
          ).length,
          errorRate: 0,
          keyEfficiency:
            action.result.sharedKey.length / action.result.aliceBits.length,
        },
      };

    case "UPDATE_TOTAL_STEPS":
      return { ...state, totalSteps: action.totalSteps };

    case "SELECT_STEP":
      if (action.stepIndex >= 0 && action.stepIndex < state.steps.length) {
        return {
          ...state,
          currentStepData: state.steps[action.stepIndex],
        };
      }
      return state;

    default:
      return state;
  }
};

export const useBB84Simulation = (config: ISimulationConfig) => {
  const simulatorRef = useRef(new BB84Simulator(config));
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const speedRef = useRef<number>(1000);

  const [state, dispatch] = useReducer(simulationReducer, {
    currentStep: 0,
    totalSteps: calculateEstimatedSteps(config.keyLength),
    steps: [],
    sharedKey: [],
    isRunning: false,
    isComplete: false,
    currentStepData: null,
    statistics: {
      totalBits: 0,
      matchingBases: 0,
      errorRate: 0,
      keyEfficiency: 0,
    },
  });

  // Limpa intervalos na desmontagem
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Atualiza simulador quando config muda
  useEffect(() => {
    simulatorRef.current = new BB84Simulator(config);
    dispatch({ type: "RESET_SIMULATION", config });
  }, [config]);

  // Gera um bit aleatório
  const generateRandomBit = (): 0 | 1 => (Math.random() < 0.5 ? 0 : 1);

  // Gera uma base aleatória
  const generateRandomBasis = (): TMeasurementBasis =>
    Math.random() < 0.5 ? "computational" : "hadamard";

  // Executa um passo da simulação
  const executeStep = useCallback(() => {
    // Evita execução se já completo (baseado no número de transmissões realizadas)
    if (state.isComplete || state.currentStep >= config.keyLength) {
      dispatch({ type: "STOP_SIMULATION" });
      return;
    }

    const aliceBit = generateRandomBit();
    const aliceBasis = generateRandomBasis();
    const bobBasis = generateRandomBasis();

    const stepData = simulatorRef.current.simulateStep(
      state.currentStep + 1,
      aliceBit,
      aliceBasis,
      bobBasis
    );

    dispatch({ type: "EXECUTE_STEP", stepData, keyLength: config.keyLength });
  }, [state.isComplete, state.currentStep, config.keyLength]);

  // Controla a simulação automática
  useEffect(() => {
    if (
      state.isRunning &&
      !state.isComplete &&
      state.currentStep < config.keyLength
    ) {
      // Adiciona um delay inicial antes de começar o loop para dar tempo da animação se preparar
      const initialDelay = state.currentStep === 0 ? speedRef.current : 0;

      const startTimeout = setTimeout(() => {
        intervalRef.current = setInterval(() => {
          executeStep();
        }, speedRef.current);
      }, initialDelay);

      return () => {
        clearTimeout(startTimeout);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [
    state.isRunning,
    state.isComplete,
    state.currentStep,
    config.keyLength,
    executeStep,
  ]);

  // Inicia simulação automática
  const startAutoSimulation = useCallback((speed: number = 1000) => {
    speedRef.current = speed;
    dispatch({ type: "START_SIMULATION", speed });
  }, []);

  // Para a simulação
  const stopSimulation = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    dispatch({ type: "STOP_SIMULATION" });
  }, []);

  // Reseta a simulação
  const resetSimulation = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    simulatorRef.current = new BB84Simulator(config);
    dispatch({ type: "RESET_SIMULATION", config });
  }, [config]);

  // Executa simulação completa instantaneamente
  const runCompleteSimulation = useCallback(() => {
    // Para qualquer simulação em andamento
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Reinicia o simulador para garantir uma simulação completa limpa
    simulatorRef.current = new BB84Simulator(config);

    const result = simulatorRef.current.simulate();

    // Gera histórico de passos para a simulação completa
    const steps: ISimulationStep[] = [];
    for (let i = 0; i < result.aliceBits.length; i++) {
      const stepData = simulatorRef.current.simulateStep(
        i + 1,
        result.aliceBits[i] as 0 | 1,
        result.aliceBases[i],
        result.bobBases[i]
      );
      steps.push(stepData);
    }

    dispatch({ type: "SET_COMPLETE_SIMULATION_DATA", result, steps });

    return result;
  }, [config]);

  // Seleciona um passo específico (para navegação no histórico)
  const selectStep = useCallback((stepIndex: number) => {
    dispatch({ type: "SELECT_STEP", stepIndex });
  }, []);

  // Retorna o estado atual e as funções de controle
  return {
    ...state,
    executeStep,
    startAutoSimulation,
    stopSimulation,
    resetSimulation,
    runCompleteSimulation,
    selectStep,
  };
};
