import { useEffect, useRef, useState } from 'react';
import { computeEpicycles, reconstructFromEpicycles, Point } from '@/lib/math';

interface FourierEpicyclesProps {
  width?: number;
  height?: number;
}

export default function FourierEpicycles({ width = 600, height = 400 }: FourierEpicyclesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [path, setPath] = useState<Point[]>([]);
  const [epicycles, setEpicycles] = useState<any[]>([]);
  const [time, setTime] = useState(0);
  const animationRef = useRef<number | null>(null);

  const handleMouseDown = (e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    setIsDrawing(true);
    setPath([{ x: e.clientX - rect.left - width / 2, y: e.clientY - rect.top - height / 2 }]);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    setPath(p => [...p, { x: e.clientX - rect.left - width / 2, y: e.clientY - rect.top - height / 2 }]);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    if (path.length > 10) {
      const computed = computeEpicycles(path, 40);
      setEpicycles(computed);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.addEventListener('mousedown', handleMouseDown as any);
    canvas.addEventListener('mousemove', handleMouseMove as any);
    canvas.addEventListener('mouseup', handleMouseUp);
    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown as any);
      canvas.removeEventListener('mousemove', handleMouseMove as any);
      canvas.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDrawing, path]);

  useEffect(() => {
    if (epicycles.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = width / 2;
    const centerY = height / 2;

    const animate = () => {
      // Clear
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--background').trim() || '#ffffff';
      ctx.fillRect(0, 0, width, height);

      // Draw original path
      if (path.length > 1) {
        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--muted-foreground').trim() || '#999';
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.moveTo(centerX + path[0].x, centerY + path[0].y);
        for (let i = 1; i < path.length; i++) {
          ctx.lineTo(centerX + path[i].x, centerY + path[i].y);
        }
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // Draw epicycles
      let x = 0;
      let y = 0;
      const t = (time % 1) * Math.PI * 2;

      for (let i = 0; i < epicycles.length; i++) {
        const epicycle = epicycles[i];
        const angle = epicycle.frequency * t + epicycle.phase;
        const nextX = x + epicycle.amplitude * Math.cos(angle);
        const nextY = y + epicycle.amplitude * Math.sin(angle);

        // Draw circle
        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--secondary').trim() || '#617891';
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(centerX + x, centerY + y, epicycle.amplitude, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;

        // Draw line to next center
        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--secondary').trim() || '#617891';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(centerX + x, centerY + y);
        ctx.lineTo(centerX + nextX, centerY + nextY);
        ctx.stroke();

        x = nextX;
        y = nextY;
      }

      // Draw final point
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d5b893';
      ctx.beginPath();
      ctx.arc(centerX + x, centerY + y, 4, 0, Math.PI * 2);
      ctx.fill();

      setTime(t => (t + 0.01) % 1);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [epicycles, path, width, height]);

  return (
    <div className="flex flex-col gap-4">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border border-border rounded-lg bg-card cursor-crosshair"
      />
      <p className="text-sm text-muted-foreground">
        {epicycles.length === 0 ? 'Draw a shape to see Fourier epicycles' : `Using ${epicycles.length} epicycles`}
      </p>
    </div>
  );
}

