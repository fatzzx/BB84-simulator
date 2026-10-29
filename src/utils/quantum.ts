import { TMeasurementBasis } from "@/types";

/**
 * Gera um número aleatório seguro em [0, 1)
 */
export function secureRandom(): number {
  if (globalThis.crypto?.getRandomValues) {
    const array = new Uint32Array(1);
    globalThis.crypto.getRandomValues(array);
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
