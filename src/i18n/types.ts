// Tipos para as traduções - garante type safety
export interface TranslationResources {
  app: {
    title: string;
    subtitle: string;
  };
  simulation: {
    title: string;
    transmissions: string;
    errorRate: string;
    speed: string;
    reset: string;
    howToUse: string;
    instructions: {
      transmissions: string;
      finalKey: string;
      errorRate: string;
      sameBases: string;
      differentBases: string;
    };
  };
  controls: {
    step: string;
    auto: string;
    pause: string;
    complete: string;
    stepTooltip: string;
    autoTooltip: string;
    pauseTooltip: string;
    completeTooltip: string;
  };
  status: {
    running: string;
    transmitting: string;
    complete: string;
    ready: string;
  };
  characters: {
    alice: {
      name: string;
      preparing: string;
      bit: string;
      base: string;
      polarization: string;
      quantumState: string;
    };
    bob: {
      name: string;
      measuring: string;
      base: string;
      result: string;
      detector: string;
      quantumState: string;
      basesMatch: string;
      basesDifferent: string;
      bitIncluded: string;
      bitDiscarded: string;
    };
  };
  stepInfo: {
    transmissions: string;
    aliceBit: string;
    aliceBase: string;
    bobBase: string;
    basesMatch: string;
    yes: string;
    no: string;
    bitPreserved: string;
  };
  sharedKey: {
    title: string;
    finalKey: string;
    empty: string;
  };
  statistics: {
    bitsTransmitted: string;
    matchingBases: string;
    keyEfficiency: string;
    errorRate: string;
  };
  history: {
    title: string;
    step: string;
    alice: string;
    bob: string;
    result: string;
    equal: string;
    different: string;
    kept: string;
    discarded: string;
    bit: string;
    base: string;
    first: string;
    previous: string;
    next: string;
    last: string;
  };
  language: {
    toggle: string;
    portuguese: string;
    english: string;
  };
}

// Tipo para as chaves de tradução (para autocomplete)
export type TranslationKey =
  | keyof TranslationResources
  | `${keyof TranslationResources}.${string}`;
