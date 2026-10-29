import { TranslationResources } from "../types";

export const pt: TranslationResources = {
  app: {
    title: "Simulador do Protocolo BB84",
    subtitle: "Demonstração Interativa de Criptografia Quântica",
  },
  simulation: {
    title: "Configurações da Simulação",
    transmissions: "Número de Transmissões",
    eavesdropper: "Espião (Eve) interceptando",
    eavesdropperHint: "Eve mede cada fóton no caminho e reenvia para Bob, o que introduz erros na chave",
    speed: "Velocidade",
    reset: "🔄 Resetar",
  },
  controls: {
    step: "▶️ Passo",
    auto: "🔄 Auto",
    pause: "⏸️ Pausar",
    complete: "⚡ Completa",
    stepTooltip: "Execute um passo da simulação",
    autoTooltip: "Execute automaticamente na velocidade configurada",
    pauseTooltip: "Pausar a simulação automática",
    completeTooltip: "Execute toda a simulação instantaneamente",
  },
  status: {
    running: "🔄 Executando...",
    transmitting: "Transmitindo...",
    complete: "✅ Concluída!",
    ready: "⏹️ Pronto",
    firstHint: "Clique em Passo para Alice enviar o primeiro fóton",
  },
  tutorial: {
    open: "Como funciona",
    close: "Fechar tutorial",
    previous: "Voltar",
    next: "Próximo",
    done: "Concluir",
    steps: {
      intro: {
        title: "Bem-vindo ao BB84!",
        body: "O BB84 é um protocolo de criptografia quântica: Alice e Bob combinam uma chave secreta trocando fótons polarizados, e qualquer espião que tentar ouvir deixa rastros. Vamos conhecer a tela.",
      },
      alice: {
        title: "Alice, a remetente",
        body: "A cada transmissão, Alice sorteia um bit (0 ou 1) e uma base: Z (+) ou X (×). A base define a polarização do fóton: 0° ou 90° na base Z, 45° ou 135° na base X.",
      },
      channel: {
        title: "O canal quântico",
        body: "É por aqui que o fóton viaja de Alice até Bob. Se houver um espião interceptando, é neste caminho que ele age.",
      },
      bob: {
        title: "Bob, o receptor",
        body: "Bob não sabe qual base Alice usou, então sorteia a própria base para medir. Com a mesma base ele lê o bit certo; com outra, o resultado é aleatório.",
      },
      keys: {
        title: "Montando a chave",
        body: "Depois, Alice e Bob comparam só as bases, nunca os bits. Bases iguais: o bit entra na chave. Bases diferentes: o bit é descartado. Em média, metade dos bits sobrevive.",
      },
      step: {
        title: "Passo",
        body: "Executa uma transmissão por vez. Ideal para acompanhar cada etapa com calma.",
      },
      auto: {
        title: "Auto",
        body: "Roda as transmissões em sequência, na velocidade escolhida nas configurações.",
      },
      pause: {
        title: "Pausar",
        body: "Interrompe o modo Auto. Só fica ativo enquanto a simulação está rodando.",
      },
      complete: {
        title: "Completa",
        body: "Executa todas as transmissões de uma vez e mostra na hora a chave, as estatísticas e o histórico.",
      },
      settings: {
        title: "Configurações",
        body: "Escolha quantos fótons Alice vai enviar e a velocidade da animação. Resetar limpa a simulação. Os controles ficam travados enquanto o Auto roda.",
      },
      eve: {
        title: "Espião (Eve)",
        body: "Ligue para colocar um espião no meio do canal, medindo cada fóton que passa por ela. Isso introduz cerca de 25% de erros na chave, e a Taxa de Erro mostra que ela foi detectada. Agora é só experimentar!",
      },
    },
  },
  characters: {
    alice: {
      name: "Alice",
      preparing: "Preparando Qubit",
      bit: "Bit:",
      base: "Base:",
      polarization: "Polarização do Fóton",
      quantumState: "Estado Quântico",
    },
    bob: {
      name: "Bob",
      measuring: "Medindo Qubit",
      base: "Base:",
      result: "Resultado:",
      detector: "Detector Polarizado",
      quantumState: "Estado Medido",
      basesMatch: "Bases coincidem",
      basesDifferent: "Bases diferentes",
      bitIncluded: "Bit será incluído na chave",
      bitDiscarded: "Bit será descartado",
    },
    eve: {
      name: "Eve",
      intercepting: "Eve interceptando...",
    },
  },
  stepInfo: {
    transmissions: "Transmissões:",
    aliceBit: "Bit de Alice:",
    aliceBase: "Base de Alice:",
    bobBase: "Base de Bob:",
    basesMatch: "Bases combinam:",
    yes: "Sim",
    no: "Não",
    bitPreserved: "Bit preservado:",
  },
  sharedKey: {
    title: "Chave Compartilhada",
    finalKey: "Chave Final:",
    empty: "(Aguardando transmissões...)",
  },
  statistics: {
    bitsTransmitted: "Bits Transmitidos",
    matchingBases: "Bases Compatíveis",
    keyEfficiency: "Eficiência da Chave",
    errorRate: "Taxa de Erro",
  },
  history: {
    title: "Histórico das Etapas",
    step: "Passo",
    alice: "Alice",
    bob: "Bob",
    result: "Resultado",
    equal: "Iguais",
    different: "Diferentes",
    kept: "Mantido",
    discarded: "Descartado",
    bit: "Bit:",
    base: "Base:",
    first: "⤴ Primeira",
    previous: "← Anterior",
    next: "Próxima →",
    last: "⤵ Última",
    showing: "Mostrando {{from}} a {{to}} de {{total}} passos",
  },
  footer: {
    developedBy: "Desenvolvido por",
  },
  language: {
    toggle: "Alterar idioma",
    portuguese: "Português",
    english: "English",
  },
};
