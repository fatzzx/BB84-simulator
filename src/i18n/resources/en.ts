import { TranslationResources } from "../types";

export const en: TranslationResources = {
  app: {
    title: "BB84 Protocol Simulator",
    subtitle: "Interactive Quantum Cryptography Demonstration",
  },
  simulation: {
    title: "Simulation Settings",
    transmissions: "Number of Transmissions",
    eavesdropper: "Eavesdropper (Eve) intercepting",
    eavesdropperHint: "Eve measures each photon on the way and resends it to Bob, which introduces errors in the key",
    speed: "Speed",
    reset: "🔄 Reset",
  },
  controls: {
    step: "▶️ Step",
    auto: "🔄 Auto",
    pause: "⏸️ Pause",
    complete: "⚡ Complete",
    stepTooltip: "Execute one step of the simulation",
    autoTooltip: "Run automatically at configured speed",
    pauseTooltip: "Pause automatic simulation",
    completeTooltip: "Execute entire simulation instantly",
  },
  status: {
    running: "🔄 Running...",
    transmitting: "Transmitting...",
    complete: "✅ Complete!",
    ready: "⏹️ Ready",
    firstHint: "Click Step to let Alice send the first photon",
  },
  tutorial: {
    open: "How it works",
    close: "Close tutorial",
    previous: "Back",
    next: "Next",
    done: "Done",
    steps: {
      intro: {
        title: "Welcome to BB84!",
        body: "BB84 is a quantum cryptography protocol: Alice and Bob agree on a secret key by exchanging polarized photons, and any eavesdropper who tries to listen leaves traces. Let's tour the screen.",
      },
      alice: {
        title: "Alice, the sender",
        body: "For each transmission, Alice picks a random bit (0 or 1) and a basis: Z (+) or X (×). The basis sets the photon's polarization: 0° or 90° in the Z basis, 45° or 135° in the X basis.",
      },
      channel: {
        title: "The quantum channel",
        body: "This is where the photon travels from Alice to Bob. If an eavesdropper is intercepting, this is the path she acts on.",
      },
      bob: {
        title: "Bob, the receiver",
        body: "Bob doesn't know which basis Alice used, so he picks his own basis at random to measure. With the same basis he reads the right bit; with a different one, the result is random.",
      },
      keys: {
        title: "Building the key",
        body: "Afterwards, Alice and Bob compare only their bases, never the bits. Same basis: the bit joins the key. Different basis: the bit is discarded. On average, half of the bits survive.",
      },
      step: {
        title: "Step",
        body: "Runs one transmission at a time. Ideal for following each stage at your own pace.",
      },
      auto: {
        title: "Auto",
        body: "Runs the transmissions in sequence, at the speed chosen in the settings.",
      },
      pause: {
        title: "Pause",
        body: "Stops Auto mode. It is only active while the simulation is running.",
      },
      complete: {
        title: "Complete",
        body: "Runs all transmissions at once and instantly shows the key, the statistics and the history.",
      },
      settings: {
        title: "Settings",
        body: "Choose how many photons Alice will send and the animation speed. Reset clears the simulation. The controls lock while Auto is running.",
      },
      eve: {
        title: "Eavesdropper (Eve)",
        body: "Turn it on to put a spy in the middle of the channel, measuring every photon that passes by. This introduces about 25% errors in the key, and the Error Rate shows she was detected. Now go experiment!",
      },
    },
  },
  characters: {
    alice: {
      name: "Alice",
      preparing: "Preparing Qubit",
      bit: "Bit:",
      base: "Base:",
      polarization: "Photon Polarization",
      quantumState: "Quantum State",
    },
    bob: {
      name: "Bob",
      measuring: "Measuring Qubit",
      base: "Base:",
      result: "Result:",
      detector: "Polarized Detector",
      quantumState: "Measured State",
      basesMatch: "Bases match",
      basesDifferent: "Different bases",
      bitIncluded: "Bit will be included in key",
      bitDiscarded: "Bit will be discarded",
    },
    eve: {
      name: "Eve",
      intercepting: "Eve intercepting...",
    },
  },
  stepInfo: {
    transmissions: "Transmissions:",
    aliceBit: "Alice's Bit:",
    aliceBase: "Alice's Base:",
    bobBase: "Bob's Base:",
    basesMatch: "Bases match:",
    yes: "Yes",
    no: "No",
    bitPreserved: "Bit preserved:",
  },
  sharedKey: {
    title: "Shared Key",
    finalKey: "Final Key:",
    empty: "(Waiting for transmissions...)",
  },
  statistics: {
    bitsTransmitted: "Bits Transmitted",
    matchingBases: "Matching Bases",
    keyEfficiency: "Key Efficiency",
    errorRate: "Error Rate",
  },
  history: {
    title: "Step History",
    step: "Step",
    alice: "Alice",
    bob: "Bob",
    result: "Result",
    equal: "Equal",
    different: "Different",
    kept: "Kept",
    discarded: "Discarded",
    bit: "Bit:",
    base: "Base:",
    first: "⤴ First",
    previous: "← Previous",
    next: "Next →",
    last: "⤵ Last",
    showing: "Showing {{from}} to {{to}} of {{total}} steps",
  },
  footer: {
    developedBy: "Developed by",
  },
  language: {
    toggle: "Change language",
    portuguese: "Português",
    english: "English",
  },
};
