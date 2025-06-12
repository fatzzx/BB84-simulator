import React from 'react';
import { ISimulationStep } from '@/hooks/useBB84Simulation';

interface IStepHistoryProps {
  steps: ISimulationStep[];
  currentStep: number;
  onStepSelect?: (stepIndex: number) => void;
}

const StepHistory: React.FC<IStepHistoryProps> = ({ 
  steps, 
  currentStep, 
  onStepSelect 
}) => {
  const getBasisColor = (basis: string) => {
    return basis === 'computational' ? '#00d4ff' : '#9d4edd';
  };

  const getBitColor = (bit: 0 | 1) => {
    return bit === 0 ? '#00ff88' : '#ff6b6b';
  };

  return (
    <div className="quantum-card">
      <h3 className="text-lg font-bold text-quantum-blue mb-4">
        Histórico das Etapas ({steps.length})
      </h3>
      
      {steps.length === 0 ? (
        <div className="text-center text-gray-400 py-8">
          Nenhuma etapa executada ainda
        </div>
      ) : (
        <div className="max-h-64 overflow-y-auto space-y-2">
          {steps.map((step, index) => (
            <div
              key={step.step}
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
          ))}
        </div>
      )}
      
      {steps.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700/50">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="text-gray-400">Bits mantidos</div>
              <div className="text-quantum-green font-mono">
                {steps.filter(s => s.result.willKeep).length}
              </div>
            </div>
            <div className="text-center">
              <div className="text-gray-400">Taxa de match</div>
              <div className="text-quantum-blue font-mono">
                {steps.length > 0 ? Math.round((steps.filter(s => s.result.basesMatch).length / steps.length) * 100) : 0}%
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StepHistory; 