import { useEffect, useRef, useState } from 'react';
import { mandelbrotIterations } from '@/lib/math';

interface MandelbrotFractalProps {
  width?: number;
  height?: number;
}

export default function MandelbrotFractal({ width = 600, height = 600 }: MandelbrotFractalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1);
  const [centerX, setCenterX] = useState(-0.5);
  const [centerY, setCenterY] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    const maxIterations = 100;
    const scale = 3.5 / zoom;

    for (let py = 0; py < height; py++) {
      for (let px = 0; px < width; px++) {
        const x = centerX + (px - width / 2) * scale / width;
        const y = centerY + (py - height / 2) * scale / height;

        const iterations = mandelbrotIterations(x, y, maxIterations);
        const hue = (iterations / maxIterations) * 360;
        const saturation = 100;
        const lightness = iterations === maxIterations ? 0 : 50;

        const rgb = hslToRgb(hue, saturation, lightness);

        const index = (py * width + px) * 4;
        data[index] = rgb.r;
        data[index + 1] = rgb.g;
        data[index + 2] = rgb.b;
        data[index + 3] = 255;
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }, [zoom, centerX, centerY, width, height]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const scale = 3.5 / zoom;
    const newCenterX = centerX + (x - width / 2) * scale / width;
    const newCenterY = centerY + (y - height / 2) * scale / height;

    setCenterX(newCenterX);
    setCenterY(newCenterY);
    setZoom(z => z * 2);
  };

  return (
    <div className="flex flex-col gap-4">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onClick={handleClick}
        className="border border-border rounded-lg bg-card cursor-zoom-in"
      />
      <div className="text-sm text-muted-foreground">
        <div>Zoom: <span className="font-mono">{zoom.toFixed(1)}x</span></div>
        <div>Click to zoom in</div>
      </div>
    </div>
  );
}

function hslToRgb(h: number, s: number, l: number) {
  const c = (1 - Math.abs(2 * l / 100 - 1)) * s / 100;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l / 100 - c / 2;

  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}
