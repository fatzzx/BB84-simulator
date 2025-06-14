import { IQuantumState, TMeasurementBasis } from "@/types";
import { QUANTUM_STATES } from "@/constants/quantum";

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
  return secureRandom() < 0.5 ? "computational" : "hadamard";
}

/**
 * Prepara um estado quântico baseado no bit e na base
 */
export function prepareQuantumState(
  bit: 0 | 1,
  basis: TMeasurementBasis
): IQuantumState {
  if (basis === "computational") {
    return bit === 0 ? QUANTUM_STATES.ZERO : QUANTUM_STATES.ONE;
  } else {
    return bit === 0 ? QUANTUM_STATES.PLUS : QUANTUM_STATES.MINUS;
  }
}
