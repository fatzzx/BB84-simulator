import React, { useState, useMemo } from 'react';
import { ISimulationStep } from '@/hooks/useBB84Simulation';

interface IStepHistoryProps {
  steps: ISimulationStep[];
  currentStep: number;
  onStepSelect?: (stepIndex: number) => void;
  sharedKey: number[];
  statistics: {
    totalBits: number;
    matchingBases: number;
    errorRate: number;
    keyEfficiency: number;
  };
}

// Constantes para paginação
const STEPS_PER_PAGE = 20;

// Componente individual do passo otimizado
const StepItem = React.memo<{
  step: ISimulationStep;
  index: number;
  currentStep: number;
  onStepSelect?: (stepIndex: number) => void;
}>(({ step, index, currentStep, onStepSelect }) => {
  const getBasisColor = (basis: string) => {
    return basis === 'computational' ? '#00d4ff' : '#9d4edd';
  };

  const getBitColor = (bit: 0 | 1) => {
    return bit === 0 ? '#00ff88' : '#ff6b6b';
  };

  return (
    <div
      className={`p-3 rounded-lg border transition-all duration-200 overflow-hidden ${
        index === currentStep - 1
          ? 'bg-quantum-blue/20 border-quantum-blue/50'
          : 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-700/50'
      } ${onStepSelect ? 'cursor-pointer' : ''}`}
      onClick={() => onStepSelect && onStepSelect(index)}
    >
      <div className="flex items-center justify-between">
        <div className="font-mono text-sm">
          Passo {step.step}
        </div>
        <div className={`text-xs px-2 py-1 rounded ${
          step.result.basesMatch 
            ? 'bg-green-900/50 text-green-300' 
            : 'bg-red-900/50 text-red-300'
        }`}>
          {step.result.basesMatch ? '✓' : '✗'}
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mt-2 text-xs">
        {/* Alice */}
        <div className="text-center">
          <div className="text-gray-400 mb-1">Alice</div>
          <div className="flex flex-col space-y-1">
            <div>
              Bit: <span style={{ color: getBitColor(step.alice.bit) }}>
                {step.alice.bit}
              </span>
            </div>
            <div>
              Base: <span style={{ color: getBasisColor(step.alice.basis) }}>
                {step.alice.basis === 'computational' ? 'Z' : 'X'}
              </span>
            </div>
          </div>
        </div>

        {/* Resultado */}
        <div className="text-center">
          <div className="text-gray-400 mb-1">Resultado</div>
          <div className="flex flex-col space-y-1">
            <div className={step.result.basesMatch ? 'text-green-400' : 'text-red-400'}>
              {step.result.basesMatch ? 'Match' : 'Diff'}
            </div>
            <div className="text-gray-400">
              {step.result.willKeep ? 'Kept' : 'Drop'}
            </div>
          </div>
        </div>

        {/* Bob */}
        <div className="text-center">
          <div className="text-gray-400 mb-1">Bob</div>
          <div className="flex flex-col space-y-1">
            <div>
              Bit: <span style={{ color: getBitColor(step.bob.bit) }}>
                {step.bob.bit}
              </span>
            </div>
            <div>
              Base: <span style={{ color: getBasisColor(step.bob.basis) }}>
                {step.bob.basis === 'computational' ? 'Z' : 'X'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

StepItem.displayName = 'StepItem';

const StepHistory: React.FC<IStepHistoryProps> = ({ 
  steps, 
  currentStep, 
  onStepSelect,
  sharedKey,
  statistics
}) => {
  const [currentPage, setCurrentPage] = useState(0);

  // Calcula paginação com memoização
  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(steps.length / STEPS_PER_PAGE);
    const startIndex = currentPage * STEPS_PER_PAGE;
    const endIndex = Math.min(startIndex + STEPS_PER_PAGE, steps.length);
    const currentSteps = steps.slice(startIndex, endIndex);
    
    return {
      totalPages,
      currentSteps,
      startIndex,
      endIndex,
      hasNextPage: currentPage < totalPages - 1,
      hasPrevPage: currentPage > 0
    };
  }, [steps, currentPage]);

  // Memoiza as estatísticas formatadas
  const formattedStatistics = useMemo(() => ({
    errorRateFormatted: (statistics.errorRate * 100).toFixed(1),
    efficiencyFormatted: (statistics.keyEfficiency * 100).toFixed(1),
    errorRateColor: statistics.errorRate > 0.11 ? 'text-red-400' : 'text-green-400'
  }), [statistics]);

  // Navega automaticamente para a última página quando novos passos são adicionados
  React.useEffect(() => {
    if (steps.length > 0) {
      const lastPage = Math.ceil(steps.length / STEPS_PER_PAGE) - 1;
      if (currentPage < lastPage) {
        setCurrentPage(lastPage);
      }
    }
  }, [steps.length, currentPage]);

  return (
    <div>
      {/* Histórico de Passos */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-bold text-quantum-blue">
            Histórico das Etapas ({steps.length})
          </h4>
          
          {/* Controles de Paginação */}
          {paginationData.totalPages > 1 && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={!paginationData.hasPrevPage}
                className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
              >
                ← Anterior
              </button>
              <span className="text-xs text-gray-400">
                {currentPage + 1} / {paginationData.totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(paginationData.totalPages - 1, currentPage + 1))}
                disabled={!paginationData.hasNextPage}
                className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
              >
                Próxima →
              </button>
            </div>
          )}
        </div>
        
        {steps.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            Nenhuma etapa executada ainda
          </div>
        ) : (
          <div className="max-h-64 overflow-y-auto space-y-2">
            {paginationData.currentSteps.map((step, localIndex) => (
              <StepItem
                key={step.step}
                step={step}
                index={paginationData.startIndex + localIndex}
                currentStep={currentStep}
                onStepSelect={onStepSelect}
              />
            ))}
          </div>
        )}
      </div>

      {/* Estatísticas e Chave */}
      {steps.length > 0 && (
        <>
          {/* Estatísticas */}
          <div className="mb-6">
            <h4 className="text-lg font-bold text-quantum-blue mb-4">Estatísticas</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="text-gray-400">Bits Transmitidos</div>
                <div className="text-quantum-green font-mono">
                  {statistics.totalBits}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-400">Bases Compatíveis</div>
                <div className="text-quantum-blue font-mono">
                  {statistics.matchingBases}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-400">Taxa de Erro</div>
                <div className={formattedStatistics.errorRateColor}>
                  {formattedStatistics.errorRateFormatted}%
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-400">Eficiência</div>
                <div className="text-quantum-purple font-mono">
                  {formattedStatistics.efficiencyFormatted}%
                </div>
              </div>
            </div>
          </div>

          {/* Chave Compartilhada */}
          <div>
            <h4 className="text-lg font-bold text-quantum-blue mb-4">
              Chave Compartilhada ({sharedKey.length} bits)
            </h4>
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <div className="font-mono text-quantum-green break-all text-lg">
                {sharedKey.join('') || 'Nenhuma chave gerada ainda...'}
              </div>
              {sharedKey.length > 0 && (
                <div className="mt-2 text-xs text-gray-400">
                  Representação hexadecimal: {
                    parseInt(sharedKey.join('') || '0', 2).toString(16).toUpperCase()
                  }
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default React.memo(StepHistory); 