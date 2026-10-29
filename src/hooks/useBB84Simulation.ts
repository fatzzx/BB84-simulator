import { useReducer, useCallback, useRef, useEffect } from "react";
import { BB84Simulator } from "@/simulation/bb84";
import { ISimulationConfig, ISimulationStep } from "@/types";

export interface ISimulationStatistics {
  totalBits: number;
  matchingBases: number;
  errorRate: number; // Fração dos bits da chave que Bob leu diferente de Alice
  keyEfficiency: number;
}

export interface ISimulationState {
  currentStep: number;
  steps: ISimulationStep[];
  sharedKey: number[];
  isRunning: boolean;
  isComplete: boolean;
  currentStepData: ISimulationStep | null;
  statistics: ISimulationStatistics;
}

// Actions para o reducer
type SimulationAction =
  | { type: "START_SIMULATION" }
  | { type: "STOP_SIMULATION" }
  | { type: "RESET_SIMULATION" }
  | { type: "EXECUTE_STEP"; stepData: ISimulationStep; keyLength: number }
  | { type: "SET_COMPLETE_SIMULATION_DATA"; steps: ISimulationStep[] }
  | { type: "SELECT_STEP"; stepIndex: number };

const createInitialState = (): ISimulationState => ({
  currentStep: 0,
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

// Deriva chave compartilhada e estatísticas a partir dos passos já simulados
const deriveFromSteps = (steps: ISimulationStep[]) => {
  const kept = steps.filter((s) => s.result.basesMatch);
  const errors = kept.filter((s) => !s.result.bitPreserved).length;

  return {
    sharedKey: kept.map((s) => s.alice.bit as number),
    statistics: {
      totalBits: steps.length,
      matchingBases: kept.length,
      errorRate: kept.length > 0 ? errors / kept.length : 0,
      keyEfficiency: steps.length > 0 ? kept.length / steps.length : 0,
    },
  };
};

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
      return createInitialState();

    case "EXECUTE_STEP": {
      const steps = [...state.steps, action.stepData];

      // Completa quando atingir o número de transmissões configurado (não tamanho da chave)
      const isComplete = steps.length >= action.keyLength;

      return {
        ...state,
        ...deriveFromSteps(steps),
        currentStep: state.currentStep + 1,
        steps,
        currentStepData: action.stepData,
        isComplete,
        isRunning: isComplete ? false : state.isRunning,
      };
    }

    case "SET_COMPLETE_SIMULATION_DATA":
      return {
        ...state,
        ...deriveFromSteps(action.steps),
        steps: action.steps,
        currentStep: action.steps.length,
        isComplete: true,
        isRunning: false,
        // O último passo vira o passo atual
        currentStepData: action.steps[action.steps.length - 1] ?? null,
      };

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
  const speedRef = useRef<number>(1000);

  const [state, dispatch] = useReducer(
    simulationReducer,
    undefined,
    createInitialState
  );

  // Atualiza simulador quando config muda
  useEffect(() => {
    simulatorRef.current = new BB84Simulator(config);
    dispatch({ type: "RESET_SIMULATION" });
  }, [config]);

  // Executa um passo da simulação
  const executeStep = useCallback(() => {
    // Evita execução se já completo (baseado no número de transmissões realizadas)
    if (state.isComplete || state.currentStep >= config.keyLength) {
      dispatch({ type: "STOP_SIMULATION" });
      return;
    }

    const stepData = simulatorRef.current.simulateRandomStep(
      state.currentStep + 1
    );

    dispatch({ type: "EXECUTE_STEP", stepData, keyLength: config.keyLength });
  }, [state.isComplete, state.currentStep, config.keyLength]);

  // Controla a simulação automática: um timeout por passo. O primeiro passo roda
  // imediatamente; os seguintes esperam o tempo da animação. O cleanup cancela o
  // timeout ao pausar, resetar ou desmontar (isRunning/currentStep mudam).
  useEffect(() => {
    if (
      !state.isRunning ||
      state.isComplete ||
      state.currentStep >= config.keyLength
    ) {
      return;
    }

    const delay = state.currentStep === 0 ? 0 : speedRef.current;
    const timeout = setTimeout(executeStep, delay);

    return () => clearTimeout(timeout);
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
    dispatch({ type: "START_SIMULATION" });
  }, []);

  // Para a simulação
  const stopSimulation = useCallback(() => {
    dispatch({ type: "STOP_SIMULATION" });
  }, []);

  // Reseta a simulação
  const resetSimulation = useCallback(() => {
    simulatorRef.current = new BB84Simulator(config);
    dispatch({ type: "RESET_SIMULATION" });
  }, [config]);

  // Executa simulação completa instantaneamente
  const runCompleteSimulation = useCallback(() => {
    simulatorRef.current = new BB84Simulator(config);
    dispatch({
      type: "SET_COMPLETE_SIMULATION_DATA",
      steps: simulatorRef.current.simulateAll(),
    });
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
