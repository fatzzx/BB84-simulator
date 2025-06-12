# Simulador do Protocolo BB84 - Versão Interativa ✨

Um simulador visual e interativo do protocolo BB84 de criptografia quântica, com visualização passo-a-passo de Alice, Bob e fótons em trânsito.

## 🎯 Principais Melhorias Implementadas

### ✨ Interface Totalmente Interativa
- **Alice e Bob visuais**: Avatares animados com indicadores de atividade  
- **Fótons em movimento**: Animação realista dos fótons viajando entre Alice e Bob
- **Bases com angulação**: Visualização das polarizações (0°, 45°, 90°, 135°)
- **Simulação passo-a-passo**: Controle completo da execução

### 🔬 Funcionalidades Avançadas
- **Lógica BB84 real**: Implementação funcional completa do protocolo
- **Detecção de eavesdropping**: Simulação de espionagem com detecção automática
- **Estatísticas em tempo real**: Métricas de eficiência e taxa de erro
- **Controles intuitivos**: Interface amigável com instruções claras

### 🎨 Visualização Aprimorada
- **Estados quânticos**: Representação visual clara de |0⟩, |1⟩, |+⟩, |-⟩
- **Polarização de fótons**: Visualização da orientação angular
- **Bases de medição**: Detectores visuais de Bob com diferentes orientações
- **Feedback instantâneo**: Indicadores de sucesso/falha das medições

## 🚀 Como Usar

### Execução Rápida
```bash
npm install
npm run dev
# Abra http://localhost:3000
```

### Interface Principal

1. **Configuração**:
   - **Tamanho da Chave**: 5-20 bits para a chave final
   - **Taxa de Erro**: 0-25% (simula eavesdropping/espionagem)
   - **Velocidade**: 500-3000ms por passo de simulação

2. **Controles de Simulação**:
   - **▶️ Próximo Passo**: Executa um passo manual da simulação
   - **🔄 Auto Play**: Execução automática na velocidade configurada
   - **⏸️ Pausar**: Para a execução automática
   - **🔄 Resetar**: Reinicia a simulação do zero
   - **⚡ Simulação Completa**: Executa tudo instantaneamente

3. **Visualização em Tempo Real**:
   - **Alice (lado esquerdo)**: Prepara qubits com bit e base aleatórios
   - **Canal Quântico (centro)**: Fóton viaja com animação e informações detalhadas
   - **Bob (lado direito)**: Mede com base aleatória e mostra resultado

## 🔬 Como Funciona o Protocolo BB84

### Etapas da Simulação

1. **Preparação (Alice)**:
   - Gera bit aleatório (0 ou 1)
   - Escolhe base aleatória (Z: 0°/90° ou X: 45°/135°)
   - Prepara qubit no estado quântico correspondente

2. **Transmissão**:
   - Fóton viaja de Alice para Bob através do canal quântico
   - Mantém polarização original durante o trajeto
   - Visualização da onda polarizada em movimento

3. **Medição (Bob)**:
   - Escolhe base aleatória para medição (independente de Alice)
   - Detector orientado conforme a base escolhida
   - Resultado probabilístico baseado na física quântica

4. **Reconciliação e Destilação**:
   - Bases iguais → Bit mantido na chave final
   - Bases diferentes → Bit descartado
   - Estatísticas atualizadas em tempo real

### Estados Quânticos Visualizados

- **|0⟩**: Base Z (computacional), polarização 0° (horizontal)
- **|1⟩**: Base Z (computacional), polarização 90° (vertical)  
- **|+⟩**: Base X (Hadamard), polarização 45° (diagonal)
- **|-⟩**: Base X (Hadamard), polarização 135° (anti-diagonal)

### Detecção de Eavesdropping

- Taxa de erro > 11% indica possível espião (Eve)
- Visualização de alerta vermelho quando detectado
- Em sistemas reais, Alice e Bob abortariam a transmissão

## 🏗️ Arquitetura Técnica

### Componentes Principais

```typescript
src/
├── components/
│   ├── Alice.tsx              # Visualização de Alice com preparação
│   ├── Bob.tsx                # Visualização de Bob com medição
│   ├── Photon.tsx             # Animação do fóton em trânsito
│   └── SimulationControls.tsx # Painel de controle
├── simulation/
│   └── bb84.ts                # Lógica completa do protocolo
├── hooks/
│   └── useBB84Simulation.ts   # Hook para gerenciar estado
├── types/index.ts             # Definições TypeScript
└── constants/quantum.ts       # Estados e operadores quânticos
```

### Tecnologias Implementadas

- **React 18** + **TypeScript**: Interface reativa e totalmente tipada
- **Tailwind CSS**: Estilização moderna e responsiva
- **Custom Hooks**: Gerenciamento de estado complexo
- **Animações CSS**: Transições suaves e efeitos visuais
- **Vite**: Build rápida com hot reload

## 📊 Métricas e Estatísticas em Tempo Real

- **Bits transmitidos**: Total de qubits enviados por Alice
- **Bases compatíveis**: Número de medições com bases iguais
- **Taxa de erro**: Percentual de bits incorretos (detecção de Eve)
- **Eficiência da chave**: Ratio de bits úteis vs transmitidos

## 🎓 Valor Educacional

### Conceitos de Física Quântica Demonstrados

1. **Mecânica Quântica**:
   - Superposição de estados quânticos
   - Colapso da função de onda na medição
   - Bases de medição ortogonais
   - Princípio da incerteza de Heisenberg

2. **Criptografia Quântica**:
   - Distribuição de chaves quanticamente segura
   - Detecção automática de interceptação
   - Reconciliação e amplificação de privacidade
   - Teorema da não-clonagem quântica

3. **Protocolos de Comunicação**:
   - Troca de informações clássicas
   - Estimativa de parâmetros de segurança
   - Correção de erros
   - Verificação de autenticidade

### Interface Educativa

- **Instruções claras**: Guia de como usar cada controle
- **Feedback visual imediato**: Resultados mostrados instantaneamente
- **Informações contextuais**: Estado atual da simulação sempre visível
- **Analogias visuais**: Polarização como conceito físico tangível

## 🔮 Roadmap e Próximos Passos

### Melhorias Planejadas

- **Modo tutorial interativo**: Guia passo-a-passo para iniciantes
- **Visualização 3D**: Representação tridimensional dos estados quânticos
- **Outros protocolos**: Implementação de E91, SARG04, B92
- **Análise estatística avançada**: Gráficos e métricas detalhadas
- **Simulação de ruído**: Modelagem de canais quânticos realistas

### Otimizações Técnicas

- **Performance**: Melhor gestão de animações e re-renders
- **Responsividade**: Adaptação completa para dispositivos móveis
- **Acessibilidade**: Suporte a leitores de tela e navegação por teclado
- **Internacionalização**: Suporte a múltiplos idiomas

## 📈 Análise da Implementação

### Escalabilidade ⚡
A arquitetura modular permite fácil extensão com novos protocolos quânticos e tipos de visualização. Componentes isolados facilitam manutenção e adição de funcionalidades.

### Manutenibilidade 🔧
- TypeScript garante type safety, reduzindo bugs em tempo de desenvolvimento
- Hooks customizados encapsulam lógica complexa de forma reutilizável
- Estrutura clara de pastas facilita navegação e compreensão do código
- Separação clara entre lógica de negócio e apresentação

### Possíveis Melhorias 🚀

1. **Componentização**: Dividir componentes grandes em subcomponentes menores
2. **Performance**: Implementar React.memo e lazy loading onde apropriado  
3. **Testes**: Aumentar cobertura com testes unitários e de integração
4. **Documentação**: Adicionar mais comentários JSDoc no código

---

## 🎯 Resultado Final

Transformamos o projeto de uma **interface puramente visual e estática** em uma **simulação interativa completa** do protocolo BB84, onde:

✅ **Alice e Bob são personagens visuais** que realmente executam o protocolo  
✅ **Fótons viajam animados** com polarização visível entre os personagens  
✅ **Bases são mostradas com angulação real** (0°, 45°, 90°, 135°)  
✅ **Simulação é completamente funcional** passo-a-passo  
✅ **Interface é intuitiva** com controles claros e feedback imediato  
✅ **Educação é o foco** com explicações visuais dos conceitos quânticos  

*De um protótipo visual para uma ferramenta educacional completa! 🚀* 