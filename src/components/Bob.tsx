import React from "react";
import { TMeasurementBasis } from "@/types";

interface IBobProps {
  currentBasis?: TMeasurementBasis;
  measuredBit?: 0 | 1;
  measurementAngle?: number;
  photonAngle?: number;
  isActive?: boolean;
  showResult?: boolean;
  basesMatch?: boolean;
}

const Bob: React.FC<IBobProps> = ({
  currentBasis,
  measuredBit,
  measurementAngle = 0,
  photonAngle = 0,
  isActive = false,
  showResult = false,
  basesMatch = false,
}) => {
  // Cores para diferentes estados - Bob volta a usar cores similares às de Alice
  const getBasisColor = (basis?: TMeasurementBasis) => {
    if (!basis) return "#3b82f6"; // Azul similar ao de Alice
    return basis === "computational" ? "#6366f1" : "#3b82f6"; // Cores similares às de Alice
  };

  // Cores neutras para os bits - sem parecer certo/errado
  const getBitColor = (bit?: 0 | 1) => {
    if (bit === undefined) return "#64748b";
    return bit === 0 ? "#0ea5e9" : "#8b5cf6"; // Azul claro e roxo claro - cores neutras
  };

  // Função para obter símbolo da polarização
  const getPolarizationSymbol = (basis?: TMeasurementBasis) => {
    if (!basis) return "+";
    return basis === "computational" ? "+" : "×"; // + para base Z, × para base X
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Nome */}
      <h3 className="text-2xl font-bold text-quantum-secondary">Bob</h3>

      {/* Avatar */}
      <div
        className={`relative w-24 h-24 rounded-full border-4 transition-all duration-300 ${
          isActive
            ? "border-quantum-secondary shadow-quantum animate-pulse"
            : "border-quantum-surface"
        }`}
      >
        <div className="w-full h-full rounded-full bg-quantum-secondary flex items-center justify-center">
          <span className="text-3xl">👨‍🔬</span>
        </div>

        {/* Indicador de atividade */}
        {isActive && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-quantum-accent rounded-full animate-ping"></div>
        )}
      </div>

      {/* Card de informações - tamanho fixo e maior */}
      <div className="quantum-card !p-6 w-full max-w-[320px] min-h-[380px] flex flex-col">
        <div className="text-center space-y-4 flex-1">
          <div className="text-lg font-semibold text-gray-300 mb-4">
            Medindo Qubit
          </div>

          {/* Base de medição com símbolo visual */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center justify-center space-x-3 mb-2">
              <span className="text-base text-gray-300">Base:</span>
              <div className="flex items-center space-x-2">
                <span
                  className="font-mono text-lg font-semibold px-4 py-2 rounded-lg bg-gray-700/50"
                  style={{ color: getBasisColor(currentBasis) }}
                >
                  {currentBasis === "computational"
                    ? "Z"
                    : currentBasis === "hadamard"
                    ? "X"
                    : "?"}
                </span>
                <span
                  className="text-xl font-bold"
                  style={{ color: getBasisColor(currentBasis) }}
                >
                  ({getPolarizationSymbol(currentBasis)})
                </span>
              </div>
            </div>
          </div>

          {/* Resultado da medição */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center justify-center space-x-3 mb-2">
              <span className="text-base text-gray-300">Resultado:</span>
              <span
                className="font-mono text-2xl font-bold px-4 py-2 rounded-lg bg-gray-700/50"
                style={{ color: getBitColor(measuredBit) }}
              >
                {showResult && measuredBit !== undefined ? measuredBit : "?"}
              </span>
            </div>
          </div>

          {/* Visualização da medição */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-3">
              Detector Polarizado {getPolarizationSymbol(currentBasis)}
            </div>
            <div className="relative w-20 h-20 mx-auto mb-4">
              {/* Base circle */}
              <div className="absolute inset-0 border-2 border-gray-600 rounded-full"></div>

              {/* Fóton incoming (se ativo) */}
              {isActive && photonAngle !== undefined && (
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ transform: `rotate(${photonAngle}deg)` }}
                >
                  <div className="w-14 h-1 bg-quantum-accent opacity-60 animate-pulse rounded-full" />
                </div>
              )}

              {/* Detector orientation - Base Z (+) - mostrar cruz + */}
              {currentBasis === "computational" && (
                <>
                  {/* Linha horizontal */}
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ transform: `rotate(${measurementAngle}deg)` }}
                  >
                    <div
                      className="w-16 h-1 transition-all duration-500 rounded-full"
                      style={{ backgroundColor: getBasisColor(currentBasis) }}
                    />
                  </div>
                  {/* Linha vertical */}
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ transform: `rotate(${measurementAngle + 90}deg)` }}
                  >
                    <div
                      className="w-16 h-1 transition-all duration-500 rounded-full"
                      style={{ backgroundColor: getBasisColor(currentBasis) }}
                    />
                  </div>
                </>
              )}

              {/* Detector orientation - Base X (×) - duas linhas cruzadas */}
              {currentBasis === "hadamard" && (
                <>
                  {/* Primeira linha diagonal */}
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ transform: `rotate(${measurementAngle}deg)` }}
                  >
                    <div
                      className="w-14 h-1 transition-all duration-500 rounded-full"
                      style={{ backgroundColor: getBasisColor(currentBasis) }}
                    />
                  </div>
                  {/* Segunda linha diagonal perpendicular */}
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ transform: `rotate(${measurementAngle + 90}deg)` }}
                  >
                    <div
                      className="w-14 h-1 transition-all duration-500 rounded-full"
                      style={{ backgroundColor: getBasisColor(currentBasis) }}
                    />
                  </div>
                </>
              )}

              {/* Angle indicator */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                <span
                  className="text-sm font-mono px-2 py-1 rounded bg-gray-700/50"
                  style={{ color: getBasisColor(currentBasis) }}
                >
                  {measurementAngle ?? 0}°
                </span>
              </div>
            </div>
          </div>

          {/* Estado quântico medido */}
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="text-sm text-gray-400 mb-2">Estado Medido</div>
            <div className="text-quantum-accent font-mono text-lg font-bold">
              {showResult && currentBasis
                ? currentBasis === "computational"
                  ? measuredBit === 0
                    ? "|0⟩"
                    : measuredBit === 1
                    ? "|1⟩"
                    : "|?⟩"
                  : measuredBit === 0
                  ? "|+⟩"
                  : measuredBit === 1
                  ? "|-⟩"
                  : "|?⟩"
                : "|?⟩"}
            </div>
          </div>

          {/* Indicador de sucesso */}
          {showResult && basesMatch !== undefined && (
            <div className="bg-gray-800/50 rounded-lg p-3">
              <div
                className={`flex items-center justify-center space-x-2 text-lg font-semibold ${
                  basesMatch ? "text-emerald-400" : "text-orange-400"
                }`}
              >
                <span>{basesMatch ? "✓" : "✗"}</span>
                <span>
                  {basesMatch ? "Bases coincidem" : "Bases diferentes"}
                </span>
              </div>
              <div className="text-sm text-gray-400 mt-2">
                {basesMatch
                  ? "Bit será incluído na chave"
                  : "Bit será descartado"}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(Bob);
