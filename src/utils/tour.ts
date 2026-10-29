import { driver, DriveStep } from "driver.js";
import type { Side } from "driver.js";
import type { TFunction } from "i18next";
import { TTourStepId } from "@/i18n/types";
import "driver.js/dist/driver.css";
import "@/styles/tour.css";

interface ITourStepConfig {
  id: TTourStepId;
  // Valor do atributo data-tour do elemento destacado; sem alvo = popover centralizado
  target?: string;
  side?: Side;
}

const TOUR_STEPS: ITourStepConfig[] = [
  { id: "intro" },
  { id: "alice", target: "alice", side: "right" },
  { id: "channel", target: "channel", side: "top" },
  { id: "bob", target: "bob", side: "left" },
  { id: "keys" },
  { id: "step", target: "step", side: "top" },
  { id: "auto", target: "auto", side: "top" },
  { id: "pause", target: "pause", side: "top" },
  { id: "complete", target: "complete", side: "top" },
  { id: "settings", target: "settings", side: "bottom" },
  { id: "eve", target: "eve", side: "bottom" },
];

// Fechamentos feitos pelo usuário; "api" (destroy programático) não conta
const USER_CLOSE_REASONS = ["done", "close", "escape", "overlay"];

/**
 * Inicia o tour guiado. `onFinish` roda quando o usuário conclui ou fecha o tour.
 * Retorna uma função que cancela o tour sem chamar `onFinish`.
 */
export function startTour(t: TFunction, onFinish: () => void): () => void {
  const steps: DriveStep[] = TOUR_STEPS.map(({ id, target, side }) => ({
    element: target ? `[data-tour="${target}"]` : undefined,
    popover: {
      title: t(`tutorial.steps.${id}.title`),
      description: t(`tutorial.steps.${id}.body`),
      side,
      align: "center",
    },
  }));

  const tour = driver({
    steps,
    showProgress: true,
    progressText: "{{current}} / {{total}}",
    nextBtnText: t("tutorial.next"),
    prevBtnText: t("tutorial.previous"),
    doneBtnText: t("tutorial.done"),
    closeBtnLabel: t("tutorial.close"),
    popoverClass: "bb84-tour",
    overlayColor: "#020617",
    overlayOpacity: 0.75,
    stagePadding: 8,
    stageRadius: 12,
    onDestroyed: (_element, _step, { reason }) => {
      if (reason && USER_CLOSE_REASONS.includes(reason)) onFinish();
    },
  });

  tour.drive();

  return () => {
    if (tour.isActive()) tour.destroy();
  };
}
