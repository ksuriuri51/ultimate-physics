/**
 * Quantum Computing Utilities
 * 
 * Implements quantum state vectors, Bloch sphere representation,
 * and quantum gates with proper matrix operations.
 */

export interface Complex {
  real: number;
  imag: number;
}

export function complexAdd(a: Complex, b: Complex): Complex {
  return { real: a.real + b.real, imag: a.imag + b.imag };
}

export function complexMult(a: Complex, b: Complex): Complex {
  return {
    real: a.real * b.real - a.imag * b.imag,
    imag: a.real * b.imag + a.imag * b.real,
  };
}

export function complexConj(a: Complex): Complex {
  return { real: a.real, imag: -a.imag };
}

export function complexMag(a: Complex): number {
  return Math.sqrt(a.real * a.real + a.imag * a.imag);
}

/**
 * Quantum State Vector (single qubit)
 * |ψ⟩ = α|0⟩ + β|1⟩
 */
export interface QuantumState {
  alpha: Complex; // Amplitude for |0⟩
  beta: Complex;  // Amplitude for |1⟩
}

/**
 * Bloch Sphere Representation
 * Maps quantum state to 3D coordinates on unit sphere
 */
export interface BlochCoordinates {
  x: number;
  y: number;
  z: number;
}

export function stateToBloch(state: QuantumState): BlochCoordinates {
  const alpha = state.alpha;
  const beta = state.beta;

  // Bloch vector components
  // x = 2 * Re(α* β)
  // y = 2 * Im(α* β)
  // z = |α|² - |β|²

  const alphaBetaConj = complexMult(complexConj(alpha), beta);

  return {
    x: 2 * alphaBetaConj.real,
    y: 2 * alphaBetaConj.imag,
    z: complexMag(alpha) ** 2 - complexMag(beta) ** 2,
  };
}

export function blochToState(bloch: BlochCoordinates): QuantumState {
  // Inverse mapping
  const theta = Math.acos(bloch.z);
  const phi = Math.atan2(bloch.y, bloch.x);

  return {
    alpha: {
      real: Math.cos(theta / 2),
      imag: 0,
    },
    beta: {
      real: Math.sin(theta / 2) * Math.cos(phi),
      imag: Math.sin(theta / 2) * Math.sin(phi),
    },
  };
}

/**
 * Quantum Gates (2x2 matrices)
 */

// Pauli X gate (NOT gate)
export const GATE_X: Complex[][] = [
  [{ real: 0, imag: 0 }, { real: 1, imag: 0 }],
  [{ real: 1, imag: 0 }, { real: 0, imag: 0 }],
];

// Pauli Y gate
export const GATE_Y: Complex[][] = [
  [{ real: 0, imag: 0 }, { real: 0, imag: -1 }],
  [{ real: 0, imag: 1 }, { real: 0, imag: 0 }],
];

// Pauli Z gate
export const GATE_Z: Complex[][] = [
  [{ real: 1, imag: 0 }, { real: 0, imag: 0 }],
  [{ real: 0, imag: 0 }, { real: -1, imag: 0 }],
];

// Hadamard gate
export const GATE_H: Complex[][] = [
  [{ real: 1 / Math.sqrt(2), imag: 0 }, { real: 1 / Math.sqrt(2), imag: 0 }],
  [{ real: 1 / Math.sqrt(2), imag: 0 }, { real: -1 / Math.sqrt(2), imag: 0 }],
];

// S gate (phase gate)
export const GATE_S: Complex[][] = [
  [{ real: 1, imag: 0 }, { real: 0, imag: 0 }],
  [{ real: 0, imag: 0 }, { real: 0, imag: 1 }],
];

// T gate
export const GATE_T: Complex[][] = [
  [{ real: 1, imag: 0 }, { real: 0, imag: 0 }],
  [{ real: 0, imag: 0 }, { real: Math.cos(Math.PI / 4), imag: Math.sin(Math.PI / 4) }],
];

export function applyGate(state: QuantumState, gate: Complex[][]): QuantumState {
  const newAlpha = complexAdd(
    complexMult(gate[0][0], state.alpha),
    complexMult(gate[0][1], state.beta)
  );
  const newBeta = complexAdd(
    complexMult(gate[1][0], state.alpha),
    complexMult(gate[1][1], state.beta)
  );
  return { alpha: newAlpha, beta: newBeta };
}

/**
 * Measurement (collapse to |0⟩ or |1⟩)
 */
export function measure(state: QuantumState): boolean {
  const prob0 = complexMag(state.alpha) ** 2;
  return Math.random() > prob0;
}

export function getProbabilities(state: QuantumState): { prob0: number; prob1: number } {
  const prob0 = complexMag(state.alpha) ** 2;
  const prob1 = complexMag(state.beta) ** 2;
  return { prob0, prob1 };
}
