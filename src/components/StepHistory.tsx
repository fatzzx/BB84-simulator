import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ISimulationStep } from "@/hooks/useBB84Simulation";

interface IStepHistoryProps {
  steps: ISimulationStep[];
  currentStep: number;
  onStepSelect?: (stepIndex: number) => void;
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
  const { t } = useTranslation();

  const getBasisColor = (basis: string) => {
    return "#ffffff"; // Cor branca para bases
  };

  const getBitColor = (bit: 0 | 1) => {
    return "#ffffff"; // Cor branca para bits
  };

  return (
    <div
      className={`p-2 rounded-lg border transition-all duration-200 overflow-hidden ${
        index === currentStep - 1
          ? "bg-quantum-blue/20 border-quantum-blue/50"
          : "bg-gray-800/50 border-gray-700/50 hover:bg-gray-700/50"
      } ${onStepSelect ? "cursor-pointer" : ""}`}
      onClick={() => onStepSelect && onStepSelect(index)}
    >
      <div className="flex items-center justify-between">
        <div className="font-mono text-xs">
          {t("history.step")} {step.step}
        </div>
        <div
          className={`text-xs px-2 py-1 rounded ${
            step.result.basesMatch
              ? "bg-green-900/50 text-green-300"
              : "bg-red-900/50 text-red-300"
          }`}
        >
          {step.result.basesMatch ? "✓" : "✗"}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-2 text-xs">
        {/* Alice */}
        <div className="text-center">
          <div className="text-gray-400 mb-1 text-xs">{t("history.alice")}</div>
          <div className="flex flex-col space-y-1">
            <div>
              {t("history.bit")}{" "}
              <span style={{ color: getBitColor(step.alice.bit) }}>
                {step.alice.bit}
              </span>
            </div>
            <div>
              {t("history.base")}{" "}
              <span style={{ color: getBasisColor(step.alice.basis) }}>
                {step.alice.basis === "computational" ? "⊕" : "⊗"}
              </span>
            </div>
          </div>
        </div>

        {/* Resultado */}
        <div className="text-center">
          <div className="text-gray-400 mb-1 text-xs">
            {t("history.result")}
          </div>
          <div className="flex flex-col space-y-1">
            <div
              className={
                step.result.basesMatch ? "text-green-400" : "text-red-400"
              }
            >
              {step.result.basesMatch
                ? t("history.equal")
                : t("history.different")}
            </div>
            <div className="text-gray-400">
              {step.result.willKeep
                ? t("history.kept")
                : t("history.discarded")}
            </div>
          </div>
        </div>

        {/* Bob */}
        <div className="text-center">
          <div className="text-gray-400 mb-1 text-xs">{t("history.bob")}</div>
          <div className="flex flex-col space-y-1">
            <div>
              {t("history.bit")}{" "}
              <span style={{ color: getBitColor(step.bob.bit) }}>
                {step.bob.bit}
              </span>
            </div>
            <div>
              {t("history.base")}{" "}
              <span style={{ color: getBasisColor(step.bob.basis) }}>
                {step.bob.basis === "computational" ? "⊕" : "⊗"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

StepItem.displayName = "StepItem";

const StepHistory: React.FC<IStepHistoryProps> = ({
  steps,
  currentStep,
  onStepSelect,
}) => {
  const { t } = useTranslation();
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
      hasPrevPage: currentPage > 0,
    };
  }, [steps, currentPage]);

  // Reset da página quando steps é resetado
  React.useEffect(() => {
    if (steps.length === 0) {
      setCurrentPage(0);
    }
  }, [steps.length]);

  // Navega automaticamente para a última página quando novos passos são adicionados
  React.useEffect(() => {
    if (steps.length > 0) {
      const lastPage = Math.ceil(steps.length / STEPS_PER_PAGE) - 1;
      if (currentPage < lastPage) {
        setCurrentPage(lastPage);
      }
    }
  }, [steps.length, currentPage]);

  const handleFirstPage = () => {
    setCurrentPage(0);
  };

  const handleLastPage = () => {
    setCurrentPage(paginationData.totalPages - 1);
  };

  return (
    <div>
      {/* Histórico de Passos */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-base font-bold text-quantum-blue">
            {t("history.title")} ({steps.length})
          </h4>

          {/* Controles de Paginação */}
          {paginationData.totalPages > 1 && (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleFirstPage}
                disabled={currentPage === 0}
                className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
              >
                {t("history.first")}
              </button>
              <button
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={!paginationData.hasPrevPage}
                className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
              >
                {t("history.previous")}
              </button>
              <span className="text-xs text-gray-400">
                {currentPage + 1} / {paginationData.totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage(
                    Math.min(paginationData.totalPages - 1, currentPage + 1)
                  )
                }
                disabled={!paginationData.hasNextPage}
                className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
              >
                {t("history.next")}
              </button>
              <button
                onClick={handleLastPage}
                disabled={currentPage === paginationData.totalPages - 1}
                className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
              >
                {t("history.last")}
              </button>
            </div>
          )}
        </div>

        {/* Lista de passos */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {paginationData.currentSteps.map((step, index) => (
            <StepItem
              key={step.step}
              step={step}
              index={paginationData.startIndex + index}
              currentStep={currentStep}
              onStepSelect={onStepSelect}
            />
          ))}
        </div>

        {/* Info de paginação */}
        {paginationData.totalPages > 1 && (
          <div className="text-xs text-gray-400 mt-3 text-center">
            Mostrando {paginationData.startIndex + 1} a{" "}
            {paginationData.endIndex} de {steps.length} passos
          </div>
        )}
      </div>
    </div>
  );
};

export default StepHistory;
