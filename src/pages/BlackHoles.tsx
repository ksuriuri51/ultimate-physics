import SpacetimeCurvature from "@/components/SpacetimeCurvature";
import GravitationalLensing from "@/components/GravitationalLensing";

export default function BlackHoles() {
  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-2">Black Holes & Cosmology</h1>
      <p className="text-muted-foreground mb-8">Visualizations based on general relativity: spacetime curvature and gravitational lensing</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold mb-4">Spacetime Curvature</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Mass warps spacetime. This visualization shows the Schwarzschild metric: how a massive object curves the fabric of spacetime around it. Adjust the mass to see stronger curvature.
          </p>
          <SpacetimeCurvature width={500} height={350} />
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Gravitational Lensing</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Light bends around massive objects. Move the black hole to see how background starlight is deflected and distorted by the gravitational field.
          </p>
          <GravitationalLensing width={500} height={500} />
        </div>
      </div>
    </div>
  );
}

