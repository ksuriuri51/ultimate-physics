import { useEffect, useRef, useState } from 'react';
import { computeSpacetimeCurvature, MassObject } from '@/lib/cosmology';

interface SpacetimeCurvatureProps {
  width?: number;
  height?: number;
}

export default function SpacetimeCurvature({ width = 600, height = 400 }: SpacetimeCurvatureProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mass, setMass] = useState(5);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const massObject: MassObject = {
      x: width / 2,
      y: height / 2,
      mass,
    };

    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    for (let py = 0; py < height; py++) {
      for (let px = 0; px < width; px++) {
        const curvature = computeSpacetimeCurvature(px, py, massObject);
        const value = Math.floor(curvature * 255);

        const index = (py * width + px) * 4;
        data[index] = value;
        data[index + 1] = Math.floor(value * 0.8);
        data[index + 2] = Math.floor(value * 0.6);
        data[index + 3] = 255;
      }
    }

    ctx.putImageData(imageData, 0, 0);

    // Draw grid overlay
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }, [mass, width, height]);

  return (
    <div className="flex flex-col gap-4">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border border-border rounded-lg bg-card"
      />
      <div className="flex items-center gap-4">
        <label className="text-sm text-muted-foreground">Mass:</label>
        <input
          type="range"
          min="1"
          max="20"
          value={mass}
          onChange={(e) => setMass(Number(e.target.value))}
          className="flex-1"
        />
        <span className="text-sm font-mono">{mass.toFixed(1)} M☉</span>
      </div>
    </div>
  );
}

