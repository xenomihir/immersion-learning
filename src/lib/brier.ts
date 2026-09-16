export function computeBrierScore(predictedProbabilities: Record<string, number>, actualOutcome: string): number {
  // Brier score = 1/N * sum((predicted_i - actual_i)^2)
  // For a single categorical event, actual_i is 1 for the outcome that happened, and 0 for others.
  
  let score = 0;
  let count = 0;
  
  for (const [outcome, prob] of Object.entries(predictedProbabilities)) {
    const actual = outcome === actualOutcome ? 1 : 0;
    // Probabilities are expected to be between 0 and 1
    score += Math.pow(prob - actual, 2);
    count++;
  }
  
  if (count === 0) return 0;
  return score / count; // Some definitions don't divide by N, but this normalizes it
}
