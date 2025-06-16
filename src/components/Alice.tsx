import React from "react";
import { TMeasurementBasis } from "@/types";
import { getBasisColor, getBitColor } from "@/utils/visualization";

interface IAliceProps {
  currentBit?: 0 | 1;
  currentBasis?: TMeasurementBasis;
  polarizationAngle?: number;
  isActive?: boolean;
}

const Alice: React.FC<IAliceProps> = ({
  currentBit,
  currentBasis,
  polarizationAngle = 0,
  isActive = false,
}) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Nome */}
      <h3 className="text-2xl font-bold text-quantum-primary">Alice</h3>

      {/* Avatar */}
      <div
        className={`relative w-16 h-16 rounded-full border-4 transition-all duration-300 ${
          isActive
            ? "border-quantum-primary shadow-quantum animate-pulse"
            : "border-quantum-surface"
        }`}
      >
        <div className="w-full h-full rounded-full bg-quantum-primary flex items-center justify-center">
          <span className="text-2xl">👩‍🔬</span>
        </div>

        {/* Indicador de atividade */}
        {isActive && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-quantum-accent rounded-full animate-ping"></div>
        )}
      </div>

      {/* Card de informações - tamanho fixo e maior */}
      <div className="quantum-card !p-4 w-full max-w-[280px] min-h-[320px] flex flex-col">
        <div className="text-center space-y-3 flex-1">
          <div className="text-lg font-semibold text-gray-300 mb-3">
            Preparando Qubit
          </div>

          {/* Bit value */}
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <span className="text-base text-gray-300">Bit:</span>
              <span
                className="font-mono text-2xl font-bold px-3 py-1 rounded-lg bg-gray-700/50"
                style={{ color: getBitColor(currentBit) }}
              >
                {currentBit ?? "?"}
              </span>
            </div>
          </div>

          {/* Base */}
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <span className="text-base text-gray-300">Base:</span>
              <span
                className="font-mono text-lg font-semibold px-3 py-1 rounded-lg bg-gray-700/50"
                style={{ color: getBasisColor(currentBasis) }}
              >
                {currentBasis === "computational"
                  ? "Z (+)"
                  : currentBasis === "hadamard"
                  ? "X (×)"
                  : "?"}
              </span>
            </div>
          </div>

          {/* Visualização da polarização */}
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="text-sm text-gray-400 mb-2">
              Polarização do Fóton
            </div>
            <div className="relative w-16 h-16 mx-auto mb-3">
              {/* Base circle */}
              <div className="absolute inset-0 border-2 border-gray-600 rounded-full"></div>

              {/* Polarization line */}
              {polarizationAngle !== undefined && (
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ transform: `rotate(${polarizationAngle}deg)` }}
                >
                  <div
                    className="w-12 h-1 transition-all duration-500 rounded-full"
                    style={{ backgroundColor: getBasisColor(currentBasis) }}
                  />
                </div>
              )}

              {/* Angle indicator */}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                <span
                  className="text-sm font-mono px-2 py-1 rounded bg-gray-700/50"
                  style={{ color: getBasisColor(currentBasis) }}
                >
                  {polarizationAngle ?? 0}°
                </span>
              </div>
            </div>
          </div>

          {/* Estado quântico */}
          <div className="bg-gray-800/50 rounded-lg p-2">
            <div className="text-sm text-gray-400 mb-1">Estado Quântico</div>
            <div className="text-quantum-accent font-mono text-xl font-bold">
              {currentBasis === "computational"
                ? currentBit === 0
                  ? "|0⟩"
                  : currentBit === 1
                  ? "|1⟩"
                  : "|?⟩"
                : currentBasis === "hadamard"
                ? currentBit === 0
                  ? "|+⟩"
                  : currentBit === 1
                  ? "|-⟩"
                  : "|?⟩"
                : "|?⟩"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Alice);
