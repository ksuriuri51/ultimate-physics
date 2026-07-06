import { useEffect, useRef, useState } from 'react';
import { generatePlanetaryData, powerLawRegression, predictPowerLaw } from '@/lib/ml';

interface KeplersLawRegressionProps {
  width?: number;
  height?: number;
}

export default function KeplersLawRegression({ width = 700, height = 500 }: KeplersLawRegressionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);
  const [showFit, setShowFit] = useState(false);
  const [result, setResult] = useState<any>(null);

  const data = generatePlanetaryData();

  useEffect(() => {
    if (progress >= 100 && !result) {
      const regression = powerLawRegression(data);
      setResult(regression);
      setShowFit(true);
    }
  }, [progress, result]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--background').trim() || '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Draw axes
    const padding = 60;
    const plotWidth = width - 2 * padding;
    const plotHeight = height - 2 * padding;

    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border').trim() || '#ccc';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();

    // Draw axis labels
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--foreground').trim() || '#000000';
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Semi-major axis (AU)', width / 2, height - 10);
    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Orbital period (years)', 0, 0);
    ctx.restore();

    // Find data range
    const maxX = Math.max(...data.map(d => d.x));
    const maxY = Math.max(...data.map(d => d.y));

    // Draw data points
    const dataPointsToShow = Math.floor((progress / 100) * data.length);
    for (let i = 0; i < dataPointsToShow; i++) {
      const point = data[i];
      const px = padding + (point.x / maxX) * plotWidth;
      const py = height - padding - (point.y / maxY) * plotHeight;

      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--secondary').trim() || '#617891';
      ctx.beginPath();
      ctx.arc(px, py, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw regression curve if complete
    if (showFit && result) {
      ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d5b893';
      ctx.lineWidth = 2;
      ctx.beginPath();

      for (let x = 0; x <= maxX; x += 0.1) {
        const y = predictPowerLaw(x, result);
        const px = padding + (x / maxX) * plotWidth;
        const py = height - padding - (y / maxY) * plotHeight;

        if (x === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }

    // Draw grid
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border').trim() || '#e0e0e0';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.3;
    for (let i = 1; i < 5; i++) {
      const x = padding + (i / 5) * plotWidth;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();

      const y = height - padding - (i / 5) * plotHeight;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }, [progress, showFit, result, width, height, data]);

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
          <button
            onClick={() => {
              setProgress(0);
              setResult(null);
              setShowFit(false);
              const interval = setInterval(() => {
                setProgress(p => {
                  if (p >= 100) {
                    clearInterval(interval);
                    return 100;
                  }
                  return p + 2;
                });
              }, 50);
            }}
            className="px-4 py-2 bg-accent text-accent-foreground rounded-md hover:opacity-90 transition-opacity"
          >
            Discover Kepler's Law
          </button>
          <div className="flex-1 bg-secondary rounded-full h-2 overflow-hidden">
            <div
              className="bg-accent h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {result && (
          <div className="p-4 bg-secondary/20 rounded-lg space-y-2 text-sm">
            <div className="font-bold">Discovered Relationship:</div>
            <div className="font-mono">
              T = {result.coefficient.toFixed(3)} × a^{result.exponent.toFixed(2)}
            </div>
            <div className="text-muted-foreground">
              (Kepler's Law predicts: T² = a³, or T = a^1.5)
            </div>
            <div className="text-muted-foreground">
              Fit quality (R²): {(result.r2 * 100).toFixed(1)}%
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
