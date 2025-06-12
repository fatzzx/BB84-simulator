import { 
  IBB84SimulationResult, 
  IQuantumBit, 
  TMeasurementBasis, 
  IMeasurementResult,
  ISimulationConfig 
} from '@/types';
import { QUANTUM_STATES } from '@/constants/quantum';

export class BB84Simulator {
  private config: ISimulationConfig;
  
  constructor(config: ISimulationConfig) {
    this.config = config;
  }

  // Gera bit aleatório
  private generateRandomBit(): 0 | 1 {
    return Math.random() < 0.5 ? 0 : 1;
  }

  // Gera base aleatória
  private generateRandomBasis(): TMeasurementBasis {
    return Math.random() < 0.5 ? 'computational' : 'hadamard';
  }

  // Alice prepara um qubit no estado apropriado
  private prepareQubit(bit: 0 | 1, basis: TMeasurementBasis): IQuantumBit {
    let state;
    
    if (basis === 'computational') {
      state = bit === 0 ? QUANTUM_STATES.ZERO : QUANTUM_STATES.ONE;
    } else {
      state = bit === 0 ? QUANTUM_STATES.PLUS : QUANTUM_STATES.MINUS;
    }

    return {
      state,
      preparationBasis: basis,
      bitValue: bit
    };
  }

  // Bob mede o qubit na base escolhida
  private measureQubit(qubit: IQuantumBit, measurementBasis: TMeasurementBasis): IMeasurementResult {
    const { state, preparationBasis } = qubit;
    
    let probability: number;
    let measuredBit: 0 | 1;

    if (preparationBasis === measurementBasis) {
      // Bases iguais - resultado determinístico
      probability = 1;
      measuredBit = qubit.bitValue;
    } else {
      // Bases diferentes - resultado aleatório (50/50)
      probability = 0.5;
      measuredBit = this.generateRandomBit();
    }

    // Simula eavesdropping introduzindo erro
    if (this.config.eavesdropperPresent && Math.random() < this.config.errorRate) {
      measuredBit = measuredBit === 0 ? 1 : 0;
    }

    return {
      bit: measuredBit,
      basis: measurementBasis,
      probability
    };
  }

  // Simula o protocolo BB84 completo
  public simulate(): IBB84SimulationResult {
    const aliceBits: number[] = [];
    const aliceBases: TMeasurementBasis[] = [];
    const bobBases: TMeasurementBasis[] = [];
    const bobMeasurements: number[] = [];
    const sharedKey: number[] = [];

    // Gera sequência inicial mais longa para compensar descarte
    const initialLength = Math.ceil(this.config.keyLength * 2.5);

    for (let i = 0; i < initialLength; i++) {
      // 1. Alice gera bit e base aleatórios
      const aliceBit = this.generateRandomBit();
      const aliceBasis = this.generateRandomBasis();
      
      // 2. Alice prepara o qubit
      const qubit = this.prepareQubit(aliceBit, aliceBasis);
      
      // 3. Bob escolhe base aleatória para medição
      const bobBasis = this.generateRandomBasis();
      
      // 4. Bob mede o qubit
      const measurement = this.measureQubit(qubit, bobBasis);
      
      aliceBits.push(aliceBit);
      aliceBases.push(aliceBasis);
      bobBases.push(bobBasis);
      bobMeasurements.push(measurement.bit);
      
      // 5. Mantém apenas bits onde as bases coincidem
      if (aliceBasis === bobBasis && sharedKey.length < this.config.keyLength) {
        sharedKey.push(aliceBit);
      }
    }

    // Calcula taxa de erro nos bits onde as bases coincidem
    let errors = 0;
    let validComparisons = 0;
    
    for (let i = 0; i < aliceBits.length; i++) {
      if (aliceBases[i] === bobBases[i]) {
        validComparisons++;
        if (aliceBits[i] !== bobMeasurements[i]) {
          errors++;
        }
      }
    }

    const errorRate = validComparisons > 0 ? errors / validComparisons : 0;

    return {
      aliceBits,
      aliceBases,
      bobBases,
      bobMeasurements,
      sharedKey: sharedKey.slice(0, this.config.keyLength),
      errorRate,
      keyLength: Math.min(sharedKey.length, this.config.keyLength)
    };
  }

  // Simula um passo individual (para visualização passo-a-passo)
  public simulateStep(step: number, aliceBit: 0 | 1, aliceBasis: TMeasurementBasis, bobBasis: TMeasurementBasis) {
    // Prepara o qubit
    const qubit = this.prepareQubit(aliceBit, aliceBasis);
    
    // Bob mede
    const measurement = this.measureQubit(qubit, bobBasis);
    
    // Determina se as bases coincidem
    const basesMatch = aliceBasis === bobBasis;
    
    // Calcula o ângulo de polarização para visualização
    const getAngle = (bit: 0 | 1, basis: TMeasurementBasis): number => {
      if (basis === 'computational') {
        return bit === 0 ? 0 : 90; // 0° ou 90°
      } else {
        return bit === 0 ? 45 : 135; // 45° ou 135°
      }
    };

    return {
      step,
      alice: {
        bit: aliceBit,
        basis: aliceBasis,
        angle: getAngle(aliceBit, aliceBasis)
      },
      bob: {
        bit: measurement.bit,
        basis: bobBasis,
        angle: getAngle(aliceBit, aliceBasis), // Mantém ângulo original do fóton
        measurementAngle: bobBasis === 'computational' ? 0 : 45
      },
      photon: {
        polarization: getAngle(aliceBit, aliceBasis),
        state: qubit.state
      },
      result: {
        basesMatch,
        bitPreserved: basesMatch,
        measurement: measurement.bit,
        willKeep: basesMatch
      }
    };
  }
} 