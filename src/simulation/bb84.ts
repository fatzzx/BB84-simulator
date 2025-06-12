import { 
  IBB84SimulationResult, 
  IQuantumBit, 
  TMeasurementBasis, 
  IMeasurementResult,
  ISimulationConfig 
} from '@/types';
import { QUANTUM_STATES } from '@/constants/quantum';
import { secureRandom, randomBit, randomBasis } from '@/utils/quantum';

export class BB84Simulator {
  private config: ISimulationConfig;
  
  constructor(config: ISimulationConfig) {
    this.config = config;
  }

  // Gera bit aleatório usando a função segura
  private generateRandomBit(): 0 | 1 {
    return randomBit();
  }

  // Gera base aleatória usando a função segura
  private generateRandomBasis(): TMeasurementBasis {
    return randomBasis();
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

  // Simula interceptação de Eve (Eavesdropper)
  private simulateEavesdropping(qubit: IQuantumBit): IQuantumBit {
    if (!this.config.eavesdropperPresent) {
      return qubit;
    }

    // Eve escolhe uma base aleatória para interceptar
    const eveBasis = this.generateRandomBasis();
    
    // Eve mede o qubit, colapsando o estado
    let eveMeasurement: 0 | 1;
    
    if (qubit.preparationBasis === eveBasis) {
      // Se Eve escolheu a mesma base que Alice, ela obtém o bit correto
      eveMeasurement = qubit.bitValue;
    } else {
      // Se as bases diferem, resultado é aleatório (50/50)
      eveMeasurement = this.generateRandomBit();
    }

    // Eve prepara um novo qubit baseado na sua medição e envia para Bob
    return this.prepareQubit(eveMeasurement, eveBasis);
  }

  // Bob mede o qubit na base escolhida
  private measureQubit(qubit: IQuantumBit, measurementBasis: TMeasurementBasis): IMeasurementResult {
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
      measuredBit = this.generateRandomBit();
    }

    // Aplica ruído do canal (se configurado)
    if (this.config.errorRate > 0 && secureRandom() < this.config.errorRate) {
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

    // Estima o número de bits necessários considerando:
    // - 50% das bases coincidem em média
    // - Margem de segurança de 25% para variabilidade estatística
    const estimatedBitsNeeded = Math.ceil(this.config.keyLength / 0.5 * 1.25);

    for (let i = 0; i < estimatedBitsNeeded && sharedKey.length < this.config.keyLength; i++) {
      // 1. Alice gera bit e base aleatórios
      const aliceBit = this.generateRandomBit();
      const aliceBasis = this.generateRandomBasis();
      
      // 2. Alice prepara o qubit
      let qubit = this.prepareQubit(aliceBit, aliceBasis);
      
      // 3. Simula interceptação de Eve (se presente)
      qubit = this.simulateEavesdropping(qubit);
      
      // 4. Bob escolhe base aleatória para medição
      const bobBasis = this.generateRandomBasis();
      
      // 5. Bob mede o qubit
      const measurement = this.measureQubit(qubit, bobBasis);
      
      aliceBits.push(aliceBit);
      aliceBases.push(aliceBasis);
      bobBases.push(bobBasis);
      bobMeasurements.push(measurement.bit);
      
      // 6. Mantém apenas bits onde as bases de Alice e Bob coincidem
      if (aliceBasis === bobBasis) {
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
    let qubit = this.prepareQubit(aliceBit, aliceBasis);
    
    // Simula interceptação (se habilitada)
    const originalQubit = { ...qubit };
    qubit = this.simulateEavesdropping(qubit);
    
    // Bob mede
    const measurement = this.measureQubit(qubit, bobBasis);
    
    // Determina se as bases de Alice e Bob coincidem
    const basesMatch = aliceBasis === bobBasis;
    
    // Calcula o ângulo de polarização para visualização
    const getAngle = (bit: 0 | 1, basis: TMeasurementBasis): number => {
      if (basis === 'computational') {
        return bit === 0 ? 0 : 90; // 0° ou 90°
      } else {
        return bit === 0 ? 45 : 135; // 45° ou 135°
      }
    };

    // Determina o ângulo de medição de Bob baseado na sua base
    const getBobMeasurementAngle = (basis: TMeasurementBasis): number => {
      if (basis === 'computational') {
        // Para base computacional, escolhe entre 0° e 90°
        return randomBit() === 0 ? 0 : 90;
      } else {
        // Para base Hadamard, escolhe entre 45° e 135°
        return randomBit() === 0 ? 45 : 135;
      }
    };

    const aliceAngle = getAngle(aliceBit, aliceBasis);
    const bobMeasurementAngle = getBobMeasurementAngle(bobBasis);

    // O ângulo do fóton pode ter mudado se Eve interceptou
    const photonAngle = getAngle(qubit.bitValue, qubit.preparationBasis);

    return {
      step,
      alice: {
        bit: aliceBit,
        basis: aliceBasis,
        angle: aliceAngle
      },
      bob: {
        bit: measurement.bit,
        basis: bobBasis,
        angle: photonAngle, // Ângulo do fóton que Bob recebe
        measurementAngle: bobMeasurementAngle
      },
      photon: {
        polarization: photonAngle,
        state: qubit.state
      },
      result: {
        basesMatch,
        bitPreserved: basesMatch && (aliceBit === measurement.bit),
        measurement: measurement.bit,
        willKeep: basesMatch
      }
    };
  }
} 