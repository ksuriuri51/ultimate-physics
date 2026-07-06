import { useEffect, useRef, useState } from 'react';
import { QuantumState, stateToBloch, blochToState, GATE_H, GATE_X, GATE_Y, GATE_Z, applyGate, getProbabilities } from '@/lib/quantum';

interface BlochSphereProps {
  width?: number;
  height?: number;
}

export default function BlochSphere({ width = 500, height = 500 }: BlochSphereProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<QuantumState>({
    alpha: { real: 1, imag: 0 },
    beta: { real: 0, imag: 0 },
  });
  const [rotation, setRotation] = useState({ theta: 0, phi: 0 });
  const [probs, setProbs] = useState({ prob0: 1, prob1: 0 });

  // Apply gate
  const applyGateToState = (gate: typeof GATE_H) => {
    const newState = applyGate(state, gate);
    setState(newState);
    setProbs(getProbabilities(newState));
  };

  // Update rotation from mouse
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      setRotation({
        theta: y * Math.PI,
        phi: x * Math.PI * 2,
      });
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    return () => canvas.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Draw Bloch sphere
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2.5;

    // Clear
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--background').trim() || '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Draw sphere grid
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border').trim() || '#e0e0e0';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.3;

    // Latitude lines
    for (let lat = 0; lat < Math.PI; lat += Math.PI / 6) {
      ctx.beginPath();
      for (let lon = 0; lon <= Math.PI * 2; lon += Math.PI / 12) {
        const x = radius * Math.sin(lat) * Math.cos(lon);
        const y = radius * Math.sin(lat) * Math.sin(lon);
        const z = radius * Math.cos(lat);

        // 3D to 2D projection
        const px = centerX + x;
        const py = centerY + z;

        if (lon === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }

    ctx.globalAlpha = 1;

    // Draw axes
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--muted-foreground').trim() || '#999';
    ctx.lineWidth = 2;

    // X axis (red)
    ctx.strokeStyle = '#ff6b6b';
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + radius, centerY);
    ctx.stroke();

    // Y axis (green)
    ctx.strokeStyle = '#51cf66';
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX, centerY - radius);
    ctx.stroke();

    // Z axis (blue)
    ctx.strokeStyle = '#4dabf7';
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX, centerY - radius * 0.7);
    ctx.stroke();

    // Draw state vector
    const bloch = stateToBloch(state);
    const stateX = bloch.x * radius;
    const stateZ = bloch.z * radius;

    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d5b893';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + stateX, centerY - stateZ);
    ctx.stroke();

    // Draw state point
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d5b893';
    ctx.beginPath();
    ctx.arc(centerX + stateX, centerY - stateZ, 8, 0, Math.PI * 2);
    ctx.fill();
  }, [state, width, height]);

  return (
    <div className="flex flex-col gap-4">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border border-border rounded-lg bg-card cursor-crosshair"
      />

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => applyGateToState(GATE_H)}
          className="px-3 py-2 bg-secondary text-foreground rounded-md hover:bg-secondary/80 transition-colors text-sm font-mono"
        >
          Hadamard
        </button>
        <button
          onClick={() => applyGateToState(GATE_X)}
          className="px-3 py-2 bg-secondary text-foreground rounded-md hover:bg-secondary/80 transition-colors text-sm font-mono"
        >
          Pauli-X
        </button>
        <button
          onClick={() => applyGateToState(GATE_Y)}
          className="px-3 py-2 bg-secondary text-foreground rounded-md hover:bg-secondary/80 transition-colors text-sm font-mono"
        >
          Pauli-Y
        </button>
        <button
          onClick={() => applyGateToState(GATE_Z)}
          className="px-3 py-2 bg-secondary text-foreground rounded-md hover:bg-secondary/80 transition-colors text-sm font-mono"
        >
          Pauli-Z
        </button>
      </div>

      <div className="text-sm text-muted-foreground space-y-1">
        <div>|0⟩ probability: <span className="font-mono">{(probs.prob0 * 100).toFixed(1)}%</span></div>
        <div>|1⟩ probability: <span className="font-mono">{(probs.prob1 * 100).toFixed(1)}%</span></div>
      </div>
    </div>
  );
}
