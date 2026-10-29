import { describe, it, expect } from "vitest";
import { BB84Simulator } from "@/simulation/bb84";
import { ISimulationConfig } from "@/types";

const makeConfig = (
  overrides: Partial<ISimulationConfig> = {}
): ISimulationConfig => ({
  keyLength: 20,
  eavesdropperPresent: false,
  visualizationSpeed: 1000,
  ...overrides,
});

describe("BB84Simulator.simulateStep", () => {
  const sim = new BB84Simulator(makeConfig());

  it("mantém o bit quando as bases coincidem e não há espião", () => {
    for (const basis of ["computational", "hadamard"] as const) {
      for (const bit of [0, 1] as const) {
        const step = sim.simulateStep(1, bit, basis, basis);
        expect(step.result.basesMatch).toBe(true);
        expect(step.result.willKeep).toBe(true);
        expect(step.result.bitPreserved).toBe(true);
        expect(step.bob.bit).toBe(bit);
      }
    }
  });

  it("descarta o bit quando as bases diferem", () => {
    const step = sim.simulateStep(1, 1, "computational", "hadamard");
    expect(step.result.basesMatch).toBe(false);
    expect(step.result.willKeep).toBe(false);
    expect(step.result.bitPreserved).toBe(false);
  });

  it("usa os ângulos de polarização de cada base", () => {
    expect(sim.simulateStep(1, 0, "computational", "computational").alice.angle).toBe(0);
    expect(sim.simulateStep(1, 1, "computational", "computational").alice.angle).toBe(90);
    expect(sim.simulateStep(1, 0, "hadamard", "hadamard").alice.angle).toBe(45);
    expect(sim.simulateStep(1, 1, "hadamard", "hadamard").alice.angle).toBe(135);
  });

  it("orienta o detector de Bob conforme o bit medido (sem sorteio)", () => {
    const step = sim.simulateStep(1, 1, "computational", "computational");
    expect(step.bob.measurementAngle).toBe(90);
  });
});

describe("BB84Simulator.simulateAll", () => {
  it("gera exatamente keyLength transmissões numeradas em sequência", () => {
    const steps = new BB84Simulator(makeConfig({ keyLength: 37 })).simulateAll();
    expect(steps).toHaveLength(37);
    expect(steps.map((s) => s.step)).toEqual(
      Array.from({ length: 37 }, (_, i) => i + 1)
    );
  });

  it("não introduz erros na chave sem espião", () => {
    const steps = new BB84Simulator(makeConfig({ keyLength: 500 })).simulateAll();
    const kept = steps.filter((s) => s.result.basesMatch);
    expect(kept.length).toBeGreaterThan(0);
    expect(kept.every((s) => s.result.bitPreserved)).toBe(true);
  });

  it("introduz ~25% de erros na chave quando Eve intercepta", () => {
    const steps = new BB84Simulator(
      makeConfig({ keyLength: 4000, eavesdropperPresent: true })
    ).simulateAll();
    const kept = steps.filter((s) => s.result.basesMatch);
    const errorRate =
      kept.filter((s) => !s.result.bitPreserved).length / kept.length;
    // Valor teórico 0,25; com ~2000 bits o desvio padrão é ~0,01
    expect(errorRate).toBeGreaterThan(0.2);
    expect(errorRate).toBeLessThan(0.3);
  });
});
