import { IQuantumState, TMeasurementBasis, IMeasurementResult, TQuantumOperator } from '@/types';
import { QUANTUM_STATES, QUANTUM_OPERATORS } from '@/constants/quantum';

/**
 * Gera um número aleatório seguro
 */
export function secureRandom(): number {
  if (window.crypto && window.crypto.getRandomValues) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] / (0xffffffff + 1);
  }
  return Math.random();
}

/**
 * Gera um bit aleatório (0 ou 1)
 */
export function randomBit(): 0 | 1 {
  return secureRandom() < 0.5 ? 0 : 1;
}

/**
 * Gera uma base aleatória para medição
 */
export function randomBasis(): TMeasurementBasis {
  return secureRandom() < 0.5 ? 'computational' : 'hadamard';
}

/**
 * Prepara um estado quântico baseado no bit e na base
 */
export function prepareQuantumState(bit: 0 | 1, basis: TMeasurementBasis): IQuantumState {
  if (basis === 'computational') {
    return bit === 0 ? QUANTUM_STATES.ZERO : QUANTUM_STATES.ONE;
  } else {
    return bit === 0 ? QUANTUM_STATES.PLUS : QUANTUM_STATES.MINUS;
  }
}

/**
 * Aplica um operador quântico a um estado
 */
export function applyOperator(state: IQuantumState, operator: TQuantumOperator): IQuantumState {
  const stateVector = [state.amplitude0, state.amplitude1];
  const newAmplitude0 = operator[0][0] * stateVector[0] + operator[0][1] * stateVector[1];
  const newAmplitude1 = operator[1][0] * stateVector[0] + operator[1][1] * stateVector[1];
  
  return {
    amplitude0: newAmplitude0,
    amplitude1: newAmplitude1,
    phase: state.phase,
  };
}

/**
 * Mede um estado quântico em uma base específica
 */
export function measureQuantumState(state: IQuantumState, basis: TMeasurementBasis): IMeasurementResult {
  let measurementState = state;
  
  // Se medindo na base Hadamard, aplica a transformação Hadamard primeiro
  if (basis === 'hadamard') {
    measurementState = applyOperator(state, QUANTUM_OPERATORS.HADAMARD);
  }
  
  // Calcula probabilidades
  const prob0 = measurementState.amplitude0 ** 2;
  const prob1 = measurementState.amplitude1 ** 2;
  
  // Normaliza as probabilidades (garante que somem 1)
  const totalProb = prob0 + prob1;
  const normalizedProb0 = prob0 / totalProb;
  
  // Realiza a medição probabilística
  const randomValue = secureRandom();
  const measuredBit: 0 | 1 = randomValue < normalizedProb0 ? 0 : 1;
  
  return {
    bit: measuredBit,
    basis,
    probability: measuredBit === 0 ? normalizedProb0 : (1 - normalizedProb0),
  };
}

/**
 * Calcula a fidelidade entre dois estados quânticos
 */
export function calculateFidelity(state1: IQuantumState, state2: IQuantumState): number {
  const overlap = state1.amplitude0 * state2.amplitude0 + state1.amplitude1 * state2.amplitude1;
  return Math.abs(overlap) ** 2;
}

/**
 * Verifica se um estado quântico está normalizado
 */
export function isNormalized(state: IQuantumState, tolerance: number = 1e-10): boolean {
  const norm = state.amplitude0 ** 2 + state.amplitude1 ** 2;
  return Math.abs(norm - 1) < tolerance;
}

/**
 * Normaliza um estado quântico
 */
export function normalizeState(state: IQuantumState): IQuantumState {
  const norm = Math.sqrt(state.amplitude0 ** 2 + state.amplitude1 ** 2);
  
  if (norm === 0) {
    throw new Error('Cannot normalize zero state');
  }
  
  return {
    amplitude0: state.amplitude0 / norm,
    amplitude1: state.amplitude1 / norm,
    phase: state.phase,
  };
} 