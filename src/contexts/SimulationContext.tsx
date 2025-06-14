import React, { createContext, useContext, ReactNode } from "react";
import { ISimulationStep } from "@/hooks/useBB84Simulation";

interface SimulationContextType {
  currentStepData: ISimulationStep | null;
  currentStep: number;
  isActive: boolean;
  animationPhase: "preparing" | "transmitting" | "measuring" | "complete";
}

interface SimulationProviderProps {
  children: ReactNode;
  value: SimulationContextType;
}

const SimulationContext = createContext<SimulationContextType | undefined>(
  undefined
);

export const SimulationProvider: React.FC<SimulationProviderProps> = ({
  children,
  value,
}) => {
  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulationContext = () => {
  const context = useContext(SimulationContext);
  if (context === undefined) {
    throw new Error(
      "useSimulationContext must be used within a SimulationProvider"
    );
  }
  return context;
};
