// Tipos fundamentais para o protocolo BB84

// Estado quântico básico
export interface IQuantumState {
  amplitude0: number;
  amplitude1: number;
  phase: number;
}

// Bases de medição
export type TMeasurementBasis = "computational" | "hadamard";

// Resultado de medição
export interface IMeasurementResult {
  bit: 0 | 1;
  basis: TMeasurementBasis;
  probability: number;
}

// Bit quântico preparado
export interface IQuantumBit {
  state: IQuantumState;
  preparationBasis: TMeasurementBasis;
  bitValue: 0 | 1;
}

// Uma transmissão (um fóton) da simulação, usada na visualização passo-a-passo
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
    state: IQuantumState;
  };
  result: {
    basesMatch: boolean;
    bitPreserved: boolean;
    measurement: 0 | 1;
    willKeep: boolean;
  };
}

// Configurações da simulação
export interface ISimulationConfig {
  keyLength: number; // Número de transmissões/bits a serem enviados por Alice
  eavesdropperPresent: boolean;
  visualizationSpeed: number;
}

// Estados quânticos pré-definidos
export interface IQuantumStates {
  ZERO: IQuantumState;
  ONE: IQuantumState;
  PLUS: IQuantumState;
  MINUS: IQuantumState;
}
