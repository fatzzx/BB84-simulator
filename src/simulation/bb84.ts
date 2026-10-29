import {
  IQuantumBit,
  TMeasurementBasis,
  IMeasurementResult,
  ISimulationConfig,
  ISimulationStep,
} from "@/types";
import { QUANTUM_STATES } from "@/constants/quantum";
import { randomBit, randomBasis } from "@/utils/quantum";

// Ângulo de polarização (em graus) de um bit em uma base
const getAngle = (bit: 0 | 1, basis: TMeasurementBasis): number => {
  if (basis === "computational") {
    return bit === 0 ? 0 : 90; // 0° ou 90°
  }
  return bit === 0 ? 45 : 135; // 45° ou 135°
};

export class BB84Simulator {
  private config: ISimulationConfig;

  constructor(config: ISimulationConfig) {
    this.config = config;
  }

  // Alice prepara um qubit no estado apropriado
  private prepareQubit(bit: 0 | 1, basis: TMeasurementBasis): IQuantumBit {
    let state;

    if (basis === "computational") {
      state = bit === 0 ? QUANTUM_STATES.ZERO : QUANTUM_STATES.ONE;
    } else {
      state = bit === 0 ? QUANTUM_STATES.PLUS : QUANTUM_STATES.MINUS;
    }

    return {
      state,
      preparationBasis: basis,
      bitValue: bit,
    };
  }

  // Simula interceptação de Eve (Eavesdropper)
  private simulateEavesdropping(qubit: IQuantumBit): IQuantumBit {
    if (!this.config.eavesdropperPresent) {
      return qubit;
    }

    // Eve escolhe uma base aleatória para interceptar
    const eveBasis = randomBasis();

    // Eve mede o qubit, colapsando o estado
    let eveMeasurement: 0 | 1;

    if (qubit.preparationBasis === eveBasis) {
      // Se Eve escolheu a mesma base que Alice, ela obtém o bit correto
      eveMeasurement = qubit.bitValue;
    } else {
      // Se as bases diferem, resultado é aleatório (50/50)
      eveMeasurement = randomBit();
    }

    // Eve prepara um novo qubit baseado na sua medição e envia para Bob
    return this.prepareQubit(eveMeasurement, eveBasis);
  }

  // Bob mede o qubit na base escolhida
  private measureQubit(
    qubit: IQuantumBit,
    measurementBasis: TMeasurementBasis
  ): IMeasurementResult {
    const { preparationBasis } = qubit;

    let probability: number;
    let measuredBit: 0 | 1;

    if (preparationBasis === measurementBasis) {
      // Bases iguais - resultado determinístico (sem ruído quântico)
      probability = 1;
      measuredBit = qubit.bitValue;
    } else {
      // Bases diferentes - resultado aleatório (50/50) devido à mecânica quântica
      probability = 0.5;
      measuredBit = randomBit();
    }

    return {
      bit: measuredBit,
      basis: measurementBasis,
      probability,
    };
  }

  // Simula uma transmissão (para visualização passo-a-passo)
  public simulateStep(
    step: number,
    aliceBit: 0 | 1,
    aliceBasis: TMeasurementBasis,
    bobBasis: TMeasurementBasis
  ): ISimulationStep {
    // Prepara o qubit
    let qubit = this.prepareQubit(aliceBit, aliceBasis);

    // Simula interceptação (se habilitada)
    qubit = this.simulateEavesdropping(qubit);

    // Bob mede
    const measurement = this.measureQubit(qubit, bobBasis);

    // Determina se as bases de Alice e Bob coincidem
    const basesMatch = aliceBasis === bobBasis;

    // O ângulo do fóton pode ter mudado se Eve interceptou
    const photonAngle = getAngle(qubit.bitValue, qubit.preparationBasis);

    return {
      step,
      alice: {
        bit: aliceBit,
        basis: aliceBasis,
        angle: getAngle(aliceBit, aliceBasis),
      },
      bob: {
        bit: measurement.bit,
        basis: bobBasis,
        angle: photonAngle, // Ângulo do fóton que Bob recebe
        // Orientação do detector de Bob que corresponde ao bit medido
        measurementAngle: getAngle(measurement.bit, bobBasis),
      },
      photon: {
        polarization: photonAngle,
        state: qubit.state,
      },
      result: {
        basesMatch,
        bitPreserved: basesMatch && aliceBit === measurement.bit,
        measurement: measurement.bit,
        willKeep: basesMatch,
      },
    };
  }

  // Simula uma transmissão com bit e bases sorteados por Alice e Bob
  public simulateRandomStep(step: number): ISimulationStep {
    return this.simulateStep(step, randomBit(), randomBasis(), randomBasis());
  }

  // Simula todas as transmissões configuradas de uma vez
  // (keyLength representa o número de transmissões, não o tamanho da chave final)
  public simulateAll(): ISimulationStep[] {
    return Array.from({ length: this.config.keyLength }, (_, i) =>
      this.simulateRandomStep(i + 1)
    );
  }
}
