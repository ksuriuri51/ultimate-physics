import { useEffect, useRef, useState } from 'react';
import { DoublePendulum, DoublePendulumParams, DoublePendulumState } from '@/lib/physics';

interface DoublePendulumCanvasProps {
  width?: number;
  height?: number;
  showTrajectory?: boolean;
}

export default function DoublePendulumCanvas({
  width = 600,
  height = 600,
  showTrajectory = true,
}: DoublePendulumCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pendulumRef = useRef<DoublePendulum | null>(null);
  const trajectoryRef = useRef<Array<{ x: number; y: number }>>([]);
  const animationRef = useRef<number | null>(null);
  const [isRunning, setIsRunning] = useState(true);
  const [energy, setEnergy] = useState(0);

  useEffect(() => {
    // Initialize pendulum with chaotic initial conditions
    const params: DoublePendulumParams = {
      L1: 1.0,
      L2: 1.0,
      m1: 1.0,
      m2: 1.0,
      g: 9.81,
    };

    const initialState: DoublePendulumState = {
      theta1: Math.PI / 2 + 0.1,
      theta2: Math.PI / 2 - 0.1,
      omega1: 0,
      omega2: 0,
    };

    pendulumRef.current = new DoublePendulum(params, initialState);
    trajectoryRef.current = [];

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scale = Math.min(width, height) / 5;
    const centerX = width / 2;
    const centerY = height / 2.5;

    const animate = () => {
      if (!pendulumRef.current || !ctx) return;

      // Simulation step (RK4 integration)
      if (isRunning) {
        const dt = 0.01; // 10ms timestep
        pendulumRef.current.step(dt);

        // Record trajectory of second bob
        const pos = pendulumRef.current.getPositions();
        trajectoryRef.current.push({ x: pos.x2, y: pos.y2 });
        if (trajectoryRef.current.length > 2000) {
          trajectoryRef.current.shift();
        }

        setEnergy(pendulumRef.current.getEnergy());
      }

      // Clear canvas
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--background').trim() || '#ffffff';
      ctx.fillRect(0, 0, width, height);

      // Draw trajectory
      if (showTrajectory && trajectoryRef.current.length > 1) {
        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d5b893';
        ctx.globalAlpha = 0.3;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(centerX + trajectoryRef.current[0].x * scale, centerY + trajectoryRef.current[0].y * scale);
        for (let i = 1; i < trajectoryRef.current.length; i++) {
          ctx.lineTo(centerX + trajectoryRef.current[i].x * scale, centerY + trajectoryRef.current[i].y * scale);
        }
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // Get current positions
      const pos = pendulumRef.current.getPositions();

      // Draw pivot
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--foreground').trim() || '#000000';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 6, 0, Math.PI * 2);
      ctx.fill();

      // Draw first arm
      ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--secondary').trim() || '#617891';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + pos.x1 * scale, centerY + pos.y1 * scale);
      ctx.stroke();

      // Draw first bob
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--secondary').trim() || '#617891';
      ctx.beginPath();
      ctx.arc(centerX + pos.x1 * scale, centerY + pos.y1 * scale, 8, 0, Math.PI * 2);
      ctx.fill();

      // Draw second arm
      ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d5b893';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(centerX + pos.x1 * scale, centerY + pos.y1 * scale);
      ctx.lineTo(centerX + pos.x2 * scale, centerY + pos.y2 * scale);
      ctx.stroke();

      // Draw second bob
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d5b893';
      ctx.beginPath();
      ctx.arc(centerX + pos.x2 * scale, centerY + pos.y2 * scale, 8, 0, Math.PI * 2);
      ctx.fill();

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [width, height, showTrajectory, isRunning]);

  return (
    <div className="flex flex-col gap-4">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border border-border rounded-lg bg-card"
      />
      <div className="flex gap-4 items-center text-sm">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="px-4 py-2 bg-accent text-accent-foreground rounded-md hover:opacity-90 transition-opacity"
        >
          {isRunning ? 'Pause' : 'Play'}
        </button>
        <div className="text-muted-foreground">
          Energy: <span className="font-mono">{energy.toFixed(2)}</span> J
        </div>
      </div>
    </div>
  );
}

