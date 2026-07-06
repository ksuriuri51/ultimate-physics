import { useEffect, useRef, useState } from 'react';
import { traceLightRay, MassObject } from '@/lib/cosmology';

interface GravitationalLensingProps {
  width?: number;
  height?: number;
}

export default function GravitationalLensing({ width = 600, height = 600 }: GravitationalLensingProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [blackHoleMass, setBlackHoleMass] = useState(5);
  const [blackHoleX, setBlackHoleX] = useState(0.5);
  const [blackHoleY, setBlackHoleY] = useState(0.5);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--background').trim() || '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Draw background stars
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--foreground').trim() || '#000000';
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, Math.PI * 2);
      ctx.fill();
    }

    const blackHole: MassObject = {
      x: blackHoleX * width,
      y: blackHoleY * height,
      mass: blackHoleMass,
    };

    // Draw light rays being bent
    const rayCount = 12;
    for (let i = 0; i < rayCount; i++) {
      const angle = (i / rayCount) * Math.PI * 2;
      const startX = width / 2 + Math.cos(angle) * width * 0.4;
      const startY = height / 2 + Math.sin(angle) * height * 0.4;

      const path = traceLightRay(startX, startY, blackHole, 100);

      ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d5b893';
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.moveTo(path[0].x, path[0].y);
      for (let j = 1; j < path.length; j++) {
        ctx.lineTo(path[j].x, path[j].y);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // Draw black hole
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--foreground').trim() || '#000000';
    ctx.beginPath();
    ctx.arc(blackHole.x, blackHole.y, 20, 0, Math.PI * 2);
    ctx.fill();

    // Draw event horizon
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d5b893';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(blackHole.x, blackHole.y, 30, 0, Math.PI * 2);
    ctx.stroke();
  }, [blackHoleMass, blackHoleX, blackHoleY, width, height]);

  return (
    <div className="flex flex-col gap-4">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border border-border rounded-lg bg-card"
      />
      <div className="space-y-3">
        <div className="flex items-center gap-4">
          <label className="text-sm text-muted-foreground w-24">Mass:</label>
          <input
            type="range"
            min="1"
            max="20"
            value={blackHoleMass}
            onChange={(e) => setBlackHoleMass(Number(e.target.value))}
            className="flex-1"
          />
          <span className="text-sm font-mono w-16">{blackHoleMass.toFixed(1)} M☉</span>
        </div>
        <div className="flex items-center gap-4">
          <label className="text-sm text-muted-foreground w-24">X Position:</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={blackHoleX}
            onChange={(e) => setBlackHoleX(Number(e.target.value))}
            className="flex-1"
          />
          <span className="text-sm font-mono w-16">{(blackHoleX * 100).toFixed(0)}%</span>
        </div>
        <div className="flex items-center gap-4">
          <label className="text-sm text-muted-foreground w-24">Y Position:</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={blackHoleY}
            onChange={(e) => setBlackHoleY(Number(e.target.value))}
            className="flex-1"
          />
          <span className="text-sm font-mono w-16">{(blackHoleY * 100).toFixed(0)}%</span>
        </div>
      </div>
    </div>
  );
}
