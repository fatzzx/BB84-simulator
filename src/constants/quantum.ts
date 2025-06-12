import { IQuantumState, IQuantumStates, TQuantumOperator } from '@/types';

// Estados quânticos básicos do protocolo BB84
export const QUANTUM_STATES: IQuantumStates = {
  // |0⟩ - Estado computacional 0
  ZERO: {
    amplitude0: 1,
    amplitude1: 0,
    phase: 0,
  },
  
  // |1⟩ - Estado computacional 1
  ONE: {
    amplitude0: 0,
    amplitude1: 1,
    phase: 0,
  },
  
  // |+⟩ - Estado superposição positiva (base Hadamard)
  PLUS: {
    amplitude0: Math.sqrt(0.5),
    amplitude1: Math.sqrt(0.5),
    phase: 0,
  },
  
  // |−⟩ - Estado superposição negativa (base Hadamard)
  MINUS: {
    amplitude0: Math.sqrt(0.5),
    amplitude1: -Math.sqrt(0.5),
    phase: Math.PI,
  },
};

// Operadores quânticos fundamentais
export const QUANTUM_OPERATORS = {
  // Porta Hadamard
  HADAMARD: [
    [Math.sqrt(0.5), Math.sqrt(0.5)],
    [Math.sqrt(0.5), -Math.sqrt(0.5)],
  ] as TQuantumOperator,
  
  // Matriz identidade
  IDENTITY: [
    [1, 0],
    [0, 1],
  ] as TQuantumOperator,
  
  // Porta Pauli-X (NOT quântico)
  PAULI_X: [
    [0, 1],
    [1, 0],
  ] as TQuantumOperator,
  
  // Porta Pauli-Z
  PAULI_Z: [
    [1, 0],
    [0, -1],
  ] as TQuantumOperator,
};

// Configurações padrão do protocolo BB84
export const BB84_CONFIG = {
  DEFAULT_KEY_LENGTH: 100,
  EAVESDROP_DETECTION_THRESHOLD: 0.11, // ~11% error rate threshold
  MAX_ERROR_RATE: 0.25, // 25% maximum acceptable error rate
  MIN_KEY_LENGTH: 10,
  MAX_KEY_LENGTH: 1000,
};

// Constantes de visualização
export const VISUALIZATION = {
  ANIMATION_DURATION: 1000, // ms
  QUBIT_COLORS: {
    ZERO: '#00d4ff',
    ONE: '#ff6b6b',
    PLUS: '#00ff88',
    MINUS: '#ffab00',
  },
  BASIS_COLORS: {
    computational: '#00d4ff',
    hadamard: '#9d4edd',
  },
}; 