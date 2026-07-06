import FourierEpicycles from "@/components/FourierEpicycles";
import MandelbrotFractal from "@/components/MandelbrotFractal";

export default function VisualMath() {
  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-2">Visual Math</h1>
      <p className="text-muted-foreground mb-8">Fourier series decomposition and fractal geometry</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold mb-4">Fourier Epicycles</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Any periodic curve can be reconstructed as a sum of rotating circles (epicycles). Draw a shape and watch the algorithm decompose it using Fourier series. Each circle rotates at a different frequency and amplitude.
          </p>
          <FourierEpicycles width={500} height={400} />
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Mandelbrot Fractal</h2>
          <p className="text-sm text-muted-foreground mb-4">
            The Mandelbrot set is defined by iterating z → z² + c in the complex plane. Click to zoom in and explore the infinitely complex boundary. Colors represent iteration count before divergence.
          </p>
          <MandelbrotFractal width={500} height={500} />
        </div>
      </div>
    </div>
  );
}

