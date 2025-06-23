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

// Resultado da simulação BB84
export interface IBB84SimulationResult {
  aliceBits: number[];
  aliceBases: TMeasurementBasis[];
  bobBases: TMeasurementBasis[];
  bobMeasurements: number[];
  sharedKey: number[];
  keyLength: number; // Tamanho real da chave resultante após reconciliação das bases
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

// Operadores quânticos
export type TQuantumOperator = number[][];

// Resultado de detecção de eavesdropping
export interface IEavesdropDetection {
  detected: boolean;
  threshold: number;
}
