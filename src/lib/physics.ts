/**
 * Physics Simulation Utilities
 * 
 * This module contains numerically accurate physics simulations using
 * 4th-order Runge-Kutta integration for chaotic systems.
 */

/**
 * Double Pendulum Simulation
 * 
 * Equations of Motion (Lagrangian mechanics):
 * θ₁'' = (-g(2m₁+m₂)sin(θ₁) - m₂g·sin(θ₁-2θ₂) - 2sin(θ₁-θ₂)m₂(θ₂'²L₂+θ₁'²L₁cos(θ₁-θ₂))) / (L₁(2m₁+m₂-m₂cos(2(θ₁-θ₂))))
 * θ₂'' = (2sin(θ₁-θ₂)(θ₁'²L₁(m₁+m₂)+g(m₁+m₂)cos(θ₁)+θ₂'²L₂m₂cos(θ₁-θ₂))) / (L₂(2m₁+m₂-m₂cos(2(θ₁-θ₂))))
 * 
 * Reference: Goldstein, Classical Mechanics (3rd ed.), Chapter 1
 */
export interface DoublePendulumState {
  theta1: number;  // Angle of first pendulum (radians)
  theta2: number;  // Angle of second pendulum (radians)
  omega1: number;  // Angular velocity of first pendulum
  omega2: number;  // Angular velocity of second pendulum
}

export interface DoublePendulumParams {
  L1: number;      // Length of first arm (meters)
  L2: number;      // Length of second arm (meters)
  m1: number;      // Mass of first bob (kg)
  m2: number;      // Mass of second bob (kg)
  g: number;       // Gravitational acceleration (m/s²)
}

export class DoublePendulum {
  private params: DoublePendulumParams;
  private state: DoublePendulumState;

  constructor(params: DoublePendulumParams, initialState: DoublePendulumState) {
    this.params = params;
    this.state = { ...initialState };
  }

  /**
   * Compute derivatives for the double pendulum system
   * Returns [dθ₁/dt, dω₁/dt, dθ₂/dt, dω₂/dt]
   */
  private derivatives(state: DoublePendulumState): [number, number, number, number] {
    const { theta1, theta2, omega1, omega2 } = state;
    const { L1, L2, m1, m2, g } = this.params;

    const dtheta = theta1 - theta2;
    const cosDtheta = Math.cos(dtheta);
    const sinDtheta = Math.sin(dtheta);

    const denom = L1 * (2 * m1 + m2 - m2 * Math.cos(2 * dtheta));
    
    const alpha1 = 
      (-g * (2 * m1 + m2) * Math.sin(theta1) 
       - m2 * g * Math.sin(theta1 - 2 * theta2) 
       - 2 * sinDtheta * m2 * (omega2 * omega2 * L2 + omega1 * omega1 * L1 * cosDtheta)) 
      / denom;

    const denom2 = L2 * (2 * m1 + m2 - m2 * Math.cos(2 * dtheta));
    
    const alpha2 = 
      (2 * sinDtheta * (omega1 * omega1 * L1 * (m1 + m2) 
       + g * (m1 + m2) * Math.cos(theta1) 
       + omega2 * omega2 * L2 * m2 * cosDtheta)) 
      / denom2;

    return [omega1, alpha1, omega2, alpha2];
  }

  /**
   * 4th-order Runge-Kutta integration step
   * More accurate than Euler for chaotic systems
   */
  step(dt: number): void {
    const s = this.state;
    
    // k1
    const k1 = this.derivatives(s);
    
    // k2
    const s2: DoublePendulumState = {
      theta1: s.theta1 + k1[0] * dt / 2,
      omega1: s.omega1 + k1[1] * dt / 2,
      theta2: s.theta2 + k1[2] * dt / 2,
      omega2: s.omega2 + k1[3] * dt / 2,
    };
    const k2 = this.derivatives(s2);
    
    // k3
    const s3: DoublePendulumState = {
      theta1: s.theta1 + k2[0] * dt / 2,
      omega1: s.omega1 + k2[1] * dt / 2,
      theta2: s.theta2 + k2[2] * dt / 2,
      omega2: s.omega2 + k2[3] * dt / 2,
    };
    const k3 = this.derivatives(s3);
    
    // k4
    const s4: DoublePendulumState = {
      theta1: s.theta1 + k3[0] * dt,
      omega1: s.omega1 + k3[1] * dt,
      theta2: s.theta2 + k3[2] * dt,
      omega2: s.omega2 + k3[3] * dt,
    };
    const k4 = this.derivatives(s4);
    
    // Update state
    this.state.theta1 += (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]) * dt / 6;
    this.state.omega1 += (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]) * dt / 6;
    this.state.theta2 += (k1[2] + 2 * k2[2] + 2 * k3[2] + k4[2]) * dt / 6;
    this.state.omega2 += (k1[3] + 2 * k2[3] + 2 * k3[3] + k4[3]) * dt / 6;
  }

  getState(): DoublePendulumState {
    return { ...this.state };
  }

  /**
   * Get Cartesian coordinates of the pendulum bobs
   */
  getPositions(): { x1: number; y1: number; x2: number; y2: number } {
    const { theta1, theta2 } = this.state;
    const { L1, L2 } = this.params;
    
    const x1 = L1 * Math.sin(theta1);
    const y1 = -L1 * Math.cos(theta1);
    const x2 = x1 + L2 * Math.sin(theta2);
    const y2 = y1 - L2 * Math.cos(theta2);
    
    return { x1, y1, x2, y2 };
  }

  /**
   * Compute total energy (for validation)
   */
  getEnergy(): number {
    const { theta1, theta2, omega1, omega2 } = this.state;
    const { L1, L2, m1, m2, g } = this.params;

    // Kinetic energy
    const KE1 = 0.5 * m1 * (L1 * omega1) ** 2;
    const KE2 = 0.5 * m2 * 
      ((L1 * omega1) ** 2 + (L2 * omega2) ** 2 + 
       2 * L1 * L2 * omega1 * omega2 * Math.cos(theta1 - theta2));

    // Potential energy (relative to pivot)
    const PE1 = -m1 * g * L1 * Math.cos(theta1);
    const PE2 = -m2 * g * (L1 * Math.cos(theta1) + L2 * Math.cos(theta2));

    return KE1 + KE2 + PE1 + PE2;
  }
}

/**
 * Simple Pendulum Simulation
 * 
 * Small-angle approximation: θ'' ≈ -(g/L)θ
 * Exact solution: θ'' = -(g/L)sin(θ)
 */
export interface SimplePendulumState {
  theta: number;   // Angle from vertical (radians)
  omega: number;   // Angular velocity
}

export class SimplePendulum {
  private theta: number;
  private omega: number;
  private L: number;
  private g: number;
  private useSmallAngle: boolean;

  constructor(L: number, g: number = 9.81, useSmallAngle: boolean = false) {
    this.L = L;
    this.g = g;
    this.useSmallAngle = useSmallAngle;
    this.theta = 0;
    this.omega = 0;
  }

  step(dt: number): void {
    if (this.useSmallAngle) {
      // Simple harmonic motion
      const alpha = -(this.g / this.L) * this.theta;
      this.omega += alpha * dt;
      this.theta += this.omega * dt;
    } else {
      // Exact nonlinear equation with RK4
      const k1_theta = this.omega;
      const k1_omega = -(this.g / this.L) * Math.sin(this.theta);

      const k2_theta = this.omega + k1_omega * dt / 2;
      const k2_omega = -(this.g / this.L) * Math.sin(this.theta + k1_theta * dt / 2);

      const k3_theta = this.omega + k2_omega * dt / 2;
      const k3_omega = -(this.g / this.L) * Math.sin(this.theta + k2_theta * dt / 2);

      const k4_theta = this.omega + k3_omega * dt;
      const k4_omega = -(this.g / this.L) * Math.sin(this.theta + k3_theta * dt);

      this.theta += (k1_theta + 2 * k2_theta + 2 * k3_theta + k4_theta) * dt / 6;
      this.omega += (k1_omega + 2 * k2_omega + 2 * k3_omega + k4_omega) * dt / 6;
    }
  }

  setState(theta: number, omega: number = 0): void {
    this.theta = theta;
    this.omega = omega;
  }

  getState(): SimplePendulumState {
    return { theta: this.theta, omega: this.omega };
  }

  getPosition(): { x: number; y: number } {
    return {
      x: this.L * Math.sin(this.theta),
      y: -this.L * Math.cos(this.theta),
    };
  }

  getPeriod(): number {
    if (this.useSmallAngle) {
      return 2 * Math.PI * Math.sqrt(this.L / this.g);
    }
    // Exact period requires elliptic integrals (approximation)
    const k = Math.sin(Math.abs(this.theta) / 2);
    const K = Math.PI / 2; // Simplified
    return 4 * Math.sqrt(this.L / this.g) * K;
  }
}
