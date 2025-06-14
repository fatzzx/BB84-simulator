/**
 * Utilitários para simulação BB84
 */

/**
 * Retorna o número exato de transmissões que serão realizadas
 * Agora trabalhamos com transmissões diretas ao invés de estimar baseado no tamanho da chave
 */
export function calculateEstimatedSteps(transmissions: number): number {
  return transmissions;
}
