import { useEffect, useState, useRef } from "react";
import { TMeasurementBasis } from "@/types";
import { getPhotonColor } from "@/utils/visualization";
import Eve from "@/components/Eve";

interface IPhotonProps {
  isActive: boolean;
  // Polarização com que o fóton chega em Bob (depois da Eve, se ela interceptou)
  polarizationAngle: number;
  // Polarização com que Alice enviou; só difere de polarizationAngle se Eve interceptou
  aliceAngle?: number;
  eavesdropperPresent?: boolean;
  bit: 0 | 1;
  basis: TMeasurementBasis;
  onAnimationComplete?: () => void;
  animationDuration?: number;
}

// Cor do fóton depois que Eve o mede e reenvia
const EVE_PHOTON_COLOR = "#f87171";
// Quanto tempo Eve fica "acesa" quando o fóton passa por ela
const INTERCEPT_HIGHLIGHT_MS = 600;
// Atraso entre resetar a posição e iniciar a transição CSS
const TRANSITION_START_DELAY_MS = 50;

const Photon: React.FC<IPhotonProps> = ({
  isActive,
  polarizationAngle,
  aliceAngle,
  eavesdropperPresent = false,
  bit,
  basis,
  onAnimationComplete,
  animationDuration = 1000,
}) => {
  const [position, setPosition] = useState(0);
  const [photonVisible, setPhotonVisible] = useState(false);
  const [passedEve, setPassedEve] = useState(false);
  const [intercepting, setIntercepting] = useState(false);

  // O pai recria o callback a cada render; guardar em ref evita reiniciar a
  // animação no meio do voo
  const onCompleteRef = useRef(onAnimationComplete);
  useEffect(() => {
    onCompleteRef.current = onAnimationComplete;
  });

  const afterEve = eavesdropperPresent && passedEve;

  // Antes de Eve o fóton tem a polarização de Alice; depois, a que ela reenviou
  const displayAngle =
    eavesdropperPresent && !passedEve
      ? aliceAngle ?? polarizationAngle
      : polarizationAngle;
  const photonColor = afterEve
    ? EVE_PHOTON_COLOR
    : getPhotonColor(basis, bit, isActive);

  useEffect(() => {
    setPassedEve(false);
    setIntercepting(false);

    if (!isActive) {
      // Se não está ativo, esconde imediatamente
      setPhotonVisible(false);
      setPosition(0);
      return;
    }

    // Reset inicial
    setPosition(0);
    setPhotonVisible(true);

    const timeouts: NodeJS.Timeout[] = [];

    // Usa requestAnimationFrame para garantir que o DOM foi atualizado
    const frame = requestAnimationFrame(() => {
      // Pequeno delay para garantir que o CSS está aplicado
      timeouts.push(
        setTimeout(() => setPosition(100), TRANSITION_START_DELAY_MS)
      );
    });

    // A transição CSS é linear: o fóton passa pelo meio (onde Eve está) na metade do tempo
    if (eavesdropperPresent) {
      const reachEveAt = animationDuration / 2 + TRANSITION_START_DELAY_MS;
      timeouts.push(
        setTimeout(() => {
          setPassedEve(true);
          setIntercepting(true);
        }, reachEveAt)
      );
      timeouts.push(
        setTimeout(
          () => setIntercepting(false),
          reachEveAt + INTERCEPT_HIGHLIGHT_MS
        )
      );
    }

    // Remove o fóton após a animação
    timeouts.push(
      setTimeout(() => {
        setPhotonVisible(false);
        setPosition(0);
        onCompleteRef.current?.();
      }, animationDuration + 200) // Adiciona buffer de 200ms
    );

    return () => {
      cancelAnimationFrame(frame);
      timeouts.forEach(clearTimeout);
    };
  }, [isActive, animationDuration, eavesdropperPresent]);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Canal quântico - SEMPRE VISÍVEL */}
      <div className="absolute top-1/2 left-0 right-0 h-2 bg-gradient-to-r from-quantum-primary/30 via-quantum-accent/60 to-quantum-secondary/30 transform -translate-y-1/2 rounded-full shadow-lg shadow-quantum-accent/20"></div>

      {/* Linha guia do canal - linha central mais sutil */}
      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-quantum-accent/30 transform -translate-y-1/2"></div>

      {/* Eve, no meio do canal, quando o espião está ativo */}
      {eavesdropperPresent && <Eve isIntercepting={intercepting} />}

      {/* Fóton viajante */}
      {photonVisible && (
        <div
          className="absolute top-1/2 transform -translate-y-1/2 z-10"
          style={{
            left: `${position}%`,
            transition: `left ${animationDuration}ms linear`,
            willChange: "transform",
          }}
        >
          {/* Partícula do fóton com polarização */}
          <div
            className="w-6 h-6 rounded-full relative"
            style={{
              backgroundColor: photonColor,
              boxShadow: `0 0 25px ${photonColor}, 0 0 50px ${photonColor}40`,
              animation: "pulse 1s ease-in-out infinite",
            }}
          >
            {/* Linha de polarização */}
            <div
              className="absolute top-1/2 left-1/2 w-8 h-0.5 bg-white/80 rounded-full"
              style={{
                transform: `translate(-50%, -50%) rotate(${displayAngle}deg)`,
              }}
            />
          </div>

          {/* Trail effect suave */}
          <div
            className="absolute top-1/2 right-full w-12 h-1 transform -translate-y-1/2 rounded-full"
            style={{
              background: `linear-gradient(to left, ${photonColor}80, transparent)`,
              opacity: 0.6,
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Photon;
