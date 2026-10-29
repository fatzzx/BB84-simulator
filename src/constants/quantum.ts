import { IQuantumStates } from "@/types";

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
