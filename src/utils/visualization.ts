import { TMeasurementBasis } from "@/types";

/**
 * Utilitários para visualização de componentes quânticos
 */

// Cores para diferentes bases de medição
export const getBasisColor = (basis?: TMeasurementBasis): string => {
  if (!basis) return "#6366f1"; // Indigo padrão
  return basis === "computational" ? "#6366f1" : "#3b82f6"; // Indigo e azul
};

// Cores neutras para os bits - sem parecer certo/errado
export const getBitColor = (bit?: 0 | 1): string => {
  if (bit === undefined) return "#64748b";
  return bit === 0 ? "#0ea5e9" : "#8b5cf6"; // Azul claro e roxo claro - cores neutras
};

// Função para obter símbolo da polarização
export const getPolarizationSymbol = (basis?: TMeasurementBasis): string => {
  if (!basis) return "+";
  return basis === "computational" ? "+" : "×"; // + para base Z, × para base X
};

// Função para obter cor do fóton baseada na base e bit
export const getPhotonColor = (
  basis?: TMeasurementBasis,
  bit?: 0 | 1,
  isActive = true
): string => {
  if (!isActive) return "#6366f1";
  const baseColor = basis === "computational" ? "#6366f1" : "#3b82f6";
  // Bit 1 tem intensidade mais forte que bit 0
  return bit === 1 ? baseColor : `${baseColor}CC`;
};
